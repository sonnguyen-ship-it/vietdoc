"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { WORKFLOW_TAB_BAR_OFFSET } from "@/lib/workflow/workfeed/layout"
import {
  WORKFLOW_TODO_ASSIGNEES,
  WORKFLOW_TODO_SEVERITY_LABELS,
  type WorkflowTodoSeverity,
} from "@/lib/workflow/workfeed/todos"
import { getTextareaCaretViewportCoords } from "@/lib/workflow/textareaCaret"
import { QuickNoteLineDecor, type QuickNoteLineMeta } from "@/components/workflow/todos/QuickNoteLineDecor"
import { SlashCommandMenu, type SlashMenuOption } from "@/components/workflow/todos/SlashCommandMenu"
import { useWorkflowTodos } from "@/components/workflow/todos/WorkflowTodoContext"

type LineMeta = QuickNoteLineMeta

type SlashMenuKind = "todo" | "assign" | "severity"

type SlashMenuState = {
  kind: SlashMenuKind
  lineIndex: number
  caret: number
  top: number
  left: number
  highlightIndex: number
}

const TODO_OPTIONS: SlashMenuOption[] = [
  { id: "todo", label: "Todo", hint: "Turn this line into a task" },
]

const SEVERITY_OPTIONS: SlashMenuOption[] = [
  { id: "tomorrow", label: WORKFLOW_TODO_SEVERITY_LABELS.tomorrow, hint: "Due tomorrow" },
  { id: "week", label: WORKFLOW_TODO_SEVERITY_LABELS.week, hint: "Due this week" },
  { id: "month", label: WORKFLOW_TODO_SEVERITY_LABELS.month, hint: "Due this month" },
]

function lineIndexAtCaret(text: string, caret: number): number {
  return text.slice(0, caret).split("\n").length - 1
}

function lineCount(text: string): number {
  if (!text) return 1
  return text.split("\n").length
}

function severitySourceLabel(severity: WorkflowTodoSeverity): string {
  return `Quick note · ${WORKFLOW_TODO_SEVERITY_LABELS[severity]}`
}

type WorkflowQuickNoteProps = {
  onClose: () => void
  variant?: "desktop" | "mobile"
}

export function WorkflowQuickNote({ onClose, variant = "desktop" }: WorkflowQuickNoteProps) {
  const isMobile = variant === "mobile"
  const { addTodo, updateTodo, setTodoAssignee } = useWorkflowTodos()
  const [body, setBody] = useState("")
  const [lineMeta, setLineMeta] = useState<Record<number, LineMeta>>({})
  const [slashMenu, setSlashMenu] = useState<SlashMenuState | null>(null)
  const [scrollOffset, setScrollOffset] = useState({ top: 0, left: 0 })
  const panelRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const lines = body.split("\n")
  const assignOptions: SlashMenuOption[] = useMemo(
    () =>
      WORKFLOW_TODO_ASSIGNEES.map((person) => ({
        id: person.id,
        label: person.name,
        avatar: { initials: person.initials, bg: person.avatarBg },
      })),
    []
  )

  const menuOptions =
    slashMenu?.kind === "todo"
      ? TODO_OPTIONS
      : slashMenu?.kind === "assign"
        ? assignOptions
        : slashMenu?.kind === "severity"
          ? SEVERITY_OPTIONS
          : []

  const menuTitle =
    slashMenu?.kind === "assign"
      ? `Assign “${(lines[slashMenu.lineIndex] ?? "").trim() || "task"}” to`
      : slashMenu?.kind === "severity"
        ? "Importance"
        : undefined

  const closeSlash = useCallback(() => setSlashMenu(null), [])

  const setMetaForLine = useCallback((index: number, patch: Partial<LineMeta>) => {
    setLineMeta((prev) => {
      const current: LineMeta = prev[index] ?? { isTask: false }
      return { ...prev, [index]: { ...current, ...patch } }
    })
  }, [])

  const openSlashMenu = useCallback(
    (ta: HTMLTextAreaElement, lineIdx: number) => {
      const meta = lineMeta[lineIdx] ?? { isTask: false }
      let kind: SlashMenuKind
      if (!meta.isTask) {
        kind = "todo"
      } else if (!meta.assigneeId) {
        kind = "assign"
      } else if (!meta.severity) {
        kind = "severity"
      } else {
        return
      }

      const caret = ta.selectionStart
      const { top, left } = getTextareaCaretViewportCoords(ta, caret)
      setSlashMenu({
        kind,
        lineIndex: lineIdx,
        caret,
        top,
        left,
        highlightIndex: 0,
      })
    },
    [lineMeta]
  )

  const repositionSlashMenu = useCallback(() => {
    const ta = textareaRef.current
    if (!ta || !slashMenu) return
    const { top, left } = getTextareaCaretViewportCoords(ta, slashMenu.caret)
    setSlashMenu((prev) => (prev ? { ...prev, top, left } : null))
  }, [slashMenu])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!slashMenu) return
    repositionSlashMenu()
    const ta = textareaRef.current
    if (!ta) return
    const onScroll = () => repositionSlashMenu()
    ta.addEventListener("scroll", onScroll)
    window.addEventListener("resize", onScroll)
    return () => {
      ta.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [slashMenu, repositionSlashMenu])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if ((target as HTMLElement).closest?.("[role='listbox']")) return
      closeSlash()
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [closeSlash])

  const applyTodo = (lineIdx: number) => {
    setMetaForLine(lineIdx, { isTask: true })
    closeSlash()
    textareaRef.current?.focus()
  }

  const applyAssign = (lineIdx: number, assigneeId: string) => {
    const title = (lines[lineIdx] ?? "").trim()
    const meta = lineMeta[lineIdx]
    if (!meta?.isTask || !title) return

    setMetaForLine(lineIdx, { assigneeId })

    if (meta.todoId) {
      setTodoAssignee(meta.todoId, assigneeId)
    } else {
      const item = addTodo({
        title,
        assigneeId,
        source: "note",
        sourceLabel: "Quick note",
      })
      setMetaForLine(lineIdx, { todoId: item.id })
    }

    closeSlash()
    textareaRef.current?.focus()
  }

  const applySeverity = (lineIdx: number, severity: WorkflowTodoSeverity) => {
    const meta = lineMeta[lineIdx]
    if (!meta?.isTask || !meta.assigneeId) return

    setMetaForLine(lineIdx, { severity })

    if (meta.todoId) {
      updateTodo(meta.todoId, {
        severity,
        sourceLabel: severitySourceLabel(severity),
      })
    }

    closeSlash()
    textareaRef.current?.focus()
  }

  const selectHighlighted = () => {
    if (!slashMenu) return
    const opt = menuOptions[slashMenu.highlightIndex]
    if (!opt) return
    if (slashMenu.kind === "todo") applyTodo(slashMenu.lineIndex)
    else if (slashMenu.kind === "assign") applyAssign(slashMenu.lineIndex, opt.id)
    else if (slashMenu.kind === "severity") applySeverity(slashMenu.lineIndex, opt.id as WorkflowTodoSeverity)
  }

  const onTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget
    const lineIdx = lineIndexAtCaret(ta.value, ta.selectionStart)

    if (slashMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSlashMenu((prev) =>
          prev
            ? {
                ...prev,
                highlightIndex: (prev.highlightIndex + 1) % menuOptions.length,
              }
            : null
        )
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSlashMenu((prev) =>
          prev
            ? {
                ...prev,
                highlightIndex:
                  (prev.highlightIndex - 1 + menuOptions.length) % menuOptions.length,
              }
            : null
        )
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        selectHighlighted()
        return
      }
      if (e.key === "Escape") {
        e.preventDefault()
        closeSlash()
        return
      }
      if (e.key === "Tab" && menuOptions.length > 0) {
        e.preventDefault()
        selectHighlighted()
        return
      }
    }

    if (e.key === "/" && !slashMenu) {
      e.preventDefault()
      openSlashMenu(ta, lineIdx)
      return
    }

    if (e.key === "Escape" && !slashMenu) {
      if (!ta.value.trim()) onClose()
    }
  }

  const rowCount = lineCount(body)
  const editorPad = "px-3 py-3 text-base leading-7"

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[55] flex ${
        isMobile ? "flex-col bg-white" : "items-center justify-center p-6"
      }`}
    >
      <div
        ref={panelRef}
        className={`pointer-events-auto flex flex-col overflow-hidden bg-white ${
          isMobile
            ? "h-full w-full pt-[max(0.5rem,env(safe-area-inset-top))]"
            : "max-h-[min(88vh,720px)] w-[min(100%,680px)] rounded-2xl border border-[#1a1208]/12 shadow-[0_20px_56px_rgba(26,18,8,0.22)]"
        }`}
        style={isMobile ? { paddingBottom: WORKFLOW_TAB_BAR_OFFSET } : undefined}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[#1a1208]/8 px-4 py-3">
          <div>
            <p className="text-base font-extrabold text-[#1a1208]">Quick task</p>
            <p className="text-[11px] font-medium text-[#1a1208]/45">
              Return for new line · <span className="font-mono">/</span> Todo → assign → importance
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-bold text-[#1a1208]/60 hover:bg-black/5"
          >
            Close
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
          <div
            className={`relative flex flex-1 overflow-hidden rounded-xl border border-[#1a1208]/10 bg-[#f8fafc] ${
              isMobile ? "min-h-0" : "min-h-[min(52vh,420px)]"
            }`}
          >
            <div
              className="flex shrink-0 flex-col border-r border-[#1a1208]/8 bg-white/80 px-1.5 py-3"
              aria-hidden
            >
              {Array.from({ length: rowCount }, (_, i) => {
                const meta = lineMeta[i]
                return (
                  <div key={i} className="flex h-7 items-center justify-center">
                    {meta?.isTask ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded border-2 border-amber-500/60 bg-amber-400/25 text-[9px] font-bold text-amber-800">
                        ☐
                      </span>
                    ) : (
                      <span className="h-5 w-5" />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="relative min-h-0 min-w-0 flex-1">
              <QuickNoteLineDecor
                lines={lines}
                lineMeta={lineMeta}
                placeholder="Start typing…"
                className={`pointer-events-none absolute inset-0 overflow-hidden ${editorPad}`}
                style={{
                  transform: `translate(${-scrollOffset.left}px, ${-scrollOffset.top}px)`,
                }}
              />
              <textarea
                ref={textareaRef}
                value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={onTextareaKeyDown}
                onScroll={(e) => {
                  const ta = e.currentTarget
                  setScrollOffset({ top: ta.scrollTop, left: ta.scrollLeft })
                  if (slashMenu) repositionSlashMenu()
                }}
                placeholder=""
                spellCheck
                className={`relative h-full w-full resize-none bg-transparent ${editorPad} text-transparent caret-[#1a1208] outline-none selection:bg-amber-200/40 selection:text-[#1a1208] ${
                  isMobile ? "min-h-0" : "min-h-[min(52vh,420px)]"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <SlashCommandMenu
        open={slashMenu !== null}
        top={slashMenu?.top ?? 0}
        left={slashMenu?.left ?? 0}
        title={menuTitle}
        options={menuOptions}
        highlightIndex={slashMenu?.highlightIndex ?? 0}
        onHighlight={(index) => setSlashMenu((prev) => (prev ? { ...prev, highlightIndex: index } : null))}
        onSelect={(id) => {
          if (!slashMenu) return
          if (slashMenu.kind === "todo") applyTodo(slashMenu.lineIndex)
          else if (slashMenu.kind === "assign") applyAssign(slashMenu.lineIndex, id)
          else if (slashMenu.kind === "severity")
            applySeverity(slashMenu.lineIndex, id as WorkflowTodoSeverity)
        }}
      />
    </div>
  )
}
