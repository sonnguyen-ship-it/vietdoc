"use client"

import type { CSSProperties, ReactNode } from "react"
import {
  WORKFLOW_TODO_ASSIGNEES,
  WORKFLOW_TODO_SEVERITY_LABELS,
  type WorkflowTodoSeverity,
} from "@/lib/workflow/workfeed/todos"

export type QuickNoteLineMeta = {
  isTask: boolean
  assigneeId?: string
  severity?: WorkflowTodoSeverity
  todoId?: string
}

const SEVERITY_CHIP_CLASS: Record<WorkflowTodoSeverity, string> = {
  tomorrow: "bg-red-100 text-red-800 ring-red-200/80",
  week: "bg-amber-100 text-amber-900 ring-amber-200/80",
  month: "bg-sky-100 text-sky-900 ring-sky-200/80",
}

function InlineChip({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`mx-1 inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-extrabold leading-none ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  )
}

type QuickNoteLineDecorProps = {
  lines: string[]
  lineMeta: Record<number, QuickNoteLineMeta>
  placeholder?: string
  className?: string
  style?: CSSProperties
}

export function QuickNoteLineDecor({
  lines,
  lineMeta,
  placeholder,
  className = "",
  style,
}: QuickNoteLineDecorProps) {
  const rowCount = Math.max(lines.length, 1)

  return (
    <div className={`text-base leading-7 text-[#1a1208] ${className}`} style={style} aria-hidden>
      {Array.from({ length: rowCount }, (_, i) => {
        const text = lines[i] ?? ""
        const meta = lineMeta[i]
        const assignee = meta?.assigneeId
          ? WORKFLOW_TODO_ASSIGNEES.find((a) => a.id === meta.assigneeId)
          : null
        const severity = meta?.severity

        const showPlaceholder = i === 0 && !text && placeholder

        return (
          <div key={i} className="min-h-7 whitespace-pre-wrap break-words">
            {showPlaceholder ? (
              <span className="text-[#1a1208]/35">{placeholder}</span>
            ) : (
              <>
                <span>{text || "\u00a0"}</span>
                {assignee ? (
                  <InlineChip className="bg-emerald-100 text-emerald-900 ring-emerald-200/80">
                    → {assignee.name}
                  </InlineChip>
                ) : null}
                {severity ? (
                  <InlineChip className={SEVERITY_CHIP_CLASS[severity]}>
                    {WORKFLOW_TODO_SEVERITY_LABELS[severity]}
                  </InlineChip>
                ) : null}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
