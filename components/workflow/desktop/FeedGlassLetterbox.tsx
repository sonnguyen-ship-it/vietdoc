"use client"

import { forwardRef, type ReactNode } from "react"

type FeedGlassLetterboxProps = {
  children: ReactNode
  className?: string
  onScroll?: () => void
}

/** Side margins + centered feed column (66.67%) — glass wings, no wing labels. */
export const FeedGlassLetterbox = forwardRef<HTMLDivElement, FeedGlassLetterboxProps>(
  function FeedGlassLetterbox({ children, className = "", onScroll }, scrollerRef) {
    // Keep the side “wings” visible even when the Messages panel reduces main width.
    // `max()` can collapse unexpectedly in some flex layouts, so use a min-width guard.
    const wingClass =
      "pointer-events-none absolute inset-y-0 z-[1] w-[calc((100%-66.666667%)/2)] min-w-[72px]"

    return (
      <div className="relative h-full w-full overflow-hidden bg-[color:var(--wf-surface)]">
        {/* Left wing — ambient blobs only */}
        <div className={`${wingClass} left-0 overflow-hidden`} aria-hidden>
          <div className="wf-blob wf-blob-violet right-4 top-[14%] h-36 w-36" />
          <div className="wf-blob wf-blob-lime bottom-[16%] left-2 h-32 w-32" />
          <div className="absolute inset-0 wf-glass-thin border-r border-[color:var(--wf-glass-border-subtle)]" />
        </div>

        {/* Right wing — ambient blobs only */}
        <div className={`${wingClass} right-0 overflow-hidden`} aria-hidden>
          <div className="wf-blob wf-blob-cyan right-2 top-[10%] h-32 w-32" />
          <div className="wf-blob wf-blob-coral bottom-[14%] left-6 h-28 w-28" />
          <div className="absolute inset-0 wf-glass-thin border-l border-[color:var(--wf-glass-border-subtle)]" />
        </div>

        {/* Feed column — same 2/3 width as before */}
        <div className="relative z-10 flex h-full w-full justify-center">
          <div className="relative h-full w-2/3 max-w-[66.666667%] min-w-0 overflow-hidden border border-[color:var(--wf-glass-border)] bg-[var(--wf-glass-mid)] shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-inset ring-white/60 backdrop-blur-2xl backdrop-saturate-150">
            <div
              ref={scrollerRef}
              data-workfeed-vertical
              onScroll={onScroll}
              className={`h-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain bg-[#070707] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>article]:h-full [&>article]:snap-start ${className}`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
