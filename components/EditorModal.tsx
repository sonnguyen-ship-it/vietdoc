"use client"

import { useEffect, useRef } from "react"
import type { Template } from "@/lib/types"
import { printDocumentHtml } from "@/lib/print"
import { useLang } from "@/context/LangContext"
import { DocToolbar } from "@/components/DocToolbar"

type EditorModalProps = {
  template: Template | null
  open: boolean
  onClose: () => void
}

export function EditorModal({ template, open, onClose }: EditorModalProps) {
  const { lang } = useLang()
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !template || !editorRef.current) return
    editorRef.current.innerHTML = template.contentHTML
  }, [open, template])

  if (!open || !template) return null

  const handlePrint = () => {
    const html = editorRef.current?.innerHTML ?? ""
    printDocumentHtml(html, template.name[lang])
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative flex max-h-[min(96vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-black/18 bg-paper sm:m-4">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              VietDoc · {template.decree}
            </p>
            <h2
              id="editor-modal-title"
              className="font-display text-lg font-semibold text-ink"
            >
              {template.name[lang]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-black/10 px-3 py-1.5 text-sm text-ink2 hover:bg-paper2"
          >
            {lang === "vi" ? "Đóng" : "Close"}
          </button>
        </header>
        <DocToolbar editorRef={editorRef} />
        <div className="min-h-0 flex-1 overflow-y-auto bg-paper2 p-4 sm:p-6">
          <div
            ref={editorRef}
            className="doc-paper mx-auto min-h-[480px] outline-none"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
          />
        </div>
        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-black/10 bg-white px-4 py-3">
          <button
            type="button"
            onClick={handlePrint}
            className="rounded border border-black/18 bg-white px-4 py-2 text-sm font-medium text-ink2 hover:bg-paper2"
          >
            {lang === "vi" ? "In / PDF" : "Print / PDF"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-black/10 bg-gold px-4 py-2 text-sm font-semibold text-ink hover:opacity-95"
          >
            {lang === "vi" ? "Hoàn tất" : "Done"}
          </button>
        </footer>
      </div>
    </div>
  )
}
