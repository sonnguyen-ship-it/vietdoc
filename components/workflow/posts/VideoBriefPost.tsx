"use client"

import { useState } from "react"
import type { WorkfeedVideoPost } from "@/lib/workflow/workfeed/types"
import { WorkflowPostChrome } from "@/components/workflow/shared/WorkflowPostChrome"

export function VideoBriefPost({
  post,
  layout,
  onScrollUp,
  onScrollDown,
  canScrollUp,
  canScrollDown,
}: {
  post: WorkfeedVideoPost
  layout?: "mobile" | "desktop"
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <WorkflowPostChrome
      post={post}
      layout={layout}
      onScrollUp={onScrollUp}
      onScrollDown={onScrollDown}
      canScrollUp={canScrollUp}
      canScrollDown={canScrollDown}
      darkNav
      bottomPad="pb-24"
    >
      <div className="absolute inset-0 bg-[#0f0f0a]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[42%]"
          style={{
            background: "linear-gradient(to top, #2a1f12 0%, #1a1510 55%, transparent 100%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-[38%] flex justify-center gap-8 opacity-90">
          <div className="h-16 w-8 rounded-full bg-[#c4a574]/80" />
          <div className="h-20 w-28 rounded-lg bg-[#333] shadow-lg ring-2 ring-white/10" />
          <div className="h-16 w-8 rounded-full bg-[#c4a574]/80" />
        </div>

        <div className="relative z-10 px-4 pt-14">
          <div className="rounded-2xl bg-black/55 p-3 backdrop-blur-sm">
            <div className="flex flex-wrap justify-center gap-2">
              {post.mentions.map((m) => (
                <span key={m} className="text-sm font-bold text-[#7dd3fc]">
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-2 text-center text-xl font-black uppercase text-white">
              {post.stickerTitle}
            </p>
          </div>
          <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-[#1a1208]">
            {post.badge}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-28 z-10 px-4 text-center">
          {post.subtitles.map((s, i) => (
            <p
              key={i}
              className={
                s.style === "shot"
                  ? "text-lg font-black uppercase text-[#f5e642] drop-shadow-md"
                  : s.style === "vi"
                    ? "mt-1 text-base font-medium italic text-white/90"
                    : "text-sm italic text-white/60"
              }
            >
              {s.line}
            </p>
          ))}
        </div>

        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/35 text-2xl text-white backdrop-blur-sm"
            aria-label="Play video"
          >
            ▶
          </button>
        ) : null}
      </div>
    </WorkflowPostChrome>
  )
}
