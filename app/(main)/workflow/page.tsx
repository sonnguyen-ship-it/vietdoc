import type { Metadata } from "next"
import { WorkflowApp } from "@/components/workflow/WorkflowApp"
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
    <div className="min-h-[100dvh] bg-black">
      <div className="mx-auto h-[100dvh] w-full max-w-[430px] border-x border-white/10 shadow-2xl">
        <WorkflowApp />
      </div>
    </div>
  )
}
