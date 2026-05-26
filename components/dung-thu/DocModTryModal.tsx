"use client"

import { useEffect, useRef, useState } from "react"
import type { Template } from "@/lib/types"
import { useLang } from "@/context/LangContext"
import { DocModEditor, type DocModEditorHandle } from "@/components/dung-thu/DocModEditor"

type DownloadStatus = "idle" | "generating" | "done"

function slugFilename(t: Template, lang: "vi" | "en"): string {
  const base = (t.name[lang] || t.name.vi).trim() || t.id
  return base.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, " ")
}

type DocModTryModalProps = {
  template: Template | null
  open: boolean
  onClose: () => void
}

export function DocModTryModal({ template, open, onClose }: DocModTryModalProps) {
  const { lang } = useLang()
  const editorRef = useRef<DocModEditorHandle>(null)
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) {
      setDownloadStatus("idle")
      setCopied(false)
    }
  }, [open, template?.id])

  if (!open || !template) return null

  const handleCopy = async () => {
    try {
      await editorRef.current?.copyPlainText()
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard denied */
    }
  }

  const handlePrint = () => {
    editorRef.current?.print()
  }

  const handleDownloadDocx = async () => {
    setDownloadStatus("generating")
    try {
      await editorRef.current?.exportDocx(slugFilename(template, lang))
      setDownloadStatus("done")
      window.setTimeout(() => setDownloadStatus("idle"), 2500)
    } catch {
      setDownloadStatus("idle")
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="docmod-try-modal-title"
    >
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={onClose} />
      <div className="relative flex h-[min(92vh,880px)] max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-black/18 bg-paper2 shadow-lg sm:m-4">
        <header className="flex shrink-0 items-center justify-between border-b border-black/10 bg-white px-4 py-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              VietDoc · {template.decree}
            </p>
            <h2 id="docmod-try-modal-title" className="font-display text-lg font-semibold text-ink">
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
        <div className="min-h-0 flex-1 overflow-hidden">
          <DocModEditor
            key={template.id}
            ref={editorRef}
            variant="modal"
            initialTemplateId={template.id}
          />
        </div>
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-black/10 bg-white px-4 py-3">
          <p className="min-h-[1.25rem] min-w-0 flex-1 text-xs text-muted">
            {lang === "vi" ? "Dùng thử trong cửa sổ — chỉnh sửa và tải .docx." : "Try in a window — edit and download .docx."}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => void handleCopy()}
              className={`flex items-center gap-1.5 rounded border border-black/18 bg-paper px-3 py-2 text-xs font-medium transition-colors hover:bg-paper2 ${
                copied ? "text-[#1D6E45]" : "text-muted"
              }`}
            >
              <i className="ti ti-clipboard text-sm" aria-hidden />
              {copied
                ? lang === "vi"
                  ? "✓ Đã sao chép"
                  : "✓ Copied"
                : lang === "vi"
                  ? "Sao chép"
                  : "Copy"}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded border border-black/18 bg-paper px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-paper2"
            >
              <i className="ti ti-printer text-sm" aria-hidden />
              {lang === "vi" ? "In / PDF" : "Print / PDF"}
            </button>
            <button
              type="button"
              disabled={downloadStatus === "generating"}
              onClick={() => void handleDownloadDocx()}
              className={`flex items-center gap-1.5 rounded px-4 py-2 text-sm font-semibold text-white transition-opacity ${
                downloadStatus === "done"
                  ? "bg-[#166534]"
                  : "bg-red hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              }`}
            >
              {downloadStatus === "generating" ? (
                <>
                  <i className="ti ti-loader-2 animate-spin text-base" aria-hidden />
                  {lang === "vi" ? "Đang tạo..." : "Generating..."}
                </>
              ) : downloadStatus === "done" ? (
                <>
                  <i className="ti ti-check text-base" aria-hidden />
                  {lang === "vi" ? "✓ Đã tải về" : "✓ Downloaded"}
                </>
              ) : (
                <>
                  <i className="ti ti-download text-base" aria-hidden />
                  {lang === "vi" ? "Tải về .docx" : "Download .docx"}
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
