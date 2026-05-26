"use client"

import type { WorkfeedMoodPin } from "@/lib/workflow/workfeed/types"

type MoodboardPinCardProps = {
  pin: WorkfeedMoodPin
  onSave: () => void
  onPost: () => void
}

export function MoodboardPinCard({ pin, onSave, onPost }: MoodboardPinCardProps) {
  return (
    <article className="mb-2 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div
        className="relative w-full"
        style={{ height: pin.height, background: pin.gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {pin.brand ? (
          <span className="absolute left-2 top-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#1a1208]">
            {pin.brand}
          </span>
        ) : null}
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-xs font-bold leading-snug text-white">{pin.title}</p>
          {pin.statLine ? (
            <p className="mt-1 text-[10px] font-semibold text-white/85">{pin.statLine}</p>
          ) : null}
          {pin.channel ? (
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-white/65">
              {pin.channel}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 px-2 pt-2">
        {pin.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-[#f5f0e4] px-2 py-0.5 text-[9px] font-bold text-[#1a1208]/55"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-2 p-2">
        <button
          type="button"
          onClick={onSave}
          className={`flex-1 rounded-lg py-2 text-xs font-extrabold ${
            pin.saved ? "bg-blue/15 text-blue" : "bg-[#f5f0e4] text-[#1a1208]/75"
          }`}
        >
          {pin.saved ? "Saved ✓" : "Save"}
        </button>
        <button
          type="button"
          onClick={onPost}
          className="flex-1 rounded-lg bg-red py-2 text-xs font-extrabold text-white"
        >
          Post
        </button>
      </div>
    </article>
  )
}
