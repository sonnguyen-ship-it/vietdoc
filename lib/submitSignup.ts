export type IndividualSignupPayload = {
  type: "individual"
  name: string
  email: string
  software: string
  waitlist_display_position: number
}

export type CompanySignupPayload = {
  type: "company"
  company_name: string
  company_email: string
  contact_name: string
  contact_title: string
  industry: string
  company_size: string
  software_ids: string[]
  software_labels: string
}

export type SubmitSignupResult =
  | { status: "saved" }
  | { status: "not_configured" }
  | { status: "error"; message: string }

export async function postSignup(
  body: IndividualSignupPayload | CompanySignupPayload
): Promise<SubmitSignupResult> {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = (await res.json().catch(() => ({}))) as {
      configured?: boolean
      error?: string
    }

    if (res.status === 201) return { status: "saved" }
    if (res.ok && data.configured === false) return { status: "not_configured" }
    if (!res.ok) {
      return {
        status: "error",
        message:
          typeof data.error === "string" && data.error
            ? data.error
            : "Không gửi được. Vui lòng thử lại.",
      }
    }
    return { status: "error", message: "Phản hồi không hợp lệ từ máy chủ." }
  } catch {
    return { status: "error", message: "Lỗi mạng. Kiểm tra kết nối và thử lại." }
  }
}
