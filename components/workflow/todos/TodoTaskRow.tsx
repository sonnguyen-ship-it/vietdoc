"use client"

import type { WorkflowTodoItem } from "@/lib/workflow/workfeed/todos"

type TodoTaskRowProps = {
  todo: WorkflowTodoItem
  compact?: boolean
  onDark?: boolean
  onCycleStatus: () => void
}

function checkboxClass(status: WorkflowTodoItem["status"], compact?: boolean) {
  const size = compact ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]"
  if (status === "done") {
    return `border-emerald-600 bg-emerald-500 text-white ${size}`
  }
  if (status === "in_progress") {
    return `border-amber-500 bg-amber-400 text-transparent ${size}`
  }
  return `border-[#1a1208]/25 bg-white text-transparent hover:border-amber-400 ${size}`
}

export function TodoTaskRow({ todo, compact, onDark, onCycleStatus }: TodoTaskRowProps) {
  const done = todo.status === "done"

  return (
    <div
      className={`flex min-w-0 items-center gap-2 ${compact ? "py-0.5" : "py-1.5"}`}
      title={todo.sourceLabel ? `From ${todo.sourceLabel}` : undefined}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onCycleStatus()
        }}
        className={`flex shrink-0 items-center justify-center rounded border-2 font-bold transition ${checkboxClass(todo.status, compact)}`}
        aria-label={
          todo.status === "open"
            ? "Mark in progress"
            : todo.status === "in_progress"
              ? "Mark complete"
              : "Mark not started"
        }
      >
        {todo.status === "done" ? "✓" : ""}
      </button>
      <p
        className={`min-w-0 flex-1 truncate font-semibold ${
          onDark ? "text-white" : "text-[#1a1208]"
        } ${compact ? "text-[10px] leading-tight" : "text-sm"} ${
          done ? (onDark ? "text-white/45 line-through" : "text-[#1a1208]/45 line-through") : ""
        } ${todo.status === "in_progress" ? (onDark ? "text-amber-200" : "text-amber-900/90") : ""}`}
      >
        {todo.title}
      </p>
    </div>
  )
}
