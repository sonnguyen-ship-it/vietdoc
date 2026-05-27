"use client"

import type { WorkfeedChatMessage } from "@/lib/workflow/workfeed/types"

type MoodboardShareCardProps = {
  msg: WorkfeedChatMessage
  onOpen?: () => void
}

export function MoodboardShareCard({ msg, onOpen }: MoodboardShareCardProps) {
  const pin = msg.moodPin
  if (!pin) return null

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-xl border border-amber-300/45 bg-amber-500/10 p-2 text-left transition hover:bg-amber-500/15"
    >
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-amber-800">
        ▣ Share · Moodboard
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-black/10"
          style={{ background: pin.gradient }}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[#1a1208]">
            {pin.title}
          </p>
          <p className="text-[10px] font-bold text-[#1a1208]/45">
            {pin.brand ? `${pin.brand} · Board` : "Board"}
          </p>
        </div>
      </div>
      {onOpen ? (
        <p className="mt-1 text-[10px] font-bold text-amber-800/70">
          Tap to view on Board →
        </p>
      ) : null}
    </button>
  )
}

