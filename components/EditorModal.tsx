"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Template } from "@/lib/types"
import { copyDocText, draftStorageKey, printDoc } from "@/lib/editorIo"
import { useLang } from "@/context/LangContext"
import { DocToolbar } from "@/components/DocToolbar"

type EditorModalProps = {
  template: Template | null
  open: boolean
  onClose: () => void
}

type AutoSaveStatus = "idle" | "saving" | "saved"
type DownloadStatus = "idle" | "generating" | "done"

function slugFilename(t: Template, lang: "vi" | "en"): string {
  const base = (t.name[lang] || t.name.vi).trim() || t.id
  return base.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, " ")
}

export function EditorModal({ template, open, onClose }: EditorModalProps) {
  const { lang } = useLang()
  const editorRef = useRef<HTMLDivElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restoreClearRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle")
  const [draftRestoredMsg, setDraftRestoredMsg] = useState<string | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle")
  const [copied, setCopied] = useState(false)

  const clearTimers = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = null
    if (restoreClearRef.current) clearTimeout(restoreClearRef.current)
    restoreClearRef.current = null
  }, [])

  useEffect(() => {
    if (!open || !template || !editorRef.current) return

    clearTimers()
    setAutoSaveStatus("idle")
    setDownloadStatus("idle")
    setCopied(false)
    setDraftRestoredMsg(null)

    const key = draftStorageKey(template.id)
    const draft = typeof window !== "undefined" ? localStorage.getItem(key) : null

    editorRef.current.innerHTML = template.contentHTML

    if (draft && draft.trim()) {
      editorRef.current.innerHTML = draft
      setDraftRestoredMsg(
        lang === "vi"
          ? "● Đã lưu — bản nháp được khôi phục"
          : "● Draft restored from auto-save"
      )
      restoreClearRef.current = setTimeout(() => setDraftRestoredMsg(null), 10000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- do not reset editor when toggling UI language
  }, [open, template?.id, template?.contentHTML, clearTimers])

  const scheduleSave = useCallback(() => {
    if (!template || !editorRef.current) return
    setAutoSaveStatus("saving")
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      const html = editorRef.current?.innerHTML ?? ""
      try {
        localStorage.setItem(draftStorageKey(template.id), html)
      } catch {
        /* quota */
      }
      setAutoSaveStatus("saved")
      saveTimerRef.current = null
    }, 2000)
  }, [template])

  const handleEditorInput = () => {
    if (draftRestoredMsg) setDraftRestoredMsg(null)
    scheduleSave()
  }

  const handleCopy = async () => {
    const el = editorRef.current
    if (!el) return
    try {
      await copyDocText(el)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard denied */
    }
  }

  const handlePrint = () => {
    if (!template || !editorRef.current) return
    printDoc(template.name[lang], editorRef.current.innerHTML)
  }

  const handleDownloadDocx = async () => {
    const el = editorRef.current
    if (!template || !el) return
    setDownloadStatus("generating")
    try {
      const { exportAsDocx } = await import("@/lib/exportDocx")
      await exportAsDocx(el, slugFilename(template, lang))
      setDownloadStatus("done")
      window.setTimeout(() => setDownloadStatus("idle"), 2500)
    } catch {
      setDownloadStatus("idle")
    }
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  if (!open || !template) return null

  const autoSaveLabel =
    draftRestoredMsg ??
    (autoSaveStatus === "saving"
      ? lang === "vi"
        ? "Đang lưu..."
        : "Saving..."
      : autoSaveStatus === "saved"
        ? lang === "vi"
          ? "● Đã lưu tự động"
          : "● Auto-saved"
        : null)

  const autoSaveClass =
    draftRestoredMsg || autoSaveStatus === "saved"
      ? "text-xs text-[#1D6E45]"
      : autoSaveStatus === "saving"
        ? "text-xs text-[#B5A98C]"
        : ""

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
            onInput={handleEditorInput}
          />
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 bg-white px-4 py-3">
          <div className="min-h-[1.25rem] min-w-0 flex-1">
            {autoSaveLabel ? (
              <p className={autoSaveClass}>{autoSaveLabel}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCopy}
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
              onClick={handleDownloadDocx}
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
