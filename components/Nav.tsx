"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WorkflowNavDropdown } from "@/components/nav/WorkflowNavDropdown"
import { NavSignupButton } from "@/components/signup/SignupButtons"
import { useLang } from "@/context/LangContext"
import { useSignup } from "@/context/SignupContext"

const navLinkClass = "hover:text-gold transition-colors"
const navLinkActive = "text-gold"

export function Nav() {
  const { lang, toggleLang } = useLang()
  const { wlCount } = useSignup()
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isDungThu = pathname === "/dung-thu"
  const isWorkflow = pathname === "/workflow" || pathname.startsWith("/workflow/")

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const sectionLink = (id: string, label: string) =>
    isHome ? (
      <button type="button" className={navLinkClass} onClick={() => scrollTo(id)}>
        {label}
      </button>
    ) : (
      <Link href={`/#${id}`} className={navLinkClass}>
        {label}
      </Link>
    )

  if (isDungThu || isWorkflow) {
    return (
      <header className="sticky top-0 z-50 h-10 shrink-0 border-b border-black/10 bg-red text-white">
        <div className="flex h-full w-full items-center gap-3 px-3">
          <Link
            href="/"
            className="font-display text-base font-semibold tracking-tight sm:text-lg"
            aria-label="VietDoc — về trang chủ"
          >
            <span className="not-italic">Viet</span>
            <em className="ml-0.5 italic text-gold">Doc</em>
          </Link>
          <Link href="/" className={`text-xs font-medium ${navLinkClass}`}>
            {lang === "vi" ? "Quay lại" : "Back"}
          </Link>
          <div className="flex-1" aria-hidden />
          <div className="flex flex-shrink-0 items-center gap-2">
            <div className="hidden items-center rounded border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/95 sm:inline-flex">
              {lang === "vi" ? "Chờ" : "Waitlist"} ·{" "}
              {wlCount.toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}
            </div>
            <div className="flex overflow-hidden rounded border border-white/30 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => lang !== "vi" && toggleLang()}
                className={`px-1.5 py-0.5 ${lang === "vi" ? "bg-white text-red" : "bg-transparent text-white"}`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => lang !== "en" && toggleLang()}
                className={`px-1.5 py-0.5 ${lang === "en" ? "bg-white text-red" : "bg-transparent text-white"}`}
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

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-black/10 bg-red text-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {isHome ? (
          <button
            type="button"
            onClick={() => scrollTo("top")}
            className="font-display text-xl font-semibold tracking-tight"
            aria-label="VietDoc logo — phần mềm văn phòng Việt Nam"
          >
            <span className="not-italic">Viet</span>
            <em className="ml-0.5 italic text-gold">Doc</em>
          </button>
        ) : (
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight"
            aria-label="VietDoc logo — về trang chủ"
          >
            <span className="not-italic">Viet</span>
            <em className="ml-0.5 italic text-gold">Doc</em>
          </Link>
        )}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {sectionLink("templates", lang === "vi" ? "Biểu mẫu" : "Templates")}
          {sectionLink("legal", lang === "vi" ? "Pháp lý" : "Legal")}
          {sectionLink("contact", lang === "vi" ? "Liên hệ" : "Contact")}
        </nav>
        <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2">
          <div className="flex items-center gap-0.5 text-sm font-medium">
            <Link
              href="/dung-thu"
              className={`${navLinkClass} ${pathname === "/dung-thu" ? navLinkActive : ""}`}
            >
              {lang === "vi" ? "Dùng thử" : "Try it"}
            </Link>
            <WorkflowNavDropdown />
          </div>
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
