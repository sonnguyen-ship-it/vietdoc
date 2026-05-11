"use client"

import { NavSignupButton } from "@/components/signup/SignupButtons"
import { useLang } from "@/context/LangContext"
import { useSignup } from "@/context/SignupContext"

export function Nav() {
  const { lang, toggleLang } = useLang()
  const { wlCount } = useSignup()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-black/10 bg-red text-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => scrollTo("top")}
          className="font-display text-xl font-semibold tracking-tight"
        >
          <span className="not-italic">Viet</span>
          <em className="ml-0.5 italic text-gold">Doc</em>
        </button>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <button
            type="button"
            className="hover:text-gold"
            onClick={() => scrollTo("templates")}
          >
            {lang === "vi" ? "Biểu mẫu" : "Templates"}
          </button>
          <button
            type="button"
            className="hover:text-gold"
            onClick={() => scrollTo("legal")}
          >
            {lang === "vi" ? "Pháp lý" : "Legal"}
          </button>
          <button
            type="button"
            className="hover:text-gold"
            onClick={() => scrollTo("contact")}
          >
            {lang === "vi" ? "Liên hệ" : "Contact"}
          </button>
        </nav>
        <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2">
          <span className="hidden items-center rounded border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/95 sm:inline-flex">
            {lang === "vi" ? "Danh sách chờ" : "Waitlist"} ·{" "}
            {wlCount.toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}
          </span>
          <div className="flex overflow-hidden rounded border border-white/30 text-xs font-semibold">
            <button
              type="button"
              onClick={() => lang !== "vi" && toggleLang()}
              className={`px-2 py-1 ${lang === "vi" ? "bg-white text-red" : "bg-transparent text-white"}`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => lang !== "en" && toggleLang()}
              className={`px-2 py-1 ${lang === "en" ? "bg-white text-red" : "bg-transparent text-white"}`}
            >
              EN
            </button>
          </div>
          <NavSignupButton />
        </div>
      </div>
    </header>
  )
}
