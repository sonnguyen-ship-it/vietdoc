"use client"

import Image from "next/image"
import { HighlightPath } from "@/components/workflow/shared/HighlightPath"
import type { WorkfeedChatMessage } from "@/lib/workflow/workfeed/types"

type HighlightMessageCardProps = {
  msg: WorkfeedChatMessage
  onOpen?: () => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
}

export function HighlightMessageCard({
  msg,
  onOpen,
  draggable,
  onDragStart,
}: HighlightMessageCardProps) {
  const tab = msg.highlightRef?.mainTab
  const target =
    tab === "feed"
      ? "Feed"
      : tab === "plan"
        ? "Plan"
        : tab === "moodboard"
          ? "Board"
          : "View"

  return (
    <button
      type="button"
      onClick={onOpen}
      draggable={draggable}
      onDragStart={onDragStart}
      className="w-full rounded-xl border border-amber-400/40 bg-amber-500/15 p-2 text-left transition hover:bg-amber-500/25"
    >
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700">
        ◎ Highlight · {target}
      </p>
      {msg.highlightRef?.snapshotDataUrl ? (
        <div className="relative mt-2 h-24 w-full overflow-hidden rounded-lg">
          <Image
            src={msg.highlightRef.snapshotDataUrl}
            alt=""
            fill
            unoptimized
            className="object-cover object-top"
            sizes="(max-width: 640px) 90vw, 320px"
          />
        </div>
      ) : msg.highlightPath ? (
        <svg viewBox="0 0 400 240" className="mt-2 h-16 w-full rounded-lg bg-black/5">
          <HighlightPath
            pathD={msg.highlightRef?.pathD ?? msg.highlightPath ?? ""}
            highlightStyle={msg.highlightRef?.highlightStyle}
          />
        </svg>
      ) : null}
      {msg.text ? <p className="mt-1.5 text-sm font-medium">{msg.text}</p> : null}
      {onOpen ? (
        <p className="mt-1 text-[10px] font-bold text-amber-800/70">Tap to jump to spot →</p>
      ) : null}
    </button>
  )
}
