"use client"

import { useEffect, useState } from "react"
import { WorkflowMobileApp } from "@/components/workflow/WorkflowMobileApp"
import { WorkflowDesktopApp } from "@/components/workflow/desktop/WorkflowDesktopApp"
import { WORKFLOW_DESKTOP_QUERY } from "@/lib/workflow/useMediaQuery"

export function WorkflowApp() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    document.getElementById("workflow-boot-fallback")?.remove()

    const mq = window.matchMedia(WORKFLOW_DESKTOP_QUERY)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  if (isDesktop === null) {
    return (
      <div
        className="flex h-[100dvh] w-full flex-col items-center justify-center bg-[#f8fafc] text-[#1a1208]"
        aria-busy
        aria-label="Loading workflow"
      >
        <p className="text-sm font-bold">Starting workflow…</p>
      </div>
    )
  }

  if (isDesktop) {
    return (
      <div className="h-[100dvh] w-full">
        <WorkflowDesktopApp />
      </div>
    )
  }

  return (
    <div className="h-[100dvh] w-full">
      <WorkflowMobileApp />
    </div>
  )
}
