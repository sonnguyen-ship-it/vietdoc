"use client"

import { useState } from "react"
import type { WorkfeedPost } from "@/lib/workflow/workfeed/types"
import { WorkflowActionRail } from "@/components/workflow/shared/WorkflowActionRail"
import { WorkflowAuthorRow } from "@/components/workflow/shared/WorkflowAuthorRow"
import { WorkflowCommentSheet } from "@/components/workflow/shared/WorkflowCommentSheet"

type WorkflowPostChromeProps = {
  post: WorkfeedPost
  children: React.ReactNode
  bottomPad?: string
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
  darkNav?: boolean
}

export function WorkflowPostChrome({
  post,
  children,
  bottomPad = "pb-24",
  onScrollUp,
  onScrollDown,
  canScrollUp,
  canScrollDown,
  darkNav,
}: WorkflowPostChromeProps) {
  const [commentsOpen, setCommentsOpen] = useState(false)

  return (
    <article className="relative h-full min-h-full w-full snap-start snap-always flex-shrink-0 overflow-hidden">
      {children}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end gap-3 px-4 ${bottomPad}`}
      >
        <div className="pointer-events-auto min-w-0 flex-1">
          <WorkflowAuthorRow author={post.author} tagRow={post.tagRow} />
        </div>
        <div className="pointer-events-auto flex-shrink-0">
        <WorkflowActionRail
          rail={post.rail}
          onComment={() => setCommentsOpen(true)}
          onScrollUp={onScrollUp}
          onScrollDown={onScrollDown}
          canScrollUp={canScrollUp}
          canScrollDown={canScrollDown}
        />
        </div>
      </div>
      <WorkflowCommentSheet
        open={commentsOpen}
        comments={post.comments}
        onClose={() => setCommentsOpen(false)}
      />
      {darkNav ? <span className="sr-only">Dark nav post</span> : null}
    </article>
  )
}
