"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { WORKFLOW_TAB_BAR_OFFSET } from "@/lib/workflow/workfeed/layout"
import { TodoTaskRow } from "@/components/workflow/todos/TodoTaskRow"
import { useWorkflowTodos } from "@/components/workflow/todos/WorkflowTodoContext"

const WorkflowTasksMapModal = dynamic(
  () =>
    import("@/components/workflow/todos/WorkflowTasksMapModal").then(
      (m) => m.WorkflowTasksMapModal
    ),
  { ssr: false }
)

type WorkflowMinimizedChecklistProps = {
  variant?: "desktop" | "mobile"
  expanded: boolean
  onExpand: () => void
  onCollapse: () => void
  /** Mobile-only: hide the full-width minimized bar (use external floating button). */
  mobileHideMinimized?: boolean
}

export function WorkflowMinimizedChecklist({
  variant = "desktop",
  expanded,
  onExpand,
  onCollapse,
  mobileHideMinimized = false,
}: WorkflowMinimizedChecklistProps) {
  const { myTodos, cycleTodoStatus } = useWorkflowTodos()
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = variant === "mobile"
  const [tasksMapOpen, setTasksMapOpen] = useState(false)
  const isPm = variant === "desktop"

  const collapseAll = () => {
    setTasksMapOpen(false)
    onCollapse()
  }

  const minimizedBar = (
    <button
      type="button"
      onClick={onExpand}
      className={`flex items-stretch overflow-hidden text-left transition ${
        isMobile
          ? "h-11 w-full rounded-xl border border-amber-300/40 bg-[#1a1208]/75 shadow-lg ring-1 ring-inset ring-amber-200/25 backdrop-blur-md"
          : "wf-glass-heavy h-9 w-full min-w-[200px] max-w-[360px] rounded-t-[10px] rounded-b-[6px] border border-[color:var(--wf-glass-border)] hover:bg-[rgba(255,255,255,0.82)]"
      }`}
      aria-label="Open checklist"
      aria-expanded={expanded}
    >
      <div
        className={`flex shrink-0 flex-col justify-center border-r px-2.5 ${
          isMobile ? "border-white/15" : "border-[color:var(--wf-glass-border-subtle)]"
        }`}
      >
        <span
          className={`text-[10px] font-semibold uppercase leading-none tracking-[0.08em] ${
            isMobile ? "text-white/55" : "text-[color:var(--wf-ink-subtle)]"
          }`}
        >
          Checklist
        </span>
        <span
          className={`mt-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] font-bold ${
            isMobile ? "bg-amber-300 text-amber-950" : "bg-[#c8ff00] text-[#2a3800]"
          }`}
        >
          {myTodos.length}
        </span>
      </div>
      <div
        ref={scrollRef}
        className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-2 py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {myTodos.length === 0 ? (
          <p
            className={`flex h-full items-center truncate text-xs ${
              isMobile ? "text-white/50" : "max-w-[200px] text-[color:var(--wf-ink-muted)]"
            }`}
          >
            No tasks
          </p>
        ) : (
          myTodos.map((todo) => (
            <div key={todo.id} onPointerDown={(e) => e.stopPropagation()}>
              <TodoTaskRow
                todo={todo}
                compact
                onDark={isMobile}
                onCycleStatus={() => cycleTodoStatus(todo.id)}
              />
            </div>
          ))
        )}
      </div>
    </button>
  )

  const expandedPanel = (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[57] ${isMobile ? "bg-black/50" : "bg-black/20"}`}
        aria-label="Close checklist"
        onClick={collapseAll}
      />
      <div
        className={
          isMobile
            ? "fixed inset-x-0 z-[58] flex flex-col overflow-hidden border-b border-[#1a1208]/10 bg-white shadow-xl"
            : "wf-glass-heavy absolute right-0 top-[calc(100%+6px)] z-[58] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-[color:var(--wf-glass-border)] shadow-[0_12px_40px_rgba(26,18,8,0.18)] backdrop-blur-2xl backdrop-saturate-150"
        }
        style={
          isMobile
            ? {
                top: "calc(3.25rem + env(safe-area-inset-top, 0px))",
                bottom: WORKFLOW_TAB_BAR_OFFSET,
              }
            : undefined
        }
      >
        <header className="flex items-center justify-between border-b border-[color:var(--wf-glass-border-subtle)] bg-[rgba(255,255,255,0.55)] px-3 py-2.5 backdrop-blur-xl backdrop-saturate-150">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-extrabold text-[#1a1208]">Checklist</p>
              {isPm ? (
                <button
                  type="button"
                  onClick={() => {
                    onCollapse()
                    setTasksMapOpen(true)
                  }}
                  className="rounded-full bg-[rgba(251,191,36,0.16)] px-2.5 py-1 text-[10px] font-extrabold text-[#7c3d00] ring-1 ring-[rgba(255,140,0,0.25)] transition hover:bg-[rgba(251,191,36,0.22)]"
                >
                  Task Map
                </button>
              ) : null}
            </div>
            <p className="truncate text-[10px] font-medium text-[#1a1208]/50">
              {myTodos.length} task{myTodos.length === 1 ? "" : "s"} · scroll for more
            </p>
          </div>
          <button
            type="button"
            onClick={collapseAll}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/45 text-sm font-bold text-[#1a1208]/70 ring-1 ring-black/5 transition hover:bg-white/60"
            aria-label="Minimize checklist"
          >
            ×
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
          {myTodos.length === 0 ? (
            <p className="py-6 text-center text-xs font-medium text-[#1a1208]/45">
              No tasks yet — use Task with / to add one
            </p>
          ) : (
            <ul className="divide-y divide-[rgba(0,0,0,0.06)]">
              {myTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoTaskRow
                    todo={todo}
                    onCycleStatus={() => cycleTodoStatus(todo.id)}
                  />
                  {todo.sourceLabel ? (
                    <p className="pb-1 pl-[3.25rem] text-[9px] font-bold text-[#1a1208]/40">
                      {todo.sourceLabel}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <div className="relative w-full px-2">
        {!mobileHideMinimized ? minimizedBar : null}
        {expanded ? expandedPanel : null}
      </div>
    )
  }

  return (
    <div className="relative ml-auto flex min-w-0 max-w-[min(100%,360px)] flex-1 justify-end">
      {minimizedBar}
      {expanded ? expandedPanel : null}
      {isPm ? (
        <WorkflowTasksMapModal open={tasksMapOpen} onClose={() => setTasksMapOpen(false)} />
      ) : null}
    </div>
  )
}
