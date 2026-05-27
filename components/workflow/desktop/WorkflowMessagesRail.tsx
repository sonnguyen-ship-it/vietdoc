"use client"

type WorkflowMessagesRailProps = {
  open: boolean
  onOpen: () => void
  unreadTotal: number
  /** Use inside full-screen overlays (e.g. Tasks Map) so the tab stays clickable. */
  elevated?: boolean
}

/** Horizontal glass tab on the right edge — opens Messages */
export function WorkflowMessagesRail({
  open,
  onOpen,
  unreadTotal,
  elevated = false,
}: WorkflowMessagesRailProps) {
  if (open) return null

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group fixed right-0 top-[18%] z-40 flex items-center gap-2 rounded-l-[12px] border border-r-0 border-[color:var(--wf-glass-border)] bg-[var(--wf-glass-heavy)] px-3.5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl backdrop-saturate-150 transition hover:bg-[rgba(255,255,255,0.88)] hover:pr-4 ${
        elevated ? "!z-[210]" : ""
      }`}
      aria-label="Open messages"
      aria-expanded={false}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[color:var(--wf-glass-border-subtle)] bg-[rgba(255,255,255,0.55)] text-base leading-none text-[color:var(--wf-ink)]"
        aria-hidden
      >
        ✉
      </span>
      <span className="text-[13px] font-semibold tracking-[-0.02em] text-[color:var(--wf-ink)]">
        Messages
      </span>
      {unreadTotal > 0 ? (
        <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full border border-[#a00d24] bg-[#C8102E] px-1.5 text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(200,16,46,0.35)]">
          {unreadTotal}
        </span>
      ) : null}
    </button>
  )
}
