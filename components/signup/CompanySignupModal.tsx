"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSignup } from "@/context/SignupContext"
import { CheckPills } from "@/components/signup/shared/CheckPills"
import { ModalShell } from "@/components/signup/shared/ModalShell"
import { RadioPills } from "@/components/signup/shared/RadioPills"
import { SuccessState } from "@/components/signup/shared/SuccessState"

const SIZES = ["1–5 người", "6–20 người", "21–100 người", "100+ người"] as const

function validateEmail(v: string) {
  const t = v.trim()
  if (!t) return "Vui lòng nhập email hợp lệ"
  if (!t.includes("@") || !t.includes(".")) return "Vui lòng nhập email hợp lệ"
  return ""
}

export function CompanySignupModal() {
  const { coOpen, closeCo } = useSignup()
  const direction = useRef<"forward" | "back">("forward")
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitted, setSubmitted] = useState(false)

  const [coName, setCoName] = useState("")
  const [coEmail, setCoEmail] = useState("")
  const [coContact, setCoContact] = useState("")
  const [coTitle, setCoTitle] = useState("")

  const [industry, setIndustry] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [software, setSoftware] = useState<string[]>([])
  const [showCrackWarning, setShowCrackWarning] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const coNameRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setStep(1)
    setSubmitted(false)
    setCoName("")
    setCoEmail("")
    setCoContact("")
    setCoTitle("")
    setIndustry("")
    setCompanySize("")
    setSoftware([])
    setShowCrackWarning(false)
    setErrors({})
    direction.current = "forward"
    closeCo()
  }, [closeCo])

  useEffect(() => {
    if (!coOpen) return
    const t = window.setTimeout(() => coNameRef.current?.focus(), 220)
    return () => window.clearTimeout(t)
  }, [coOpen])

  useEffect(() => {
    if (!coOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [coOpen, handleClose])

  const inputClass =
    "w-full rounded border border-[rgba(26,18,8,0.18)] bg-[#F5F0E4] px-3 py-2 text-sm outline-none transition-colors [font-family:var(--font-be-vietnam),ui-sans-serif] focus:border-[#C8102E] focus:bg-white"

  const labelClass =
    "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7A6E5A]"

  const errClass = "mt-1 text-[11px] text-[#C8102E]"

  const stepTitle =
    step === 1
      ? "Thông tin công ty"
      : step === 2
        ? "Ngành nghề & phần mềm hiện tại"
        : "Xác nhận & hồ sơ doanh nghiệp"

  const nextFrom1 = () => {
    const e: Record<string, string> = {}
    if (!coName.trim()) e.coName = "Vui lòng nhập tên công ty"
    const ee = validateEmail(coEmail)
    if (ee) e.coEmail = ee
    if (!coContact.trim()) e.coContact = "Vui lòng nhập tên người đại diện"
    setErrors(e)
    if (Object.keys(e).length) return
    direction.current = "forward"
    setStep(2)
  }

  const stepPaneClass =
    direction.current === "forward"
      ? "signup-step-enter-right"
      : "signup-step-enter-left"

  return (
    <ModalShell
      isOpen={coOpen}
      onClose={handleClose}
      title="Đăng ký doanh nghiệp — beta miễn phí"
      subtitle="Tham gia 127 doanh nghiệp đang dùng thử VietDoc"
      badge="Ưu tiên"
    >
      {!submitted ? (
        <>
          <div className="mb-4 flex gap-2">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  step >= n ? "bg-[#C8102E]" : "bg-[#EDE7D5]"
                }`}
              />
            ))}
          </div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-[#7A6E5A]">
            Bước {step} / 3 — {stepTitle}
          </p>

          <div key={step} className={stepPaneClass}>
            {step === 1 ? (
              <>
                <div className="mb-3">
                  <label htmlFor="co-name" className={labelClass}>
                    Tên công ty *
                  </label>
                  <input
                    ref={coNameRef}
                    id="co-name"
                    type="text"
                    value={coName}
                    onChange={(e) => {
                      setCoName(e.target.value)
                      if (errors.coName)
                        setErrors((x) => {
                          const n = { ...x }
                          delete n.coName
                          return n
                        })
                    }}
                    className={inputClass}
                  />
                  {errors.coName ? (
                    <p className={errClass}>{errors.coName}</p>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="co-email" className={labelClass}>
                    Email doanh nghiệp *
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    value={coEmail}
                    onChange={(e) => {
                      setCoEmail(e.target.value)
                      if (errors.coEmail)
                        setErrors((x) => {
                          const n = { ...x }
                          delete n.coEmail
                          return n
                        })
                    }}
                    className={inputClass}
                  />
                  <p className="mt-1 text-[11px] italic text-[#B5A98C]">
                    Email @domain.com giúp xác minh doanh nghiệp nhanh hơn
                  </p>
                  {errors.coEmail ? (
                    <p className={errClass}>{errors.coEmail}</p>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="co-contact" className={labelClass}>
                    Họ tên người đại diện *
                  </label>
                  <input
                    id="co-contact"
                    type="text"
                    value={coContact}
                    onChange={(e) => {
                      setCoContact(e.target.value)
                      if (errors.coContact)
                        setErrors((x) => {
                          const n = { ...x }
                          delete n.coContact
                          return n
                        })
                    }}
                    className={inputClass}
                  />
                  {errors.coContact ? (
                    <p className={errClass}>{errors.coContact}</p>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label htmlFor="co-title" className={labelClass}>
                    Chức vụ
                  </label>
                  <input
                    id="co-title"
                    type="text"
                    placeholder="Giám đốc / Kế toán trưởng / HR..."
                    value={coTitle}
                    onChange={(e) => setCoTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={nextFrom1}
                  className="flex w-full items-center justify-center gap-2 rounded bg-[#C8102E] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Tiếp theo →
                </button>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div className="mb-3">
                  <label htmlFor="co-industry" className={labelClass}>
                    Ngành nghề / lĩnh vực kinh doanh
                  </label>
                  <select
                    id="co-industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">-- Chọn ngành nghề --</option>
                    <option value="Sản xuất & chế biến">Sản xuất & chế biến</option>
                    <option value="Thương mại & bán lẻ">Thương mại & bán lẻ</option>
                    <option value="Dịch vụ chuyên nghiệp (kế toán, luật, tư vấn)">
                      Dịch vụ chuyên nghiệp (kế toán, luật, tư vấn)
                    </option>
                    <option value="Công nghệ & phần mềm">Công nghệ & phần mềm</option>
                    <option value="Xây dựng & bất động sản">Xây dựng & bất động sản</option>
                    <option value="F&B & nhà hàng">F&B & nhà hàng</option>
                    <option value="Giáo dục & đào tạo">Giáo dục & đào tạo</option>
                    <option value="Y tế & dược phẩm">Y tế & dược phẩm</option>
                    <option value="Logistics & vận tải">Logistics & vận tải</option>
                    <option value="Sáng tạo & truyền thông">Sáng tạo & truyền thông</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="mb-3">
                  <p className={labelClass}>Quy mô công ty</p>
                  <RadioPills
                    options={[...SIZES]}
                    value={companySize}
                    onChange={setCompanySize}
                  />
                </div>
                <div className="mb-1">
                  <p className={labelClass}>Phần mềm văn phòng đang dùng</p>
                  <CheckPills
                    options={[
                      { id: "ms-legit", label: "Microsoft Office (bản quyền)" },
                      { id: "crack", label: "Microsoft Office (crack)" },
                      { id: "google", label: "Google Workspace" },
                      { id: "wps", label: "WPS Office" },
                      { id: "none", label: "Không có / dùng giấy tờ" },
                    ]}
                    selected={software}
                    onChange={setSoftware}
                    onWarning={(id, checked) => {
                      if (id === "crack") setShowCrackWarning(checked)
                    }}
                  />
                </div>
                <div
                  className={`overflow-hidden border border-transparent transition-all duration-200 ${
                    showCrackWarning
                      ? "max-h-[120px] border-[#F59E0B] bg-[#FFFBEB] px-3 py-2.5"
                      : "max-h-0 bg-transparent px-3 py-0"
                  }`}
                >
                  <p className="text-[11px] leading-relaxed text-[#92400E]">
                    ⚠ Nghị định 13/2023/NĐ-CP quy định phạt tới 50 triệu đồng với
                    hành vi sử dụng phần mềm không bản quyền. VietDoc giúp bạn
                    chuyển đổi hợp pháp với chi phí thấp hơn nhiều.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    direction.current = "forward"
                    setStep(3)
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-[#C8102E] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Tiếp theo →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    direction.current = "back"
                    setStep(1)
                  }}
                  className="mt-2 w-full cursor-pointer text-xs text-[#7A6E5A] hover:text-[#1A1208]"
                >
                  ← Quay lại
                </button>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className="mb-4 rounded-xl border border-[rgba(26,18,8,0.18)] bg-[#F5F0E4] p-4">
                  <p className="mb-2 text-[11px] text-[#7A6E5A]">
                    Hồ sơ doanh nghiệp của bạn sẽ xuất hiện như sau:
                  </p>
                  <p className="mb-2 text-sm font-semibold text-[#1A1208]">
                    {coName || "Tên công ty của bạn"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-semibold text-[#0369A1]">
                      {industry || "Chọn ngành nghề"}
                    </span>
                    <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold text-[#166534]">
                      ✓ Đã xác minh qua email
                    </span>
                    <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-semibold text-[#92400E]">
                      Thành viên beta VietDoc
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-[#B5A98C]">
                    Hồ sơ sẽ xuất hiện trong thư mục doanh nghiệp VietDoc khi ra mắt
                    chính thức.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="flex w-full items-center justify-center gap-2 rounded bg-[#F5A623] py-3 text-sm font-semibold text-[#1A1208] transition-opacity hover:opacity-90"
                >
                  <i className="ti ti-check text-base" aria-hidden />
                  Hoàn tất đăng ký →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    direction.current = "back"
                    setStep(2)
                  }}
                  className="mt-2 w-full cursor-pointer text-xs text-[#7A6E5A] hover:text-[#1A1208]"
                >
                  ← Quay lại
                </button>
              </>
            ) : null}
          </div>
        </>
      ) : (
        <SuccessState
          title={`Chào mừng ${coName || "bạn"} đến với VietDoc! 🎉`}
          subtitle="Chúng tôi sẽ liên hệ qua email trong 24 giờ để kích hoạt tài khoản doanh nghiệp."
        >
          <div className="mb-4 rounded-lg bg-[#F5F0E4] p-3 text-left">
            {[
              "Truy cập 47+ biểu mẫu pháp lý chuẩn ngay lập tức",
              "Hồ sơ công ty xuất hiện trong thư mục doanh nghiệp",
              "Ưu tiên hỗ trợ onboarding từ đội ngũ VietDoc",
            ].map((line, i, arr) => (
              <div
                key={line}
                className={`flex items-start gap-2 text-xs leading-snug text-[#7A6E5A] ${
                  i < arr.length - 1 ? "mb-1.5" : ""
                }`}
              >
                <i className="ti ti-check mt-0.5 flex-shrink-0 text-[#1D6E45]" aria-hidden />
                <span>{line}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#C8102E] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Mời đồng nghiệp tham gia →
          </button>
        </SuccessState>
      )}
    </ModalShell>
  )
}
