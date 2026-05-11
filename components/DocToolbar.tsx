"use client"

import type { MouseEvent, RefObject } from "react"
import {
  bold,
  fontName,
  fontSize,
  insertOrderedList,
  insertUnorderedList,
  italic,
  justifyCenter,
  justifyLeft,
  justifyRight,
  redo,
  underline,
  undo,
} from "@/lib/commands"

type DocToolbarProps = {
  editorRef: RefObject<HTMLDivElement | null>
}

function focusEditor(ref: RefObject<HTMLDivElement | null>) {
  const el = ref.current
  if (!el) return
  el.focus()
  const sel = window.getSelection()
  if (sel && sel.rangeCount === 0) {
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    sel.addRange(range)
  }
}

export function DocToolbar({ editorRef }: DocToolbarProps) {
  const run = (fn: () => boolean) => (e: MouseEvent) => {
    e.preventDefault()
    focusEditor(editorRef)
    fn()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-black/10 bg-paper2 px-2 py-2">
      <select
        className="h-8 rounded border border-black/10 bg-white px-2 text-xs text-ink2"
        defaultValue="Be Vietnam Pro"
        onMouseDown={(e) => e.preventDefault()}
        onChange={(e) => {
          focusEditor(editorRef)
          fontName(e.target.value)
        }}
        aria-label="Font"
      >
        <option>Be Vietnam Pro</option>
        <option>Times New Roman</option>
        <option>Arial</option>
        <option>Georgia</option>
      </select>
      <select
        className="h-8 w-[52px] rounded border border-black/10 bg-white px-1 text-xs text-ink2"
        defaultValue="3"
        onMouseDown={(e) => e.preventDefault()}
        onChange={(e) => {
          focusEditor(editorRef)
          fontSize(e.target.value)
        }}
        aria-label="Size"
      >
        {["1", "2", "3", "4", "5", "6", "7"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <span className="mx-1 h-6 w-px bg-black/10" aria-hidden />
      <ToolbarBtn label="B" title="Bold" onMouseDown={run(bold)} strong />
      <ToolbarBtn label="I" title="Italic" onMouseDown={run(italic)} italic />
      <ToolbarBtn
        label="U"
        title="Underline"
        onMouseDown={run(underline)}
        underline
      />
      <span className="mx-1 h-6 w-px bg-black/10" aria-hidden />
      <ToolbarBtn
        label="◀"
        title="Align left"
        onMouseDown={run(justifyLeft)}
      />
      <ToolbarBtn
        label="▣"
        title="Align center"
        onMouseDown={run(justifyCenter)}
      />
      <ToolbarBtn
        label="▶"
        title="Align right"
        onMouseDown={run(justifyRight)}
      />
      <span className="mx-1 h-6 w-px bg-black/10" aria-hidden />
      <ToolbarBtn
        label="•"
        title="Bullet list"
        onMouseDown={run(insertUnorderedList)}
      />
      <ToolbarBtn
        label="1."
        title="Numbered list"
        onMouseDown={run(insertOrderedList)}
      />
      <span className="mx-1 h-6 w-px bg-black/10" aria-hidden />
      <ToolbarBtn label="↺" title="Undo" onMouseDown={run(undo)} />
      <ToolbarBtn label="↻" title="Redo" onMouseDown={run(redo)} />
    </div>
  )
}

function ToolbarBtn({
  label,
  title,
  onMouseDown,
  strong,
  italic,
  underline,
}: {
  label: string
  title: string
  onMouseDown: (e: MouseEvent) => void
  strong?: boolean
  italic?: boolean
  underline?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={onMouseDown}
      className={`h-8 min-w-8 rounded border border-black/10 bg-white px-2 text-xs text-ink2 hover:bg-paper3 ${
        strong ? "font-bold" : ""
      } ${italic ? "italic" : ""} ${underline ? "underline" : ""}`}
    >
      {label}
    </button>
  )
}
