"use client"

import type { WorkfeedBossPost } from "@/lib/workflow/workfeed/types"
import { HighlightLine, MentionPills } from "@/components/workflow/shared/HighlightLine"
import { WorkflowPostChrome } from "@/components/workflow/shared/WorkflowPostChrome"

export function BossAnnouncementPost({
  post,
  onScrollUp,
  onScrollDown,
  canScrollUp,
  canScrollDown,
}: {
  post: WorkfeedBossPost
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
}) {
  return (
    <WorkflowPostChrome
      post={post}
      onScrollUp={onScrollUp}
      onScrollDown={onScrollDown}
      canScrollUp={canScrollUp}
      canScrollDown={canScrollDown}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-14"
        style={{ background: post.background }}
      >
        <div className="w-full max-w-sm space-y-3 text-center text-2xl sm:text-3xl">
          {post.lines.map((line, i) => (
            <HighlightLine key={i} parts={line.parts} />
          ))}
        </div>
        <MentionPills mentions={post.mentions} />
      </div>
    </WorkflowPostChrome>
  )
}
