"use client"

import { HighlightPath } from "@/components/workflow/shared/HighlightPath"
import type { WorkfeedHighlightRef } from "@/lib/workflow/workfeed/highlightRef"

type WorkflowHighlightOverlayProps = {
  highlight: WorkfeedHighlightRef
  onDismiss: () => void
  onRemove: () => void
}

export function WorkflowHighlightOverlay({
  highlight,
  onDismiss,
  onRemove,
}: WorkflowHighlightOverlayProps) {
  const tabLabel =
    highlight.mainTab === "feed"
      ? "Feed"
      : highlight.mainTab === "plan"
        ? "Plan"
        : "Board"

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="pointer-events-auto absolute inset-x-4 top-4 flex items-start justify-between gap-3 rounded-xl bg-[#1a1208]/90 px-3 py-2.5 text-white shadow-lg backdrop-blur-sm">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-amber-300">
            ◎ Highlight on {tabLabel}
          </p>
          {highlight.label ? (
            <p className="truncate text-xs font-medium text-white/85">{highlight.label}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg bg-white/15 px-2.5 py-1 text-[10px] font-bold"
          >
            Done
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg bg-red/90 px-2.5 py-1 text-[10px] font-bold"
          >
            Remove
          </button>
        </div>
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <HighlightPath
          pathD={highlight.pathD}
          highlightStyle={highlight.highlightStyle}
          className="drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]"
        />
      </svg>
    </div>
  )
}
