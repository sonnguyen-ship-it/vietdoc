"use client"

type WorkflowMessagesResizeHandleProps = {
  onPointerDown: (e: React.PointerEvent) => void
}

export function WorkflowMessagesResizeHandle({ onPointerDown }: WorkflowMessagesResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize messages panel"
      onPointerDown={onPointerDown}
      className="group relative z-10 w-2 shrink-0 cursor-col-resize touch-none"
    >
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[color:var(--wf-glass-border)] transition group-hover:w-0.5 group-hover:bg-[#1a4e7a]/50 group-active:bg-[#1a4e7a]" />
      <div className="absolute inset-y-8 left-1/2 flex -translate-x-1/2 flex-col gap-1 opacity-0 transition group-hover:opacity-100">
        <span className="h-1 w-1 rounded-full bg-[color:var(--wf-ink-subtle)]" />
        <span className="h-1 w-1 rounded-full bg-[color:var(--wf-ink-subtle)]" />
        <span className="h-1 w-1 rounded-full bg-[color:var(--wf-ink-subtle)]" />
      </div>
    </div>
  )
}
