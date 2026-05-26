"use client"

import type { ReactNode } from "react"
import type { WorkfeedRail } from "@/lib/workflow/workfeed/types"

type WorkflowActionRailProps = {
  rail: WorkfeedRail
  onComment: () => void
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
}

function IconChevronUp({ light }: { light?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 14l6-6 6 6"
        stroke={light ? "#fff" : "#1a1208"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconChevronDown({ light }: { light?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 10l6 6 6-6"
        stroke={light ? "#fff" : "#1a1208"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconHeart({ light }: { light?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={light ? "#fff" : "#1a1208"} aria-hidden>
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  )
}

function IconComment({ light }: { light?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-.9 0-1.76-.14-2.56-.4L5 21l1.4-4.94A8.46 8.46 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5z"
        stroke={light ? "#fff" : "#1a1208"}
        strokeWidth="2"
      />
    </svg>
  )
}

function IconRepeat({ light }: { light?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"
        stroke={light ? "#fff" : "#1a1208"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconShare({ light }: { light?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14"
        stroke={light ? "#fff" : "#1a1208"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBookmark({ light }: { light?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 3h12v18l-6-4-6 4V3z"
        stroke={light ? "#fff" : "#1a1208"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RailBtn({
  label,
  count,
  onClick,
  light,
  disabled,
  children,
}: {
  label: string
  count?: number
  onClick?: () => void
  light?: boolean
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-0.5 bg-transparent p-0 disabled:opacity-35 ${
        light ? "text-white" : "text-[#1a1208]"
      }`}
      aria-label={label}
    >
      {children}
      {count !== undefined ? (
        <span className="text-[10px] font-bold">{count}</span>
      ) : (
        <span className="text-[10px] font-bold opacity-0">·</span>
      )}
    </button>
  )
}

export function WorkflowActionRail({
  rail,
  onComment,
  onScrollUp,
  onScrollDown,
  canScrollUp = true,
  canScrollDown = true,
}: WorkflowActionRailProps) {
  const light = rail.lightMode

  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-3 pb-1">
      <RailBtn
        label="Previous post"
        light={light}
        onClick={onScrollUp}
        disabled={!canScrollUp}
      >
        <IconChevronUp light={light} />
      </RailBtn>
      <RailBtn
        label="Next post"
        light={light}
        onClick={onScrollDown}
        disabled={!canScrollDown}
      >
        <IconChevronDown light={light} />
      </RailBtn>
      <div className={`h-px w-6 ${light ? "bg-white/25" : "bg-black/15"}`} aria-hidden />
      <RailBtn label="Like" count={rail.hearts} light={light}>
        <IconHeart light={light} />
      </RailBtn>
      <RailBtn label="Comment" count={rail.comments} light={light} onClick={onComment}>
        <IconComment light={light} />
      </RailBtn>
      {rail.showRepeat ? (
        <RailBtn label="Repeat" count={rail.repeat} light={light}>
          <IconRepeat light={light} />
        </RailBtn>
      ) : null}
      {rail.showBookmark ? (
        <RailBtn label="Bookmark" light={light}>
          <IconBookmark light={light} />
        </RailBtn>
      ) : null}
      <RailBtn label="Share" light={light}>
        <IconShare light={light} />
      </RailBtn>
    </div>
  )
}
