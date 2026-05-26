import type { Metadata } from "next"
import type { ReactNode } from "react"
import { LangProvider } from "@/context/LangContext"
import { SITE_URL } from "@/lib/siteUrl"

export const metadata: Metadata = {
  title: "VietDoc — Vietnamese legal templates & browser editor",
  description:
    "47+ Vietnamese legal document templates: labour contracts, PIT returns, board minutes. Browser-based editor, .docx export.",
  alternates: { canonical: `${SITE_URL}/en` },
}

/** English subtree: only language default differs; signup/filter/modals come from root `Providers`. */
export default function EnLayout({ children }: { children: ReactNode }) {
  return <LangProvider defaultLang="en">{children}</LangProvider>
}
