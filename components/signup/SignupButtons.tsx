"use client"

import { useSignup } from "@/context/SignupContext"

export function NavSignupButton() {
  const { openInd } = useSignup()
  return (
    <button
      type="button"
      onClick={openInd}
      className="cursor-pointer rounded bg-[#F5A623] px-4 py-1.5 text-xs font-semibold text-[#1A1208] transition-opacity hover:opacity-90 [font-family:var(--font-be-vietnam),ui-sans-serif]"
    >
      Đăng ký beta miễn phí →
    </button>
  )
}

export function HeroCTAButtons() {
  const { openInd, openCo } = useSignup()

  const scrollThen = (fn: () => void) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    window.setTimeout(fn, 80)
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => scrollThen(openInd)}
          className="flex cursor-pointer items-center gap-2 rounded border-none bg-white px-6 py-3 text-sm font-semibold text-[#C8102E] transition-opacity hover:opacity-90"
        >
          <i className="ti ti-user text-base" aria-hidden />
          Cá nhân
        </button>
        <button
          type="button"
          onClick={() => scrollThen(openCo)}
          className="flex cursor-pointer items-center gap-2 rounded border-none bg-[#F5A623] px-6 py-3 text-sm font-semibold text-[#1A1208] transition-opacity hover:opacity-90"
        >
          <i className="ti ti-building-store text-base" aria-hidden />
          Doanh nghiệp
        </button>
      </div>
      <p className="mt-2.5 text-xs text-white/70">
        ✓ Miễn phí trong thời gian beta · ✓ Không cần thẻ tín dụng · ✓ Huỷ bất
        cứ lúc nào
      </p>
    </div>
  )
}
