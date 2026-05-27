"use client"

import { useState } from "react"
import { WORKFLOW_CONTENT_HEIGHT } from "@/lib/workflow/workfeed/layout"
import type { WorkfeedPost } from "@/lib/workflow/workfeed/types"
import { WorkflowActionRail } from "@/components/workflow/shared/WorkflowActionRail"
import { WorkflowAuthorRow } from "@/components/workflow/shared/WorkflowAuthorRow"
import { WorkflowCommentSheet } from "@/components/workflow/shared/WorkflowCommentSheet"

type WorkflowPostChromeProps = {
  post: WorkfeedPost
  children: React.ReactNode
  bottomPad?: string
  layout?: "mobile" | "desktop"
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
  layout = "mobile",
  onScrollUp,
  onScrollDown,
  canScrollUp,
  canScrollDown,
  darkNav,
}: WorkflowPostChromeProps) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const isDesktop = layout === "desktop"
  const lightRail = darkNav || post.rail.lightMode

  return (
    <article
      className={`relative w-full shrink-0 grow-0 snap-start snap-always overflow-hidden ${
        isDesktop ? "h-full min-h-full" : ""
      }`}
      style={
        layout === "mobile"
          ? { height: WORKFLOW_CONTENT_HEIGHT, minHeight: WORKFLOW_CONTENT_HEIGHT }
          : undefined
      }
    >
      {children}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end gap-3 px-4 ${bottomPad}`}
      >
        <div className="pointer-events-auto min-w-0 flex-1">
          <WorkflowAuthorRow author={post.author} tagRow={post.tagRow} />
        </div>
        <div className="pointer-events-auto flex-shrink-0">
          <WorkflowActionRail
            rail={{ ...post.rail, lightMode: lightRail }}
            onComment={() => setCommentsOpen(true)}
            onScrollUp={onScrollUp}
            onScrollDown={onScrollDown}
            canScrollUp={canScrollUp}
            canScrollDown={canScrollDown}
            glass={false}
          />
        </div>
      </div>
      <WorkflowCommentSheet
        open={commentsOpen}
        comments={post.comments}
        onClose={() => setCommentsOpen(false)}
      />
    </article>
  )
}
