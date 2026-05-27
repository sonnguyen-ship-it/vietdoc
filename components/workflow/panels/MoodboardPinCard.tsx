"use client"

import Image from "next/image"
import type { WorkfeedMoodPin } from "@/lib/workflow/workfeed/types"

type MoodboardPinCardProps = {
  pin: WorkfeedMoodPin
  onSave: () => void
  onShare: () => void
  onCopyToPlan?: () => void
}

export function MoodboardPinCard({ pin, onSave, onShare, onCopyToPlan }: MoodboardPinCardProps) {
  return (
    <article className="group mb-2 break-inside-avoid overflow-hidden rounded-[16px] border border-[color:var(--wf-glass-border)] bg-[rgba(255,255,255,0.74)] shadow-[0_10px_34px_rgba(0,0,0,0.10)] backdrop-blur-xl backdrop-saturate-150 transition hover:bg-[rgba(255,255,255,0.82)]">
      <div
        className="relative w-full"
        style={{ height: pin.height, background: pin.gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {pin.imageUrl ? (
          <Image
            src={pin.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 240px"
            priority={false}
          />
        ) : null}
        {pin.brand ? (
          <span className="absolute left-2 top-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#1a1208]">
            {pin.brand}
          </span>
        ) : null}
        {onCopyToPlan ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCopyToPlan()
            }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-[11px] font-extrabold text-[#1a1208] shadow-sm ring-1 ring-black/10 transition hover:scale-[1.04] hover:bg-white active:scale-95"
            title="Add to Plan stash (corner tray)"
            aria-label="Add image to Plan stash"
          >
            ⧉
          </button>
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
            className="rounded-full bg-white/55 px-2 py-0.5 text-[9px] font-bold text-[#1a1208]/55 ring-1 ring-black/5"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-2 p-2">
        <button
          type="button"
          onClick={onSave}
          className={`flex-1 rounded-lg py-2 text-xs font-extrabold transition ${
            pin.saved
              ? "bg-[rgba(59,130,246,0.14)] text-blue ring-1 ring-[rgba(59,130,246,0.22)]"
              : "bg-white/55 text-[#1a1208]/75 ring-1 ring-black/5 hover:bg-white/70"
          }`}
        >
          {pin.saved ? "Saved ✓" : "Save"}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex-1 rounded-lg bg-red py-2 text-xs font-extrabold text-white shadow-[0_2px_10px_rgba(200,16,46,0.25)] transition hover:scale-[1.01] active:scale-[0.99]"
        >
          Share
        </button>
      </div>
    </article>
  )
}
