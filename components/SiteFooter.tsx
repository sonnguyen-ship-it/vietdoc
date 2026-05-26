"use client"

import Link from "next/link"
import { useLang } from "@/context/LangContext"

export function SiteFooter() {
  const { lang } = useLang()

  return (
    <footer className="border-t border-black/10 bg-paper2">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-center text-xs text-muted sm:text-left">
          {lang === "vi"
            ? `© ${new Date().getFullYear()} VietDoc — phần mềm văn phòng Việt Nam`
            : `© ${new Date().getFullYear()} VietDoc — office software for Vietnam`}
        </p>
        <Link
          href="/workflow"
          className="inline-flex items-center justify-center rounded-lg border border-blue/25 bg-white px-4 py-2 text-sm font-semibold text-blue shadow-sm transition-colors hover:bg-blue/5"
        >
          Workflow
        </Link>
      </div>
    </footer>
  )
}
