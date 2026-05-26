"use client"

import type { WorkfeedComment } from "@/lib/workflow/workfeed/types"

type WorkflowCommentSheetProps = {
  open: boolean
  comments: WorkfeedComment[]
  onClose: () => void
}

export function WorkflowCommentSheet({ open, comments, onClose }: WorkflowCommentSheetProps) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/40" role="dialog" aria-modal>
      <button type="button" className="flex-1" aria-label="Close comments" onClick={onClose} />
      <div className="max-h-[70vh] rounded-t-[20px] bg-white pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-black/15" aria-hidden />
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-base font-extrabold text-[#1a1208]">Comments</h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent p-1 text-xl font-medium text-[#1a1208]/60"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <ul className="max-h-[300px] overflow-y-auto px-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3 border-b border-black/5 py-3 last:border-0">
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                style={{ backgroundColor: c.avatarBg }}
              >
                {c.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-extrabold text-[#1a1208]">{c.author}</span>{" "}
                  <span className="font-medium text-[#1a1208]/90">{c.text}</span>
                </p>
                <div className="mt-1 flex gap-3 text-[11px] font-semibold text-[#1a1208]/45">
                  <span>{c.time}</span>
                  <button type="button" className="bg-transparent p-0">
                    Like
                  </button>
                  <button type="button" className="bg-transparent p-0">
                    Reply
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 border-t border-black/10 px-3 py-2">
          <input
            type="text"
            placeholder="Add comment…"
            className="min-w-0 flex-1 rounded-full border-0 bg-[#f5f0e4] px-4 py-2 text-sm outline-none ring-0"
          />
          <button
            type="button"
            className="bg-transparent px-2 text-sm font-extrabold text-blue"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
