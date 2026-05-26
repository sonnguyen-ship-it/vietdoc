import { NextResponse } from "next/server"
import {
  createSupabaseAdmin,
  isSupabaseSignupConfigured,
} from "@/lib/supabase/admin"
import type {
  CompanySignupPayload,
  IndividualSignupPayload,
} from "@/lib/submitSignup"

const MAX_LEN = 2000

function trimStr(v: unknown, max = 500): string | null {
  if (typeof v !== "string") return null
  const t = v.trim().slice(0, max)
  return t.length ? t : null
}

function isValidEmail(s: string): boolean {
  if (s.length > 320) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

function parseIndividual(body: unknown): IndividualSignupPayload | null {
  if (!body || typeof body !== "object") return null
  const o = body as Record<string, unknown>
  if (o.type !== "individual") return null
  const name = trimStr(o.name, 200)
  const email = trimStr(o.email, 320)
  const software = trimStr(o.software, 200)
  const pos = o.waitlist_display_position
  if (!name || !email || !software || !isValidEmail(email)) return null
  if (typeof pos !== "number" || !Number.isFinite(pos) || pos < 0 || pos > 1e9) return null
  return {
    type: "individual",
    name,
    email,
    software,
    waitlist_display_position: Math.floor(pos),
  }
}

function parseCompany(body: unknown): CompanySignupPayload | null {
  if (!body || typeof body !== "object") return null
  const o = body as Record<string, unknown>
  if (o.type !== "company") return null
  const company_name = trimStr(o.company_name, 300)
  const company_email = trimStr(o.company_email, 320)
  const contact_name = trimStr(o.contact_name, 200)
  const contact_title = trimStr(o.contact_title, 200) ?? ""
  const industry = trimStr(o.industry, 300) ?? ""
  const company_size = trimStr(o.company_size, 100) ?? ""
  if (!company_name || !company_email || !contact_name) return null
  if (!isValidEmail(company_email)) return null
  if (!Array.isArray(o.software_ids)) return null
  const software_ids = o.software_ids
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.slice(0, 64))
    .slice(0, 32)
  const software_labels = trimStr(o.software_labels, MAX_LEN) ?? ""
  return {
    type: "company",
    company_name,
    company_email,
    contact_name,
    contact_title,
    industry,
    company_size,
    software_ids,
    software_labels,
  }
}

export async function POST(request: Request) {
  if (!isSupabaseSignupConfigured()) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const individual = parseIndividual(raw)
  const company = !individual ? parseCompany(raw) : null
  const payload = individual ?? company
  if (!payload) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const supabase = createSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  const email =
    payload.type === "individual" ? payload.email : payload.company_email

  const { error } = await supabase.from("signups").insert({
    signup_type: payload.type,
    email,
    payload: payload as unknown as Record<string, unknown>,
  })

  if (error) {
    console.error("[signup]", error.message)
    return NextResponse.json(
      { error: "Không lưu được dữ liệu. Thử lại sau." },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
