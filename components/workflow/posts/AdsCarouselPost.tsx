"use client"

import { useCallback, useLayoutEffect, useRef, useState } from "react"
import type { WorkfeedCarouselPost } from "@/lib/workflow/workfeed/types"
import { HighlightLine } from "@/components/workflow/shared/HighlightLine"
import { WorkflowPostChrome } from "@/components/workflow/shared/WorkflowPostChrome"
import { useHorizontalCarouselTouch } from "@/lib/workflow/useHorizontalCarouselTouch"

function OverviewCard() {
  const points = "12,48 40,42 68,38 96,32 124,28 152,22 180,14"
  return (
    <div className="mt-3 rounded-2xl bg-white/75 p-3 backdrop-blur-sm">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/70">
        performance overview
      </p>
      <svg viewBox="0 0 200 56" className="mt-2 h-14 w-full" aria-hidden>
        <polyline
          fill="none"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          points={points}
        />
        <circle cx="180" cy="14" r="4" fill="#059669" />
      </svg>
      <p className="text-right text-xs font-bold text-emerald-700">↑15%</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        {[
          ["Tổng reach", "168K", "↑ 15%"],
          ["Chi phí", "5.1M", "VNĐ"],
          ["ROAS avg", "2.8x", "↑ 0.4x"],
          ["Best kênh", "TikTok", "3.2x ROAS"],
        ].map(([a, b, c]) => (
          <div key={a} className="rounded-lg bg-white/80 p-2">
            <p className="font-bold text-[#1a1208]/60">{a}</p>
            <p className="text-sm font-black text-[#1a1208]">{b}</p>
            <p className="font-bold text-emerald-700">{c}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChannelsCard() {
  const rows = [
    ["TikTok Ads", "2.4M", "85K", "3.2x", true],
    ["Facebook", "1.8M", "52K", "2.1x", false],
    ["Google", "0.9M", "31K", "2.8x", false],
    ["Total", "5.1M", "168K", "2.8x", true],
  ] as const
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-2xl bg-white/75 p-3 backdrop-blur-sm">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/70">
          chi tiết kênh ads
        </p>
        <table className="mt-2 w-full text-[11px]">
          <thead>
            <tr className="text-left font-bold text-[#1a1208]/55">
              <th>Kênh</th>
              <th>Chi phí</th>
              <th>Reach</th>
              <th>ROAS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, cost, reach, roas, bold]) => (
              <tr key={name} className={bold ? "font-black" : ""}>
                <td className="py-1">{name}</td>
                <td>{cost}</td>
                <td>{reach}</td>
                <td className={bold ? "font-black text-emerald-700" : ""}>{roas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-2xl bg-white/75 p-3 backdrop-blur-sm">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/70">
          đề xuất tuần sau
        </p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#1a1208]">
          Tăng budget TikTok Ads +20% · Giảm Facebook về 1.2M · Giữ nguyên Google
        </p>
      </div>
    </div>
  )
}

function KocCard() {
  return (
    <div className="mt-3 rounded-2xl bg-white/75 p-3 backdrop-blur-sm">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/70">
        KOC results
      </p>
      <div className="mt-3 space-y-3">
        <div className="rounded-xl bg-white/90 p-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#1a1208]">@hienvuive</span>
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">
              ⭐ Top 1
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-[#1a1208]/75">
            125 likes · 30 DMs · 4.2K views
          </p>
        </div>
        <div className="rounded-xl bg-white/90 p-3">
          <p className="font-black text-[#1a1208]">@trangkoc</p>
          <p className="mt-1 text-xs font-semibold text-[#1a1208]/75">
            98 likes · 18 DMs · 3.1K views
          </p>
        </div>
      </div>
    </div>
  )
}

export function AdsCarouselPost({
  post,
  layout,
  onScrollUp,
  onScrollDown,
  canScrollUp,
  canScrollDown,
}: {
  post: WorkfeedCarouselPost
  layout?: "mobile" | "desktop"
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [slide, setSlide] = useState(0)
  const [slideWidth, setSlideWidth] = useState(0)

  useHorizontalCarouselTouch(scrollerRef, post.slides.length)

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const measure = () => setSlideWidth(el.clientWidth)
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scrollToSlide = useCallback(
    (index: number) => {
      const el = scrollerRef.current
      if (!el) return
      const clamped = Math.max(0, Math.min(index, post.slides.length - 1))
      const w = el.clientWidth
      el.scrollTo({ left: clamped * w, behavior: "smooth" })
      setSlide(clamped)
    },
    [post.slides.length]
  )

  const onSlideScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const w = el.clientWidth || 1
    setSlide(Math.round(el.scrollLeft / w))
  }, [])

  return (
    <WorkflowPostChrome
      post={post}
      layout={layout}
      onScrollUp={onScrollUp}
      onScrollDown={onScrollDown}
      canScrollUp={canScrollUp}
      canScrollDown={canScrollDown}
      bottomPad="pb-28"
    >
      <div
        ref={scrollerRef}
        onScroll={onSlideScroll}
        className="workfeed-carousel-track absolute inset-0 z-[1] flex snap-x snap-mandatory overflow-x-scroll overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Ads report slides"
      >
        {post.slides.map((s, i) => (
          <div
            key={s.label}
            className="relative h-full flex-shrink-0 snap-start snap-always overflow-hidden px-4 pb-36 pt-12"
            style={{
              background: s.background,
              width: slideWidth > 0 ? slideWidth : "100%",
              minWidth: slideWidth > 0 ? slideWidth : "100%",
            }}
          >
            <p className="text-xs font-extrabold text-[#1a1208]/70">{s.label}</p>
            <div className="mt-4 text-2xl">
              <HighlightLine parts={s.headline} />
            </div>
            {s.card?.kind === "overview" ? <OverviewCard /> : null}
            {s.card?.kind === "channels" ? <ChannelsCard /> : null}
            {s.card?.kind === "koc" ? <KocCard /> : null}
            {s.highlightStrip ? (
              <div className="mt-3 border-l-4 border-amber-500 bg-white/50 py-2 pl-3 text-sm font-semibold text-[#1a1208]">
                {s.highlightStrip}
              </div>
            ) : null}
            {s.swipeHint && i === 0 ? (
              <p className="mt-4 text-center text-xs font-bold text-[#1a1208]/55">{s.swipeHint}</p>
            ) : null}
          </div>
        ))}
      </div>

      {slide > 0 ? (
        <button
          type="button"
          onClick={() => scrollToSlide(slide - 1)}
          className="absolute left-1 top-1/2 z-20 -translate-y-1/2 bg-transparent px-3 py-6 text-3xl font-bold text-[#1a1208]/50"
          aria-label="Previous slide"
        >
          ‹
        </button>
      ) : null}
      {slide < post.slides.length - 1 ? (
        <button
          type="button"
          onClick={() => scrollToSlide(slide + 1)}
          className="absolute right-1 top-1/2 z-20 -translate-y-1/2 bg-transparent px-3 py-6 text-3xl font-bold text-[#1a1208]/50"
          aria-label="Next slide"
        >
          ›
        </button>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-[5.5rem] z-20 flex justify-center gap-1.5">
        {post.slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToSlide(i)}
            className="pointer-events-auto bg-transparent p-2"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === slide}
          >
            <span
              className={`block h-1.5 rounded-full bg-[#1a1208]/35 transition-all ${
                i === slide ? "w-5 bg-[#1a1208]/80" : "w-1.5"
              }`}
            />
          </button>
        ))}
      </div>
    </WorkflowPostChrome>
  )
}
