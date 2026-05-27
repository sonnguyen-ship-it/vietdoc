"use client"

import { useState } from "react"
import type { WorkfeedNotesPost } from "@/lib/workflow/workfeed/types"
import { HighlightLine } from "@/components/workflow/shared/HighlightLine"
import { WorkflowPostChrome } from "@/components/workflow/shared/WorkflowPostChrome"

export function MeetingNotesPost({
  post,
  layout,
  onScrollUp,
  onScrollDown,
  canScrollUp,
  canScrollDown,
  onOpenVideo,
}: {
  post: WorkfeedNotesPost
  layout?: "mobile" | "desktop"
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
  onOpenVideo: () => void
}) {
  const [tasks, setTasks] = useState(post.tasks)

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    )
  }

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
        className="absolute inset-0 overflow-y-auto px-4 pb-40 pt-12"
        style={{ background: post.background }}
      >
        <span className="inline-block rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-blue">
          {post.chip}
        </span>
        <div className="mt-4 text-3xl">
          <HighlightLine parts={post.headline} />
        </div>

        <section className="mt-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/55">Goal</p>
          <div className="mt-2 rounded-2xl bg-blue-500/15 p-4 text-sm font-semibold text-blue">
            {post.goal}
          </div>
        </section>

        <section className="mt-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/55">Tasks</p>
          <ul className="mt-2 space-y-2 rounded-2xl bg-white/75 p-3 backdrop-blur-sm">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => toggleTask(t.id)}
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-0 text-xs ${
                    t.checked ? "bg-[#1a1208] text-white" : "bg-white ring-2 ring-[#1a1208]/25"
                  }`}
                  aria-pressed={t.checked}
                >
                  {t.checked ? "✓" : ""}
                </button>
                <p
                  className={`flex-1 text-sm font-medium ${
                    t.checked ? "text-[#1a1208]/40 line-through" : "text-[#1a1208]"
                  }`}
                >
                  {t.label}{" "}
                  <span className="font-bold text-blue">→ {t.assignee}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/55">Notes</p>
          <button
            type="button"
            onClick={onOpenVideo}
            className="mt-2 flex w-full items-center gap-3 rounded-2xl border-2 border-violet-400/60 bg-violet-500/10 p-4 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
              ▶
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-violet-900">
                {post.videoLink.title}
              </span>
              <span className="block text-xs font-semibold text-violet-800/70">
                {post.videoLink.sub}
              </span>
            </span>
            <span className="text-lg text-violet-800/50">→</span>
          </button>
        </section>
      </div>
    </WorkflowPostChrome>
  )
}
