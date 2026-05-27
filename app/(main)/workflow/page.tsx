import type { Metadata } from "next"
import { WorkflowApp } from "@/components/workflow/WorkflowApp"
import { WorkflowBootFallback } from "@/components/workflow/WorkflowBootFallback"
import { SITE_URL } from "@/lib/siteUrl"

export const metadata: Metadata = {
  title: "Workflow",
  description:
    "Workflow — TikTok-style internal work feed. Team updates, reports, meeting notes, and video briefs.",
  alternates: { canonical: `${SITE_URL}/workflow` },
  robots: { index: false, follow: false },
}

export default function WorkflowPage() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0f0f0f]">
      <WorkflowBootFallback />
      <div className="relative z-10 h-[100dvh] w-full max-md:mx-auto max-md:max-w-[430px] max-md:border-x max-md:border-white/10 max-md:shadow-2xl">
        <WorkflowApp />
      </div>
    </div>
  )
}
