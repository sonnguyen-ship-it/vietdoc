"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSignup } from "@/context/SignupContext"
import { ModalShell } from "@/components/signup/shared/ModalShell"
import { RadioPills } from "@/components/signup/shared/RadioPills"
import { SuccessState } from "@/components/signup/shared/SuccessState"

const SW = ["Microsoft Office", "Google Docs", "LibreOffice", "Khác"] as const

function validateName(v: string) {
  const t = v.trim()
  if (!t) return "Vui lòng nhập họ tên"
  if (t.length < 2) return "Vui lòng nhập họ tên"
  return ""
}

function validateEmail(v: string) {
  const t = v.trim()
  if (!t) return "Vui lòng nhập email hợp lệ"
  if (!t.includes("@") || !t.includes(".")) return "Vui lòng nhập email hợp lệ"
  return ""
}

export function IndividualSignupModal() {
  const { indOpen, closeInd, wlCount } = useSignup()
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [software, setSoftware] = useState<string>(SW[0])
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [copied, setCopied] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setSubmitted(false)
    setName("")
    setEmail("")
    setSoftware(SW[0])
    setNameError("")
    setEmailError("")
    setCopied(false)
    closeInd()
  }, [closeInd])

  useEffect(() => {
    if (!indOpen) return
    const t = window.setTimeout(() => nameRef.current?.focus(), 220)
    return () => window.clearTimeout(t)
  }, [indOpen])

  useEffect(() => {
    if (!indOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [indOpen, handleClose])

  const submit = () => {
    const ne = validateName(name)
    const ee = validateEmail(email)
    setNameError(ne)
    setEmailError(ee)
    if (ne || ee) return
    setSubmitted(true)
  }

  const copyRef = () => {
    void navigator.clipboard?.writeText("vietdoc.vn/ref/abc123")
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const inputClass =
    "w-full rounded border border-[rgba(26,18,8,0.18)] bg-[#F5F0E4] px-3 py-2 text-sm outline-none transition-colors [font-family:var(--font-be-vietnam),ui-sans-serif] focus:border-[#C8102E] focus:bg-white"

  const labelClass =
    "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7A6E5A]"

  return (
    <ModalShell
      isOpen={indOpen}
      onClose={handleClose}
      title="Đăng ký cá nhân — miễn phí"
      subtitle="Truy cập ngay 47+ biểu mẫu pháp lý chuẩn Việt Nam"
    >
      {!submitted ? (
        <>
          <div className="mb-4 rounded-lg bg-[#F5F0E4] p-4 text-center">
            <p className="font-display text-3xl font-bold text-[#C8102E]">
              #{wlCount + 1}
            </p>
            <p className="mt-1 text-xs text-[#7A6E5A]">
              vị trí của bạn trong danh sách chờ
            </p>
          </div>

          <div className="mb-3">
            <label htmlFor="ind-name" className={labelClass}>
              Họ và tên
            </label>
            <input
              ref={nameRef}
              id="ind-name"
              type="text"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError("")
              }}
              className={inputClass}
            />
            {nameError ? (
              <p className="mt-1 text-xs text-[#C8102E]">{nameError}</p>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="ind-email" className={labelClass}>
              Email
            </label>
            <input
              id="ind-email"
              type="email"
              autoComplete="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError("")
              }}
              className={inputClass}
            />
            {emailError ? (
              <p className="mt-1 text-xs text-[#C8102E]">{emailError}</p>
            ) : null}
          </div>

          <div className="mb-4">
            <p className={labelClass}>Bạn thường dùng phần mềm nào?</p>
            <RadioPills
              options={[...SW]}
              value={software}
              onChange={setSoftware}
            />
          </div>

          <button
            type="button"
            onClick={submit}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#C8102E] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <i className="ti ti-user-check text-base" aria-hidden />
            Đăng ký và giữ chỗ →
          </button>
          <p className="mt-2 text-center text-[11px] text-[#B5A98C]">
            ✓ Miễn phí hoàn toàn · ✓ Không spam · ✓ Huỷ bất cứ lúc nào
          </p>
        </>
      ) : (
        <SuccessState
          title="Đã đăng ký thành công! 🎉"
          subtitle="Chúng tôi sẽ gửi email khi tài khoản được kích hoạt. Mời bạn bè để lên hàng chờ nhanh hơn."
        >
          <div className="text-left">
            <p className={labelClass}>Link giới thiệu của bạn</p>
            <div className="mb-3 flex items-center justify-between rounded border border-[rgba(26,18,8,0.18)] bg-[#F5F0E4] p-2.5">
              <span className="font-mono text-xs text-[#7A6E5A]">
                vietdoc.vn/ref/abc123
              </span>
              <button
                type="button"
                onClick={copyRef}
                className="rounded border bg-[#FDFAF4] px-2.5 py-1 text-[11px] font-medium text-[#7A6E5A] transition-colors hover:bg-[#EDE7D5]"
              >
                {copied ? "✓ Đã sao chép" : "Sao chép"}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  window.open("https://facebook.com/", "_blank", "noopener,noreferrer")
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded bg-[#1877F2] py-2 text-xs font-medium text-white transition-opacity hover:opacity-85"
              >
                <i className="ti ti-brand-facebook" aria-hidden />
                Facebook
              </button>
              <button
                type="button"
                onClick={() =>
                  window.open("https://zalo.me/", "_blank", "noopener,noreferrer")
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded bg-[#0068FF] py-2 text-xs font-medium text-white transition-opacity hover:opacity-85"
              >
                <i className="ti ti-message" aria-hidden />
                Zalo
              </button>
              <button
                type="button"
                onClick={copyRef}
                className="flex flex-1 items-center justify-center gap-1.5 rounded border bg-[#F5F0E4] py-2 text-xs font-medium text-[#1A1208] transition-opacity hover:opacity-85"
              >
                <i className="ti ti-copy" aria-hidden />
                Sao chép
              </button>
            </div>
          </div>
        </SuccessState>
      )}
    </ModalShell>
  )
}
