"use client"

type WorkflowDesktopGlassToolbarProps = {
  onHighlight: () => void
  onTask: () => void
  onPost: () => void
}

function HighlightIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0 text-[color:var(--wf-ink)]" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  )
}

function TaskIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0 text-[color:var(--wf-ink)]" fill="none" aria-hidden>
      <rect x="3" y="3" width="14" height="14" rx="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M6.5 10.2l2.1 2.1 5.2-5.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const toolbarActionClass =
  "flex items-center gap-2 rounded-[20px] px-3 py-2 text-[13px] font-medium text-[color:var(--wf-ink)] transition hover:bg-white/40"

export function WorkflowDesktopGlassToolbar({
  onHighlight,
  onTask,
  onPost,
}: WorkflowDesktopGlassToolbarProps) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-5 z-40 flex justify-center"
      aria-label="Create tools"
    >
      <div className="pointer-events-auto wf-glass-toolbar flex items-center gap-1 p-1.5">
        <button
          type="button"
          onClick={onHighlight}
          className={toolbarActionClass}
          title="Highlight"
        >
          <HighlightIcon />
          <span className="hidden sm:inline">Highlight</span>
        </button>

        <div className="mx-0.5 h-6 w-px bg-black/10" aria-hidden />

        <button
          type="button"
          onClick={onTask}
          className={toolbarActionClass}
          title="Task"
        >
          <TaskIcon />
          <span className="hidden sm:inline">Task</span>
        </button>

        <div className="mx-0.5 h-6 w-px bg-black/10" aria-hidden />

        <button
          type="button"
          onClick={onPost}
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#C8102E] text-lg font-light leading-none text-white shadow-[0_2px_12px_rgba(200,16,46,0.35)] transition hover:scale-[1.04] active:scale-95"
          aria-label="Share / Post"
        >
          ＋
        </button>
      </div>
    </div>
  )
}
