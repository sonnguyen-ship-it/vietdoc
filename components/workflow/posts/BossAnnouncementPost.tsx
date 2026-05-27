"use client"

import type { WorkfeedBossPost } from "@/lib/workflow/workfeed/types"
import { HighlightLine, MentionPills } from "@/components/workflow/shared/HighlightLine"
import { WorkflowPostChrome } from "@/components/workflow/shared/WorkflowPostChrome"

export function BossAnnouncementPost({
  post,
  layout,
  onScrollUp,
  onScrollDown,
  canScrollUp,
  canScrollDown,
}: {
  post: WorkfeedBossPost
  layout?: "mobile" | "desktop"
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
}) {
  const isDesktop = layout === "desktop"

  return (
    <WorkflowPostChrome
      post={post}
      layout={layout}
      onScrollUp={onScrollUp}
      onScrollDown={onScrollDown}
      canScrollUp={canScrollUp}
      canScrollDown={canScrollDown}
      darkNav={isDesktop}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-14"
        style={
          isDesktop
            ? {
                background:
                  "linear-gradient(165deg, rgba(88,28,135,0.55) 0%, rgba(14,13,12,1) 45%, #0e0d0c 100%)",
              }
            : { background: post.background }
        }
      >
        <div className={`w-full space-y-2 text-center ${isDesktop ? "max-w-[300px]" : "max-w-sm space-y-3 text-2xl sm:text-3xl"}`}>
          {post.lines.map((line, i) => (
            <HighlightLine
              key={i}
              parts={line.parts}
              variant={isDesktop ? "boss-desktop" : "default"}
            />
          ))}
        </div>
        <MentionPills mentions={post.mentions} onDark={isDesktop} />
      </div>
    </WorkflowPostChrome>
  )
}
