"use client"

import { DocModEditor } from "@/components/dung-thu/DocModEditor"
import { WORKFLOW_TAB_BAR_OFFSET } from "@/lib/workflow/workfeed/layout"

type WorkflowNoteEditorProps = {
  onClose: () => void
  desktop?: boolean
}

export function WorkflowNoteEditor({ onClose, desktop }: WorkflowNoteEditorProps) {
  return (
    <div className="absolute inset-0 z-[55] flex flex-col overflow-hidden bg-paper text-ink">
      <header
        className={`flex shrink-0 items-center justify-between border-b border-black/10 bg-white px-3 py-2 ${
          desktop ? "" : "pt-[max(0.5rem,env(safe-area-inset-top))]"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-transparent px-2 py-1 text-sm font-bold text-blue"
        >
          ← Close
        </button>
        <div className="text-center">
          <p className="font-display text-sm font-semibold text-ink">
            <span className="not-italic">Viet</span>
            <em className="italic text-red">Doc</em>
          </p>
          <p className="text-[10px] font-semibold text-muted">New note</p>
        </div>
        <span className="w-14" aria-hidden />
      </header>

      <div
        className="min-h-0 flex-1 overflow-hidden"
        style={desktop ? undefined : { paddingBottom: WORKFLOW_TAB_BAR_OFFSET }}
      >
        <DocModEditor />
      </div>
    </div>
  )
}
