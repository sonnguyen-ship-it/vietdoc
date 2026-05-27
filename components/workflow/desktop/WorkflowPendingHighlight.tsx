"use client"

import Image from "next/image"
import { HighlightPath } from "@/components/workflow/shared/HighlightPath"
import {
  WORKFLOW_HIGHLIGHT_DRAG_TYPE,
  type WorkfeedHighlightDragPayload,
} from "@/lib/workflow/workfeed/highlightRef"

type WorkflowPendingHighlightProps = {
  payload: WorkfeedHighlightDragPayload
  onDiscard: () => void
}

export function WorkflowPendingHighlight({ payload, onDiscard }: WorkflowPendingHighlightProps) {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(WORKFLOW_HIGHLIGHT_DRAG_TYPE, JSON.stringify(payload))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div className="pointer-events-auto absolute bottom-6 left-6 z-30 max-w-[220px]">
      <div
        draggable
        onDragStart={onDragStart}
        className="cursor-grab rounded-2xl border-2 border-amber-400 bg-white p-3 shadow-xl active:cursor-grabbing"
      >
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700">
          ◎ Drag to chat →
        </p>
        {payload.ref.snapshotDataUrl ? (
          <div className="relative mt-2 h-20 w-full overflow-hidden rounded-lg">
            <Image
              src={payload.ref.snapshotDataUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="220px"
            />
          </div>
        ) : (
          <svg viewBox="0 0 200 120" className="mt-2 h-14 w-full">
            <HighlightPath
              pathD={payload.ref.pathD}
              highlightStyle={payload.ref.highlightStyle}
              strokeWidth={3}
            />
          </svg>
        )}
        <p className="mt-1.5 line-clamp-2 text-xs font-semibold text-[#1a1208]">{payload.text}</p>
      </div>
      <button
        type="button"
        onClick={onDiscard}
        className="mt-2 w-full rounded-lg bg-[#1a1208]/10 py-1 text-[10px] font-bold text-[#1a1208]/70"
      >
        Discard
      </button>
    </div>
  )
}
