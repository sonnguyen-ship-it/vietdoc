"use client"

import type { CSSProperties, DragEvent, ReactNode } from "react"
import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import type { Template } from "@/lib/types"
import { copyDocText } from "@/lib/editorIo"
import { templates } from "@/lib/templates"
import { useLang } from "@/context/LangContext"
import type { DocModule, FontPreset, ModuleType, TextAlign } from "./docmod/types"
import { moduleFromPreset, VIETDOC_BLOCK_PRESETS, type VietdocBlockPreset } from "./docmod/vietdocBlockPresets"
import { vietDocHtmlToModules } from "./docmod/vietDocHtmlToModules"
import {
  RibbonBtn,
  IconAlignCenter,
  IconAlignJustify,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconBullets,
  IconClearFormat,
  IconCopy,
  IconCut,
  IconDownload,
  IconIndent,
  IconItalic,
  IconLink,
  IconNumbering,
  IconOutdent,
  IconPageBreak,
  IconPaste,
  IconPrint,
  IconRedo,
  IconSelectAll,
  IconSidebarCollapse,
  IconSidebarExpand,
  IconStrikethrough,
  IconUnderline,
  IconUndo,
} from "./docmod/RibbonIcons"

const MAX_HISTORY = 40
const BLANK_TEMPLATE_ID = "__blank"

const TYPE_BADGE: Record<ModuleType, { vi: string; en: string }> = {
  divider: { vi: "Ngăn cách", en: "Divider" },
  pagebreak: { vi: "Ngắt trang", en: "Page break" },
  html: { vi: "Khối biểu mẫu", en: "Template block" },
  title: { vi: "Tiêu đề", en: "Title" },
  section: { vi: "Mục / điều", en: "Section" },
  legal: { vi: "Căn cứ", en: "Legal basis" },
  paragraph: { vi: "Đoạn văn", en: "Paragraph" },
  block: { vi: "Thoả thuận", en: "Agreement" },
}

function moduleBadgeLabel(m: DocModule, lang: "vi" | "en"): string {
  if (m.presetId) {
    const p = VIETDOC_BLOCK_PRESETS.find((x) => x.id === m.presetId)
    if (p) return lang === "vi" ? p.vi : p.en
  }
  return lang === "vi" ? TYPE_BADGE[m.type].vi : TYPE_BADGE[m.type].en
}

function cloneModules(m: DocModule[]): DocModule[] {
  return JSON.parse(JSON.stringify(m)) as DocModule[]
}

function newModule(t: ModuleType, content: string, align: TextAlign = "left"): DocModule {
  return {
    id: crypto.randomUUID(),
    type: t,
    content,
    align,
    ...(t === "title" ? { bold: true } : {}),
  }
}

function hasDocText(html: string): boolean {
  if (typeof document === "undefined") return false
  const d = document.createElement("div")
  d.innerHTML = html
  return Boolean(d.textContent?.replace(/\u00a0/g, " ").trim())
}

function stripHtmlToText(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ")
  const d = document.createElement("div")
  d.innerHTML = html
  return d.textContent?.replace(/\u00a0/g, " ") ?? ""
}

function wordCountFromText(s: string): number {
  const t = s.trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
}

function mergeToolbarStyle(m: DocModule): CSSProperties {
  if (m.type === "divider" || m.type === "pagebreak") return {}
  return { textAlign: m.align }
}

/** Blocks where rich text / HTML editing and the formatting toolbar apply. */
function isRichTextModule(mod: DocModule | null | undefined): boolean {
  return Boolean(mod && mod.type !== "divider" && mod.type !== "pagebreak")
}

const FONT_PRESET_MAP: Record<FontPreset, { fontSize: string; fontWeight: number }> = {
  normal: { fontSize: "13px", fontWeight: 400 },
  h1: { fontSize: "22px", fontWeight: 700 },
  h2: { fontSize: "17px", fontWeight: 700 },
  h3: { fontSize: "14px", fontWeight: 600 },
}

const FONT_SIZE_OPTS = Array.from({ length: 15 }, (_, i) => i + 10)

function effectiveFontSizePx(m: DocModule): number {
  if (m.fontSizePx != null) return m.fontSizePx
  const preset = m.fontPreset ?? "normal"
  if (preset !== "normal") {
    const pr = FONT_PRESET_MAP[preset]
    return parseInt(pr.fontSize, 10) || 14
  }
  if (m.type === "title") return 15
  if (m.type === "paragraph" || m.type === "html") return 14
  if (m.type === "section" || m.type === "legal" || m.type === "block") return 13
  return 14
}

function moduleTypographyStyle(m: DocModule): CSSProperties {
  if (m.type === "divider" || m.type === "pagebreak") return {}
  if (m.fontSizePx != null) {
    const pr = FONT_PRESET_MAP[m.fontPreset ?? "normal"]
    return { fontSize: `${m.fontSizePx}px`, fontWeight: pr.fontWeight }
  }
  const preset = m.fontPreset ?? "normal"
  if (preset === "normal") return {}
  const pr = FONT_PRESET_MAP[preset]
  return { fontSize: pr.fontSize, fontWeight: pr.fontWeight }
}

function normalizeRowPairs(mods: DocModule[]): DocModule[] {
  let next = mods.map((m) => ({ ...m }))
  const gids = new Set(next.map((m) => m.rowGroupId).filter(Boolean) as string[])
  for (const g of Array.from(gids)) {
    const idxs: number[] = []
    next.forEach((m, i) => {
      if (m.rowGroupId === g) idxs.push(i)
    })
    if (idxs.length !== 2 || idxs[1] !== idxs[0] + 1) {
      next = next.map((m) => (m.rowGroupId === g ? { ...m, rowGroupId: undefined } : m))
    }
  }
  return next
}

type SheetRenderEntry =
  | { kind: "single"; m: DocModule }
  | { kind: "row"; groupId: string; a: DocModule; b: DocModule }

function sheetRenderEntries(mods: DocModule[]): SheetRenderEntry[] {
  const out: SheetRenderEntry[] = []
  let i = 0
  while (i < mods.length) {
    const m = mods[i]
    const g = m.rowGroupId
    if (g && mods[i + 1]?.rowGroupId === g) {
      out.push({ kind: "row", groupId: g, a: m, b: mods[i + 1]! })
      i += 2
    } else {
      out.push({ kind: "single", m })
      i += 1
    }
  }
  return out
}

function stripRowGroup(mods: DocModule[], groupId: string): DocModule[] {
  return mods.map((m) => (m.rowGroupId === groupId ? { ...m, rowGroupId: undefined } : m))
}

function findRowPairIndices(mods: DocModule[], groupId: string): [number, number] | null {
  const i = mods.findIndex((m) => m.rowGroupId === groupId)
  if (i < 0 || mods[i + 1]?.rowGroupId !== groupId) return null
  return [i, i + 1]
}

function newPageBreak(): DocModule {
  return { id: crypto.randomUUID(), type: "pagebreak", content: "", align: "left" }
}

type DocSheet = { modules: DocModule[]; leadingBreak: DocModule | null }

/** Splits the flat module list into sheets; each `leadingBreak` is the page-break before that sheet. */
function buildSheets(modules: DocModule[]): DocSheet[] {
  const out: DocSheet[] = []
  let buf: DocModule[] = []
  let lead: DocModule | null = null
  for (const m of modules) {
    if (m.type === "pagebreak") {
      out.push({ modules: buf, leadingBreak: lead })
      buf = []
      lead = m
    } else {
      buf.push(m)
    }
  }
  out.push({ modules: buf, leadingBreak: lead })
  return out
}

function visibleSheets(mods: DocModule[]): DocSheet[] {
  return buildSheets(mods).filter((s) => s.modules.length > 0 || s.leadingBreak != null)
}

function bodyClass(type: ModuleType): string {
  switch (type) {
    case "title":
      return "doc-title"
    case "section":
      return "doc-section"
    case "legal":
      return "doc-legal"
    case "block":
      return "doc-block"
    case "paragraph":
    default:
      return "text-sm leading-relaxed text-ink2"
  }
}

function bodyTag(type: ModuleType): "h1" | "p" | "div" {
  if (type === "title") return "h1"
  if (type === "section" || type === "legal") return "p"
  return "div"
}

function placeholderForType(t: ModuleType, lang: "vi" | "en"): string {
  if (t === "title") return lang === "vi" ? "Tiêu đề…" : "Title…"
  if (t === "section") return lang === "vi" ? "Mục / điều…" : "Section heading…"
  if (t === "legal") return lang === "vi" ? "Căn cứ pháp lý…" : "Legal basis…"
  if (t === "block") return lang === "vi" ? "Nội dung thoả thuận…" : "Agreement text…"
  return lang === "vi" ? "Nội dung…" : "Body text…"
}

function EditableBody({
  mod,
  lang,
  onContent,
  fillHeight,
  onSelectionUi,
}: {
  mod: DocModule
  lang: "vi" | "en"
  onContent: (html: string) => void
  /** Fire after caret/selection moves so toolbar can sync queryCommandState. */
  onSelectionUi?: () => void
  /** One plain paragraph filling the page — Word-like typing area */
  fillHeight?: boolean
}) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement | HTMLDivElement>(null)
  const Tag = bodyTag(mod.type) as "h1" | "p" | "div"

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.innerHTML !== mod.content) {
      el.innerHTML = mod.content || (mod.type === "title" ? "<br>" : "")
    }
  }, [mod.content, mod.type, mod.align, mod.fontPreset, mod.fontSizePx, mod.presetId])

  const spacerPreset = mod.presetId === "blank-spacer"
  const cls = [
    bodyClass(mod.type),
    "min-h-[1.2em] w-full rounded-sm outline-none docmod-editable",
    fillHeight ? "min-h-[calc(297mm-52mm)]" : "",
    spacerPreset ? "docmod-spacer-preset" : "",
  ]
    .filter(Boolean)
    .join(" ")
  const toolbar: CSSProperties = { ...mergeToolbarStyle(mod), ...moduleTypographyStyle(mod) }

  return (
    <Tag
      ref={ref as never}
      data-docmod-editable
      className={cls}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholderForType(mod.type, lang)}
      style={toolbar}
      onInput={(e) => onContent((e.target as HTMLElement).innerHTML)}
      onKeyUp={() => onSelectionUi?.()}
      onMouseUp={() => onSelectionUi?.()}
    />
  )
}

function HtmlChunk({
  mod,
  onContent,
  onSelectionUi,
}: {
  mod: DocModule
  onContent: (html: string) => void
  onSelectionUi?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.innerHTML !== mod.content) {
      el.innerHTML = mod.content
    }
  }, [mod.content])

  const toolbar: CSSProperties = mergeToolbarStyle(mod)

  return (
    <div
      ref={ref}
      data-docmod-editable
      className="vietdoc-html-fragment docmod-editable max-w-full overflow-x-auto text-sm leading-relaxed text-ink2 outline-none"
      contentEditable
      suppressContentEditableWarning
      style={toolbar}
      onInput={() => ref.current && onContent(ref.current.innerHTML)}
      onKeyUp={() => onSelectionUi?.()}
      onMouseUp={() => onSelectionUi?.()}
    />
  )
}

function PageSheet({
  pageNo,
  totalPages,
  lang,
  children,
  typingTail,
}: {
  pageNo: number
  totalPages: number
  lang: "vi" | "en"
  children: ReactNode
  /** Clickable area below blocks so users can keep typing on the page (no dashed UI). */
  typingTail?: ReactNode
}) {
  const L = lang === "vi"
  return (
    <div
      className="docmod-page-sheet mx-auto mb-6 box-border flex min-h-[297mm] w-[210mm] max-w-[min(210mm,calc(100vw-1.5rem))] shrink-0 flex-col bg-white pl-[18mm] pr-[18mm] pt-[16mm] shadow-[0_1px_3px_rgba(0,0,0,0.14),0_10px_28px_rgba(0,0,0,0.08)]"
      data-docmod-page-sheet
    >
      <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-visible pb-2">
        {children}
        {typingTail}
      </div>
      <p className="pointer-events-none pt-2 text-center text-[10px] tabular-nums text-black/35 select-none">
        {L ? `Trang ${pageNo} / ${totalPages}` : `Page ${pageNo} of ${totalPages}`}
      </p>
    </div>
  )
}

function PageBreakRibbon({
  lang,
  selected,
  onMouseDownSelect,
  onDelete,
}: {
  lang: "vi" | "en"
  selected: boolean
  onMouseDownSelect: () => void
  onDelete: () => void
}) {
  const L = lang === "vi"
  return (
    <div
      data-docmod-page-break
      className={`mx-auto mb-1 flex w-[210mm] max-w-[min(210mm,calc(100vw-1.5rem))] shrink-0 items-center gap-2 rounded-md border border-dashed px-2 py-1.5 text-[11px] transition-colors ${
        selected ? "border-[#378ADD] bg-[#e6f1fb]" : "border-black/25 bg-black/[0.03]"
      }`}
      onMouseDown={(e) => {
        e.preventDefault()
        onMouseDownSelect()
      }}
    >
      <span className="min-w-0 flex-1 text-ink2">
        {L ? "Ngắt trang — nội dung sau bắt đầu trang mới" : "Page break — content below starts on a new page"}
      </span>
      <button
        type="button"
        className="shrink-0 rounded border border-black/15 bg-white px-2 py-0.5 text-[10px] text-ink hover:bg-paper2"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onDelete}
      >
        {L ? "Xóa" : "Remove"}
      </button>
    </div>
  )
}

export type DocModEditorHandle = {
  exportDocx: (filename: string) => Promise<void>
  print: () => void
  copyPlainText: () => Promise<void>
}

export type DocModEditorProps = {
  initialTemplateId?: string
  /** `modal`: slimmer chrome; print/download live in the host modal footer. */
  variant?: "full" | "modal"
}

export const DocModEditor = forwardRef<DocModEditorHandle, DocModEditorProps>(function DocModEditor(
  { initialTemplateId, variant = "full" },
  ref,
) {
  const { lang } = useLang()
  const L = lang === "vi"

  const [modules, setModules] = useState<DocModule[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  /** Same as draggingId but updated synchronously in dragstart so dragover sees it before React re-renders. */
  const draggingIdRef = useRef<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [dropZone, setDropZone] = useState<"top" | "bottom" | "left" | "right" | null>(null)
  const [dropRowIndicator, setDropRowIndicator] = useState<{ groupId: string; edge: "top" | "bottom" } | null>(
    null,
  )
  const [past, setPast] = useState<DocModule[][]>([])
  const [future, setFuture] = useState<DocModule[][]>([])

  const modulesRef = useRef(modules)
  modulesRef.current = modules

  const dropTargetIdRef = useRef<string | null>(null)
  const dropRowIndicatorRef = useRef<typeof dropRowIndicator>(null)
  dropTargetIdRef.current = dropTargetId
  dropRowIndicatorRef.current = dropRowIndicator

  const emptyFlowRef = useRef<HTMLDivElement>(null)
  const [blankDocKey, setBlankDocKey] = useState(0)
  const [blankAlign, setBlankAlign] = useState<TextAlign>("left")
  const [statsTick, setStatsTick] = useState(0)
  const [canvasZoom, setCanvasZoom] = useState(100)

  const saveHistory = useCallback((current: DocModule[]) => {
    setPast((p) => {
      const next = [...p, cloneModules(current)]
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
    })
    setFuture([])
  }, [])

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p
      const prev = p[p.length - 1]
      setFuture((f) => [cloneModules(modulesRef.current), ...f])
      setModules(normalizeRowPairs(cloneModules(prev)))
      setSelectedId(null)
      if (prev.length === 0) {
        setActiveTemplateId((tid) => (tid === BLANK_TEMPLATE_ID ? BLANK_TEMPLATE_ID : null))
      }
      return p.slice(0, -1)
    })
  }, [])

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f
      const next = f[0]
      setPast((p) => [...p, cloneModules(modulesRef.current)])
      setModules(normalizeRowPairs(cloneModules(next)))
      setSelectedId(null)
      return f.slice(1)
    })
  }, [])

  const selected = useMemo(
    () => modules.find((m) => m.id === selectedId) ?? null,
    [modules, selectedId],
  )

  const toolbarEnabled =
    selected && selected.type !== "divider" && selected.type !== "pagebreak"

  const canUseFormatCommands = modules.length === 0 || Boolean(toolbarEnabled)

  const updateModule = useCallback((id: string, patch: Partial<DocModule>) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }, [])

  const applyFontPreset = useCallback(
    (preset: FontPreset) => {
      if (!selectedId || !toolbarEnabled) return
      updateModule(selectedId, { fontPreset: preset, fontSizePx: undefined })
    },
    [selectedId, toolbarEnabled, updateModule],
  )

  const applyFontSizePx = useCallback(
    (px: number) => {
      if (!selectedId || !toolbarEnabled) return
      updateModule(selectedId, { fontSizePx: px })
    },
    [selectedId, toolbarEnabled, updateModule],
  )

  const loadTemplate = useCallback((t: Template) => {
    saveHistory(modulesRef.current)
    const next = normalizeRowPairs(vietDocHtmlToModules(t.contentHTML))
    setModules(next)
    setActiveTemplateId(t.id)
    setSelectedId(null)
  }, [saveHistory])

  const loadBlankPage = () => {
    setPast([])
    setFuture([])
    setModules([])
    setActiveTemplateId(BLANK_TEMPLATE_ID)
    setSelectedId(null)
    setBlankAlign("left")
    setBlankDocKey((k) => k + 1)
    queueMicrotask(() => {
      emptyFlowRef.current?.focus()
    })
  }

  useEffect(() => {
    if (!initialTemplateId) return
    const t = templates.find((x) => x.id === initialTemplateId)
    if (!t) return
    loadTemplate(t)
  }, [initialTemplateId, loadTemplate])

  const sheets = useMemo(() => visibleSheets(modules), [modules])
  const totalSheets = sheets.length

  const approxWordCount = useMemo(() => {
    void statsTick
    void blankDocKey
    let n = 0
    for (const m of modules) {
      if (m.type === "divider" || m.type === "pagebreak") continue
      n += wordCountFromText(stripHtmlToText(m.content))
    }
    if (modules.length === 0 && typeof document !== "undefined") {
      const el = emptyFlowRef.current
      if (el?.textContent) n += wordCountFromText(el.textContent)
    }
    return n
  }, [modules, statsTick, blankDocKey])

  const pageCountDisplay = modules.length === 0 ? 1 : Math.max(1, totalSheets)

  const flowOnly = useMemo(
    () =>
      modules.length === 1 &&
      modules[0].type === "paragraph" &&
      !modules[0].presetId &&
      !modules[0].rowGroupId,
    [modules],
  )

  const focusOrAppendFreeParagraphAtEndOfSheet = useCallback(
    (sheetIndex: number) => {
      const sheets2 = visibleSheets(modulesRef.current)
      const sheet = sheets2[sheetIndex]
      if (!sheet) return

      const last = sheet.modules[sheet.modules.length - 1]
      if (
        last &&
        last.type === "paragraph" &&
        !last.presetId &&
        !last.rowGroupId &&
        !hasDocText(last.content)
      ) {
        setSelectedId(last.id)
        queueMicrotask(() => {
          const el = document.querySelector(
            `[data-module-id="${last.id}"] [data-docmod-editable]`,
          ) as HTMLElement | null
          el?.focus()
          if (el && typeof document !== "undefined") {
            const r = document.createRange()
            r.selectNodeContents(el)
            r.collapse(true)
            const s = window.getSelection()
            s?.removeAllRanges()
            s?.addRange(r)
          }
        })
        return
      }

      saveHistory(modulesRef.current)
      let newId = ""
      flushSync(() => {
        setModules((mods) => {
          const sh = visibleSheets(mods)
          const shSheet = sh[sheetIndex]
          if (!shSheet) return mods
          const para = newModule("paragraph", "", "left")
          newId = para.id
          const copy = [...mods]
          let insertAt: number
          if (shSheet.modules.length > 0) {
            const lastMod = shSheet.modules[shSheet.modules.length - 1]!
            const i = copy.findIndex((m) => m.id === lastMod.id)
            insertAt = i >= 0 ? i + 1 : copy.length
          } else {
            const lead = shSheet.leadingBreak
            if (lead) {
              const i = copy.findIndex((m) => m.id === lead.id)
              insertAt = i >= 0 ? i + 1 : copy.length
            } else {
              insertAt = 0
            }
          }
          copy.splice(insertAt, 0, para)
          return normalizeRowPairs(copy)
        })
      })
      if (!newId) return
      setSelectedId(newId)
      queueMicrotask(() => {
        const el = document.querySelector(
          `[data-module-id="${newId}"] [data-docmod-editable]`,
        ) as HTMLElement | null
        el?.focus()
        if (el && typeof document !== "undefined") {
          const r = document.createRange()
          r.selectNodeContents(el)
          r.collapse(true)
          const s = window.getSelection()
          s?.removeAllRanges()
          s?.addRange(r)
        }
      })
    },
    [saveHistory],
  )

  const insertPageBreak = useCallback(() => {
    saveHistory(modulesRef.current)
    const pb = newPageBreak()
    setModules((prev) => {
      const copy = [...prev]
      const i = selectedId ? copy.findIndex((m) => m.id === selectedId) : -1
      if (i < 0) copy.push(pb)
      else copy.splice(i + 1, 0, pb)
      return copy
    })
    setSelectedId(pb.id)
  }, [saveHistory, selectedId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key !== "Enter") return
      if (modulesRef.current.length === 0) return
      const canvas = document.querySelector("[data-docmod-canvas]")
      const ae = document.activeElement
      if (!canvas || !ae || !canvas.contains(ae)) return
      e.preventDefault()
      insertPageBreak()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [insertPageBreak])

  const addPreset = (preset: VietdocBlockPreset) => {
    saveHistory(modulesRef.current)
    const mod = moduleFromPreset(preset)
    const blankHtml = emptyFlowRef.current?.innerHTML ?? ""
    const leadFromBlank =
      modulesRef.current.length === 0 && hasDocText(blankHtml)
        ? newModule("paragraph", blankHtml, blankAlign)
        : null
    setModules((prev) => {
      const base = leadFromBlank ? [leadFromBlank] : prev
      const idx = selectedId ? base.findIndex((m) => m.id === selectedId) : -1
      const copy = [...base]
      if (idx === -1) copy.push(mod)
      else copy.splice(idx + 1, 0, mod)
      return normalizeRowPairs(copy)
    })
    setSelectedId(mod.id)
    if (mod.type !== "divider" && mod.type !== "pagebreak") {
      queueMicrotask(() => {
        const root = document.querySelector(
          `[data-module-id="${mod.id}"] [data-docmod-editable]`,
        ) as HTMLElement | undefined
        root?.focus()
      })
    }
  }

  const deleteModule = useCallback((id: string) => {
    saveHistory(modulesRef.current)
    setModules((prev) => {
      const next = normalizeRowPairs(prev.filter((m) => m.id !== id))
      if (next.length === 0) {
        setActiveTemplateId((tid) => (tid === BLANK_TEMPLATE_ID ? BLANK_TEMPLATE_ID : null))
      }
      return next
    })
    setSelectedId((cur) => (cur === id ? null : cur))
  }, [saveHistory])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Backspace" && e.key !== "Delete") return
      const t = e.target
      if (!t || !(t instanceof HTMLElement)) return
      if (!document.querySelector("[data-docmod-canvas]")?.contains(t)) return
      const editable = t.closest("[data-docmod-editable]")
      if (!editable || !(editable instanceof HTMLElement)) return
      if (hasDocText(editable.innerHTML)) return

      const surface = editable.closest("[data-docmod-surface]")
      const moduleId = surface?.getAttribute("data-module-id")
      if (!moduleId) return

      const mod = modulesRef.current.find((m) => m.id === moduleId)
      if (!mod || mod.type === "divider" || mod.type === "html" || mod.type === "pagebreak") return

      e.preventDefault()
      deleteModule(moduleId)
      queueMicrotask(() => {
        const nextFocus = document.querySelector(
          "[data-docmod-canvas] [data-docmod-editable]",
        ) as HTMLElement | undefined
        nextFocus?.focus()
      })
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [deleteModule])

  const moveModule = (id: string, dir: -1 | 1) => {
    const prev = modulesRef.current
    const i = prev.findIndex((m) => m.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= prev.length) return
    saveHistory(prev)
    const copy = [...prev]
    const [row] = copy.splice(i, 1)
    copy.splice(j, 0, row)
    setModules(normalizeRowPairs(copy))
  }

  const clearDropVisual = useCallback(() => {
    setDropTargetId(null)
    setDropZone(null)
    setDropRowIndicator(null)
  }, [])

  const onDragEnd = () => {
    draggingIdRef.current = null
    setDraggingId(null)
    clearDropVisual()
  }

  const executeDrop = (fromId: string | null) => {
    const srcId = fromId || draggingIdRef.current || draggingId
    if (!srcId) {
      onDragEnd()
      return
    }

    if (dropRowIndicator) {
      const { groupId, edge } = dropRowIndicator
      const prev = modulesRef.current
      const ri = findRowPairIndices(prev, groupId)
      if (!ri || prev.some((m) => m.id === srcId && m.rowGroupId === groupId)) {
        onDragEnd()
        return
      }
      saveHistory(prev)
      let next = cloneModules(prev)
      const srcG = next.find((m) => m.id === srcId)?.rowGroupId
      if (srcG) next = stripRowGroup(next, srcG)
      const si = next.findIndex((m) => m.id === srcId)
      if (si < 0) {
        onDragEnd()
        return
      }
      const [pulled] = next.splice(si, 1)
      const cleaned = { ...pulled, rowGroupId: undefined }
      let [r0] = findRowPairIndices(next, groupId) ?? [0, 0]
      if (si < r0) r0 -= 1
      const insertAt = edge === "top" ? r0 : r0 + 2
      next.splice(insertAt, 0, cleaned)
      setModules(normalizeRowPairs(next))
      onDragEnd()
      return
    }

    if (!dropTargetId || !dropZone) {
      onDragEnd()
      return
    }

    const tgtId = dropTargetId
    const zone = dropZone
    const prev = modulesRef.current
    if (srcId === tgtId) {
      onDragEnd()
      return
    }

    const srcMod = prev.find((m) => m.id === srcId)
    const tgtMod = prev.find((m) => m.id === tgtId)
    if (!srcMod || !tgtMod) {
      onDragEnd()
      return
    }

    saveHistory(prev)
    let next = cloneModules(prev)

    if (
      srcMod.rowGroupId &&
      tgtMod.rowGroupId &&
      srcMod.rowGroupId === tgtMod.rowGroupId &&
      (zone === "left" || zone === "right")
    ) {
      const i1 = next.findIndex((m) => m.id === srcId)
      const i2 = next.findIndex((m) => m.id === tgtId)
      if (i1 >= 0 && i2 >= 0 && i1 !== i2) {
        if (zone === "left" && i1 > i2) [next[i1], next[i2]] = [next[i2], next[i1]]
        else if (zone === "right" && i1 !== i2) [next[i1], next[i2]] = [next[i2], next[i1]]
      }
      setModules(normalizeRowPairs(next))
      onDragEnd()
      return
    }

    const srcG = next.find((m) => m.id === srcId)?.rowGroupId
    if (srcG) next = stripRowGroup(next, srcG)
    const tgtG0 = next.find((m) => m.id === tgtId)?.rowGroupId
    if (tgtG0 && (zone === "left" || zone === "right")) next = stripRowGroup(next, tgtG0)

    const si = next.findIndex((m) => m.id === srcId)
    if (si < 0) {
      onDragEnd()
      return
    }
    const [pulled] = next.splice(si, 1)
    const cleaned = { ...pulled, rowGroupId: undefined }

    if (zone === "top" || zone === "bottom") {
      const tAfter = next.find((m) => m.id === tgtId)
      if (!tAfter) {
        next.splice(si, 0, cleaned)
        setModules(normalizeRowPairs(next))
        onDragEnd()
        return
      }
      let insertIdx: number
      if (tAfter.rowGroupId) {
        const fr = findRowPairIndices(next, tAfter.rowGroupId)
        if (!fr) {
          next.splice(si, 0, cleaned)
          setModules(normalizeRowPairs(next))
          onDragEnd()
          return
        }
        let [r0, r1] = fr
        if (si < r0) {
          r0 -= 1
          r1 -= 1
        }
        insertIdx = zone === "top" ? r0 : r1 + 1
      } else {
        let ti = next.findIndex((m) => m.id === tgtId)
        if (si < ti) ti -= 1
        insertIdx = zone === "top" ? ti : ti + 1
      }
      next.splice(insertIdx, 0, cleaned)
      setModules(normalizeRowPairs(next))
      onDragEnd()
      return
    }

    const newG = crypto.randomUUID()
    const ti = next.findIndex((m) => m.id === tgtId)
    if (ti < 0) {
      next.push(cleaned)
      setModules(normalizeRowPairs(next))
      onDragEnd()
      return
    }
    if (zone === "left") {
      next.splice(ti, 0, { ...cleaned, rowGroupId: newG })
      next[ti + 1] = { ...next[ti + 1], rowGroupId: newG }
    } else {
      next.splice(ti + 1, 0, { ...cleaned, rowGroupId: newG })
      next[ti] = { ...next[ti], rowGroupId: newG }
    }
    setModules(normalizeRowPairs(next))
    onDragEnd()
  }

  const handleModuleDragOver = (e: DragEvent, m: DocModule, ctx: { inRow: boolean; rowGroupId?: string }) => {
    const dragFrom = draggingIdRef.current
    if (!dragFrom) {
      clearDropVisual()
      return
    }
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragFrom === m.id) {
      clearDropVisual()
      return
    }
    if (ctx.inRow && ctx.rowGroupId) {
      const dragMod = modulesRef.current.find((x) => x.id === dragFrom)
      const reorderingInsideRow = dragMod?.rowGroupId === ctx.rowGroupId
      if (reorderingInsideRow) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const xR = (e.clientX - rect.left) / rect.width
        const yR = (e.clientY - rect.top) / rect.height
        let zone: "top" | "bottom" | "left" | "right"
        if (yR < 0.25) zone = "top"
        else if (yR > 0.75) zone = "bottom"
        else if (xR < 0.5) zone = "left"
        else zone = "right"
        setDropRowIndicator(null)
        setDropTargetId(m.id)
        setDropZone(zone)
        return
      }
      const rowEl = (e.currentTarget as HTMLElement).closest("[data-docmod-module-row]")
      if (!rowEl) return
      const rect = rowEl.getBoundingClientRect()
      const edge = e.clientY < rect.top + rect.height / 2 ? "top" : "bottom"
      setDropRowIndicator({ groupId: ctx.rowGroupId, edge })
      setDropTargetId(null)
      setDropZone(null)
      return
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const xR = (e.clientX - rect.left) / rect.width
    const yR = (e.clientY - rect.top) / rect.height
    let zone: "top" | "bottom" | "left" | "right"
    if (yR < 0.25) zone = "top"
    else if (yR > 0.75) zone = "bottom"
    else if (xR < 0.5) zone = "left"
    else zone = "right"
    setDropRowIndicator(null)
    setDropTargetId(m.id)
    setDropZone(zone)
  }

  const handleRowContainerDragOver = (e: DragEvent, groupId: string) => {
    const dragFrom = draggingIdRef.current
    if (!dragFrom) {
      clearDropVisual()
      return
    }
    const members = modulesRef.current.filter((m) => m.rowGroupId === groupId)
    if (members.some((m) => m.id === dragFrom)) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      return
    }
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    const rowEl = e.currentTarget as HTMLElement
    const rect = rowEl.getBoundingClientRect()
    const edge = e.clientY < rect.top + rect.height / 2 ? "top" : "bottom"
    setDropRowIndicator({ groupId, edge })
    setDropTargetId(null)
    setDropZone(null)
  }

  const handleDragLeaveModule = useCallback((surfaceId: string, e: DragEvent<HTMLDivElement>) => {
    const rel = e.relatedTarget
    if (rel && rel instanceof Node && e.currentTarget.contains(rel)) return
    if (dropTargetIdRef.current !== surfaceId) return
    setDropTargetId(null)
    setDropZone(null)
  }, [])

  const handleDragLeaveRow = useCallback((groupId: string, e: DragEvent<HTMLDivElement>) => {
    const rel = e.relatedTarget
    if (rel && rel instanceof Node && e.currentTarget.contains(rel)) return
    if (dropRowIndicatorRef.current?.groupId !== groupId) return
    setDropRowIndicator(null)
  }, [])

  const onDropModule = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const fromId = e.dataTransfer.getData("text/docmod-id") || draggingIdRef.current || draggingId
    executeDrop(fromId)
  }

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("[data-docmod-sidebar]")) return
      if (t.closest("[data-docmod-sidebar-strip]")) return
      if (t.closest("[data-docmod-surface]")) return
      if (t.closest("[data-docmod-toolbar]")) return
      if (t.closest("[data-docmod-empty-flow]")) return
      if (t.closest("[data-docmod-page-break]")) return
      if (t.closest("[data-docmod-sheet-typing-zone]")) return
      setSelectedId(null)
    }
    document.addEventListener("mousedown", onDocMouseDown)
    return () => document.removeEventListener("mousedown", onDocMouseDown)
  }, [])

  useEffect(() => {
    if (modules.length > 0) return
    const el = emptyFlowRef.current
    if (!el) return
    const id = requestAnimationFrame(() => {
      el.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [modules.length])

  const getFormatRoot = (): HTMLElement | null => {
    if (modulesRef.current.length === 0) return emptyFlowRef.current
    if (!selectedId) return null
    const mod = modulesRef.current.find((m) => m.id === selectedId)
    if (!mod || mod.type === "divider" || mod.type === "pagebreak") return null
    return document.querySelector(
      `[data-module-id="${selectedId}"] [data-docmod-editable]`,
    ) as HTMLElement | null
  }

  const exec = (cmd: string, val?: string) => {
    const root = getFormatRoot()
    if (!root || !canUseFormatCommands) return
    root.focus()
    try {
      document.execCommand(cmd, false, val)
    } catch {
      /* ignore */
    }
    setStatsTick((s) => s + 1)
    if (modulesRef.current.length > 0 && selectedId) {
      const mod = modulesRef.current.find((m) => m.id === selectedId)
      if (mod && isRichTextModule(mod)) {
        updateModule(selectedId, { content: root.innerHTML })
      }
    }
  }

  const setAlign = (align: TextAlign) => {
    if (modulesRef.current.length === 0) {
      setBlankAlign(align)
      return
    }
    if (!selectedId || !toolbarEnabled) return
    const root = document.querySelector(
      `[data-module-id="${selectedId}"] [data-docmod-editable]`,
    ) as HTMLElement | null
    if (root) root.style.textAlign = align
    updateModule(selectedId, { align })
  }

  const runClipboard = (cmd: "cut" | "copy" | "selectAll") => {
    const root = getFormatRoot()
    if (!root || !canUseFormatCommands) return
    root.focus()
    try {
      document.execCommand(cmd, false, undefined)
    } catch {
      /* ignore */
    }
    setStatsTick((s) => s + 1)
    if (cmd === "cut" && modulesRef.current.length > 0 && selectedId) {
      const mod = modulesRef.current.find((m) => m.id === selectedId)
      if (mod && isRichTextModule(mod)) {
        updateModule(selectedId, { content: root.innerHTML })
      }
    }
  }

  const pasteFromClipboard = async () => {
    const root = getFormatRoot()
    if (!root || !canUseFormatCommands) return
    root.focus()
    try {
      const t = await navigator.clipboard.readText()
      document.execCommand("insertText", false, t)
    } catch {
      try {
        document.execCommand("paste", false, undefined)
      } catch {
        /* ignore */
      }
    }
    setStatsTick((s) => s + 1)
    if (modulesRef.current.length > 0 && selectedId) {
      const mod = modulesRef.current.find((m) => m.id === selectedId)
      if (mod && isRichTextModule(mod)) {
        updateModule(selectedId, { content: root.innerHTML })
      }
    }
  }

  const insertLink = () => {
    const root = getFormatRoot()
    if (!root || !canUseFormatCommands) return
    const def = "https://"
    const url =
      typeof window !== "undefined" ? window.prompt(L ? "Địa chỉ liên kết:" : "Hyperlink URL:", def) : null
    if (!url?.trim()) return
    root.focus()
    try {
      document.execCommand("createLink", false, url.trim())
    } catch {
      /* ignore */
    }
    setStatsTick((s) => s + 1)
    if (modulesRef.current.length > 0 && selectedId) {
      const mod = modulesRef.current.find((m) => m.id === selectedId)
      if (mod && isRichTextModule(mod)) {
        updateModule(selectedId, { content: root.innerHTML })
      }
    }
  }

  const buildExportBodyInnerHtml = useCallback((): string => {
    const parts: string[] = []
    const blank = emptyFlowRef.current
    if (modulesRef.current.length === 0 && blank && hasDocText(blank.innerHTML)) {
      parts.push(`<div style="text-align:${blankAlign}">${blank.innerHTML}</div>`)
    }
    for (const m of modulesRef.current) {
      if (m.type === "pagebreak") parts.push('<hr class="docmod-export-pagebreak" />')
      else if (m.type === "divider") parts.push("<hr />")
      else if (m.type === "html") parts.push(m.content)
      else parts.push(`<div style="text-align:${m.align}">${m.content}</div>`)
    }
    return parts.join("\n")
  }, [blankAlign])

  const runExportDocx = useCallback(
    async (filename: string) => {
      const body = buildExportBodyInnerHtml()
      const holder = document.createElement("div")
      holder.innerHTML = body.trim() ? body : "<p> </p>"
      try {
        const { exportAsDocx } = await import("@/lib/exportDocx")
        await exportAsDocx(holder, filename)
      } catch {
        /* ignore */
      }
    },
    [buildExportBodyInnerHtml],
  )

  const printDocument = useCallback(() => {
    window.print()
  }, [])

  const copyPlainTextFromDocument = useCallback(async () => {
    const body = buildExportBodyInnerHtml()
    const holder = document.createElement("div")
    holder.innerHTML = body.trim() ? body : "<p> </p>"
    await copyDocText(holder)
  }, [buildExportBodyInnerHtml])

  useImperativeHandle(
    ref,
    () => ({
      exportDocx: runExportDocx,
      print: printDocument,
      copyPlainText: copyPlainTextFromDocument,
    }),
    [runExportDocx, printDocument, copyPlainTextFromDocument],
  )

  const onDragStartHandle = (e: DragEvent, id: string) => {
    draggingIdRef.current = id
    e.dataTransfer.setData("text/docmod-id", id)
    e.dataTransfer.effectAllowed = "move"
    setDraggingId(id)
  }

  const boldActive = canUseFormatCommands
    ? (() => {
        try {
          return document.queryCommandState("bold")
        } catch {
          return false
        }
      })()
    : false
  const italicActive = canUseFormatCommands
    ? (() => {
        try {
          return document.queryCommandState("italic")
        } catch {
          return false
        }
      })()
    : false
  const underlineActive = canUseFormatCommands
    ? (() => {
        try {
          return document.queryCommandState("underline")
        } catch {
          return false
        }
      })()
    : false
  const strikeActive = canUseFormatCommands
    ? (() => {
        try {
          return document.queryCommandState("strikeThrough")
        } catch {
          return false
        }
      })()
    : false

  const currentAlign: TextAlign = modules.length === 0 ? blankAlign : selected?.align ?? "left"

  const emptyHint = L
    ? sidebarOpen
      ? "Chọn biểu mẫu bên trái để bắt đầu, hoặc thêm khối bằng nút +."
      : "Mở bảng « Mẫu & khối » để chọn biểu mẫu hoặc thêm khối."
    : sidebarOpen
      ? "Choose a template from the sidebar to begin, or add a block with +."
      : "Open « Templates » to pick a template or add blocks."

  const templateButtonClass = (active: boolean) =>
    `flex items-start gap-2 rounded-lg border px-2 py-1.5 text-left text-xs transition-colors ${
      active ? "border-red bg-white font-medium text-ink shadow-sm" : "border-black/10 bg-white/80 text-ink2 hover:bg-white"
    }`

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden border-t border-black/10 bg-paper2">
      {sidebarOpen ? (
        <aside
          id="docmod-sidebar"
          data-docmod-sidebar
          className="flex w-[220px] shrink-0 flex-col border-r border-black/10 bg-paper min-h-0 overflow-hidden"
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-black/10 bg-paper py-1.5 pl-3 pr-2">
            <span className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-wide text-ink2">
              {L ? "Thanh công cụ" : "Toolbar"}
            </span>
            <button
              type="button"
              data-docmod-sidebar-toggle
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-[#d1d1d1] bg-white text-[#323130] shadow-[0_0.5px_1px_rgba(0,0,0,0.08)] outline-none hover:border-[#b3b3b3] hover:bg-[#f3f2f1] active:bg-[#edebe9]"
              aria-expanded={true}
              aria-controls="docmod-sidebar"
              title={L ? "Ẩn mẫu & khối" : "Hide templates"}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setSidebarOpen(false)}
            >
              <IconSidebarCollapse />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 pr-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink2">
                {L ? "Biểu mẫu" : "Templates"}
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <button
                  type="button"
                  className={templateButtonClass(activeTemplateId === BLANK_TEMPLATE_ID)}
                  onClick={loadBlankPage}
                >
                  <span className="shrink-0 text-base" aria-hidden>
                    📄
                  </span>
                  <span className="leading-snug">{L ? "Trang trắng mới" : "New blank page"}</span>
                </button>
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={templateButtonClass(activeTemplateId === t.id)}
                    onClick={() => loadTemplate(t)}
                  >
                    <span className="shrink-0 text-base" aria-hidden>
                      {t.icon}
                    </span>
                    <span className="leading-snug">{L ? t.name.vi : t.name.en}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 border-t border-black/10 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink2">
              {L ? "Thêm khối (như biểu mẫu trang chủ)" : "Add blocks (home-style)"}
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {VIETDOC_BLOCK_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between gap-1 rounded-lg border border-black/10 bg-white/80 px-2 py-1"
                >
                  <span className="min-w-0 flex-1 text-[11px] leading-snug text-ink2">
                    {L ? preset.vi : preset.en}
                  </span>
                  <button
                    type="button"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-black/10 bg-paper text-sm font-semibold text-ink hover:bg-paper2"
                    aria-label={L ? `Thêm ${preset.vi}` : `Add ${preset.en}`}
                    onClick={() => addPreset(preset)}
                  >
                    +
                  </button>
                </div>
              ))}
              </div>
            </div>
          </div>
        </aside>
      ) : (
        <div
          className="flex w-9 shrink-0 flex-col items-center border-r border-black/10 bg-paper pt-2"
          data-docmod-sidebar-strip
        >
          <button
            type="button"
            data-docmod-sidebar-toggle
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-[#d1d1d1] bg-white text-[#323130] shadow-[0_0.5px_1px_rgba(0,0,0,0.08)] outline-none hover:border-[#b3b3b3] hover:bg-[#f3f2f1] active:bg-[#edebe9]"
            aria-expanded={false}
            aria-controls="docmod-sidebar"
            title={L ? "Mẫu & khối" : "Templates"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setSidebarOpen(true)}
          >
            <IconSidebarExpand />
          </button>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div
          data-docmod-toolbar
          className="flex shrink-0 flex-col gap-1 border-b border-black/10 bg-white px-2 py-1.5"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <RibbonBtn
              title={L ? "Cắt" : "Cut"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                runClipboard("cut")
              }}
            >
              <IconCut />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Sao chép" : "Copy"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                runClipboard("copy")
              }}
            >
              <IconCopy />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Dán" : "Paste"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                void pasteFromClipboard()
              }}
            >
              <IconPaste />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Chọn tất cả" : "Select all"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                runClipboard("selectAll")
              }}
            >
              <IconSelectAll />
            </RibbonBtn>
            <span className="mx-0.5 h-5 w-px bg-black/10" aria-hidden />
            <select
              className="max-w-[9rem] rounded border border-black/10 bg-paper px-1.5 py-0.5 text-xs text-ink disabled:opacity-40"
              aria-label={L ? "Kiểu chữ" : "Text style"}
              disabled={!toolbarEnabled || selected?.type === "html"}
              value={toolbarEnabled && selected ? selected.fontPreset ?? "normal" : "normal"}
              onChange={(e) => applyFontPreset(e.target.value as FontPreset)}
            >
              <option value="normal">{L ? "Thường" : "Normal"}</option>
              <option value="h1">{L ? "Tiêu đề 1" : "Heading 1"}</option>
              <option value="h2">{L ? "Tiêu đề 2" : "Heading 2"}</option>
              <option value="h3">{L ? "Tiêu đề 3" : "Heading 3"}</option>
            </select>
            <select
              className="rounded border border-black/10 bg-paper px-1.5 py-0.5 text-xs text-ink disabled:opacity-40"
              aria-label={L ? "Cỡ chữ" : "Font size"}
              disabled={!toolbarEnabled || selected?.type === "html"}
              value={
                toolbarEnabled && selected
                  ? String(Math.min(24, Math.max(10, effectiveFontSizePx(selected))))
                  : "13"
              }
              onChange={(e) => applyFontSizePx(Number(e.target.value))}
            >
              {FONT_SIZE_OPTS.map((n) => (
                <option key={n} value={n}>
                  {n}px
                </option>
              ))}
            </select>
            <span className="mx-0.5 h-5 w-px bg-black/10" aria-hidden />
            <RibbonBtn
              title={L ? "Đậm (Ctrl+B)" : "Bold (Ctrl+B)"}
              active={boldActive}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("bold")
              }}
            >
              <IconBold />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Nghiêng (Ctrl+I)" : "Italic (Ctrl+I)"}
              active={italicActive}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("italic")
              }}
            >
              <IconItalic />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Gạch dưới (Ctrl+U)" : "Underline (Ctrl+U)"}
              active={underlineActive}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("underline")
              }}
            >
              <IconUnderline />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Gạch ngang" : "Strikethrough"}
              active={strikeActive}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("strikeThrough")
              }}
            >
              <IconStrikethrough />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Xóa định dạng" : "Clear formatting"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("removeFormat")
              }}
            >
              <IconClearFormat />
            </RibbonBtn>
            <span className="mx-0.5 h-5 w-px bg-black/10" aria-hidden />
            <RibbonBtn
              title={L ? "Dấu đầu dòng" : "Bullets"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("insertUnorderedList")
              }}
            >
              <IconBullets />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Đánh số" : "Numbering"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("insertOrderedList")
              }}
            >
              <IconNumbering />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Tăng lề" : "Increase indent"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("indent")
              }}
            >
              <IconIndent />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Giảm lề" : "Decrease indent"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                exec("outdent")
              }}
            >
              <IconOutdent />
            </RibbonBtn>
            <span className="mx-0.5 h-5 w-px bg-black/10" aria-hidden />
            <RibbonBtn
              title={L ? "Căn trái" : "Align left"}
              active={currentAlign === "left"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                setAlign("left")
              }}
            >
              <IconAlignLeft />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Căn giữa" : "Center"}
              active={currentAlign === "center"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                setAlign("center")
              }}
            >
              <IconAlignCenter />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Căn phải" : "Align right"}
              active={currentAlign === "right"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                setAlign("right")
              }}
            >
              <IconAlignRight />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Căn đều" : "Justify"}
              active={currentAlign === "justify"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                setAlign("justify")
              }}
            >
              <IconAlignJustify />
            </RibbonBtn>
            <span className="mx-0.5 h-5 w-px bg-black/10" aria-hidden />
            <RibbonBtn
              title={L ? "Siêu liên kết" : "Hyperlink"}
              disabled={!canUseFormatCommands}
              onMouseDown={(e) => {
                e.preventDefault()
                insertLink()
              }}
            >
              <IconLink />
            </RibbonBtn>
            <RibbonBtn
              title={
                L
                  ? "Ngắt trang (Ctrl+Enter hoặc ⌘+Enter)"
                  : "Page break (Ctrl+Enter or ⌘+Enter)"
              }
              disabled={modules.length === 0}
              onMouseDown={(e) => {
                e.preventDefault()
                insertPageBreak()
              }}
            >
              <IconPageBreak />
            </RibbonBtn>
            <span className="mx-0.5 h-5 w-px bg-black/10" aria-hidden />
            <RibbonBtn
              title={L ? "Hoàn tác (cấu trúc khối)" : "Undo (block structure)"}
              disabled={past.length === 0}
              onMouseDown={(e) => {
                e.preventDefault()
                undo()
              }}
            >
              <IconUndo />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Làm lại (cấu trúc khối)" : "Redo (block structure)"}
              disabled={future.length === 0}
              onMouseDown={(e) => {
                e.preventDefault()
                redo()
              }}
            >
              <IconRedo />
            </RibbonBtn>
          </div>
          {variant !== "modal" ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-black/5 pt-1">
            <RibbonBtn
              title={L ? "In (ẩn thanh công cụ khi in)" : "Print (toolbar hidden in print)"}
              onMouseDown={(e) => {
                e.preventDefault()
                printDocument()
              }}
            >
              <IconPrint />
            </RibbonBtn>
            <RibbonBtn
              title={L ? "Tải nội dung dạng .docx" : "Download as .docx"}
              onMouseDown={(e) => {
                e.preventDefault()
                void runExportDocx("viet-doc-dung-thu")
              }}
            >
              <IconDownload />
            </RibbonBtn>
            <span className="text-[10px] text-ink2">
              {L
                ? "Gợi ý: nhấn vùng trắng dưới khối để gõ thêm đoạn; thêm khối từ « Mẫu & khối ». Ctrl/⌘+Enter = ngắt trang."
                : "Tip: click the white area below blocks to type more body text; add blocks from « Templates & blocks ». Ctrl/⌘+Enter = page break."}
            </span>
          </div>
          ) : null}
        </div>

        <div
          data-docmod-canvas
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#bfbfbf]"
        >
          <div
            className="min-h-0 flex-1 overflow-y-auto px-1 py-3 sm:px-3 sm:py-4"
            style={{ zoom: canvasZoom / 100 } as CSSProperties}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null)
            }}
          >
          {modules.length === 0 ? (
            <div className="flex min-h-0 flex-1 flex-col items-center gap-3">
              <PageSheet pageNo={1} totalPages={1} lang={lang}>
                <div
                  key={blankDocKey}
                  ref={emptyFlowRef}
                  data-docmod-empty-flow
                  contentEditable
                  suppressContentEditableWarning
                  className="docmod-empty-flow min-h-[calc(297mm-120px)] w-full flex-1 border-0 bg-transparent px-0 py-1 text-sm leading-relaxed text-ink2 outline-none"
                  style={{ textAlign: blankAlign }}
                  data-placeholder={
                    L
                      ? "Nhấn và gõ trực tiếp trên trang (như Word). Thêm khối từ cột trái khi cần biểu mẫu — nội dung trang sẽ được giữ làm đoạn đầu."
                      : "Type on the page like Word. Add blocks from the left when you need forms — your typing here becomes the opening paragraph."
                  }
                  onInput={() => setStatsTick((n) => n + 1)}
                  onKeyUp={() => setStatsTick((n) => n + 1)}
                  onMouseUp={() => setStatsTick((n) => n + 1)}
                />
              </PageSheet>
              <p className="shrink-0 px-2 text-center text-xs leading-relaxed text-black/55">{emptyHint}</p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col items-center">
              {sheets.map((sheet, si) => (
                <Fragment key={`sheet-${si}-${sheet.leadingBreak?.id ?? "0"}`}>
                  {sheet.leadingBreak ? (
                    <PageBreakRibbon
                      lang={lang}
                      selected={selectedId === sheet.leadingBreak.id}
                      onMouseDownSelect={() => setSelectedId(sheet.leadingBreak!.id)}
                      onDelete={() => deleteModule(sheet.leadingBreak!.id)}
                    />
                  ) : null}
                  <PageSheet
                    pageNo={si + 1}
                    totalPages={totalSheets}
                    lang={lang}
                    typingTail={
                      <div
                        data-docmod-sheet-typing-zone
                        className="docmod-sheet-typing-tail min-h-[12mm] flex-1 shrink-0 cursor-text print:hidden"
                        title={
                          L
                            ? "Nhấn để gõ thêm đoạn trên trang (ngoài khối)"
                            : "Click to type more on the page (outside blocks)"
                        }
                        onMouseDown={(e) => {
                          if (e.button !== 0) return
                          e.preventDefault()
                          focusOrAppendFreeParagraphAtEndOfSheet(si)
                        }}
                      />
                    }
                  >
                    {sheetRenderEntries(sheet.modules).map((entry) => {
                      const ModuleShell = (
                        mod: DocModule,
                        dragMode: "full" | "none" | "row",
                        rowGroupId?: string,
                      ) => {
                        const dragCls =
                          (dragMode === "full" || dragMode === "row") &&
                          dropTargetId === mod.id &&
                          dropZone
                            ? `docmod-drag-over-${dropZone}`
                            : ""
                        return (
                          <div
                            key={mod.id}
                            data-module-id={mod.id}
                            data-docmod-surface
                            className={`docmod-module group relative mb-0 w-full min-w-0 overflow-visible ${
                              draggingId === mod.id ? "dragging opacity-40" : ""
                            }`}
                            onMouseDown={(e) => {
                              const t = e.target as HTMLElement
                              if (t.closest("[data-drag-handle]") || t.closest("button")) return
                              setSelectedId(mod.id)
                            }}
                            onDragOver={
                              flowOnly || dragMode === "none"
                                ? undefined
                                : dragMode === "row" && rowGroupId
                                  ? (e) => handleModuleDragOver(e, mod, { inRow: true, rowGroupId })
                                  : (e) => handleModuleDragOver(e, mod, { inRow: false })
                            }
                            onDrop={flowOnly || dragMode === "none" ? undefined : onDropModule}
                            onDragLeave={
                              flowOnly || dragMode === "none"
                                ? undefined
                                : (e) => handleDragLeaveModule(mod.id, e)
                            }
                          >
                            <div
                              className={`docmod-module-face relative w-full overflow-visible rounded-md border-0 transition-shadow ${
                                selectedId === mod.id && !flowOnly
                                  ? "ring-2 ring-[#378ADD]"
                                  : flowOnly
                                    ? "ring-0"
                                    : "ring-0 hover:ring-1 hover:ring-black/[0.14]"
                              } ${dragCls}`}
                            >
                              {!flowOnly ? (
                                <span
                                  className={`docmod-type-badge pointer-events-none absolute -top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-medium ${
                                    selectedId === mod.id ? "block" : "hidden group-hover:block"
                                  }`}
                                >
                                  {moduleBadgeLabel(mod, lang)}
                                </span>
                              ) : null}

                              {!flowOnly ? (
                                <div
                                  data-drag-handle
                                  draggable
                                  onDragStart={(e) => onDragStartHandle(e, mod.id)}
                                  onDragEnd={onDragEnd}
                                  className={`pointer-events-auto absolute left-0 top-1/2 z-30 flex min-h-[2.75rem] min-w-[2.75rem] -translate-x-full -translate-y-1/2 cursor-grab select-none items-center justify-end rounded-sm pr-0.5 text-muted transition-opacity duration-150 hover:bg-black/[0.04] active:cursor-grabbing ${
                                    selectedId === mod.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                  }`}
                                  aria-label={L ? "Kéo để sắp xếp" : "Drag to reorder"}
                                  onMouseDown={(e) => {
                                    e.stopPropagation()
                                    const ae = document.activeElement
                                    if (
                                      ae instanceof HTMLElement &&
                                      document.querySelector("[data-docmod-canvas]")?.contains(ae)
                                    ) {
                                      ae.blur()
                                    }
                                  }}
                                >
                                  <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden>
                                    <circle cx="3" cy="3" r="1.2" fill="currentColor" />
                                    <circle cx="9" cy="3" r="1.2" fill="currentColor" />
                                    <circle cx="3" cy="7" r="1.2" fill="currentColor" />
                                    <circle cx="9" cy="7" r="1.2" fill="currentColor" />
                                    <circle cx="3" cy="11" r="1.2" fill="currentColor" />
                                    <circle cx="9" cy="11" r="1.2" fill="currentColor" />
                                  </svg>
                                </div>
                              ) : null}

                              {mod.type === "divider" ? (
                                <hr className="my-3 border-0 border-t-[0.5px] border-black/20" />
                              ) : mod.type === "html" ? (
                                <HtmlChunk
                                  mod={mod}
                                  onContent={(html) => updateModule(mod.id, { content: html })}
                                  onSelectionUi={() => setStatsTick((n) => n + 1)}
                                />
                              ) : (
                                <EditableBody
                                  mod={mod}
                                  lang={lang}
                                  fillHeight={flowOnly}
                                  onContent={(html) => updateModule(mod.id, { content: html })}
                                  onSelectionUi={() => setStatsTick((n) => n + 1)}
                                />
                              )}

                              {!flowOnly ? (
                                <div
                                  className={`pointer-events-auto absolute right-0 top-1/2 z-30 flex min-h-[2.75rem] w-11 translate-x-full -translate-y-1/2 flex-col items-start justify-center gap-0.5 pl-0.5 transition-opacity duration-150 ${
                                    selectedId === mod.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    className="rounded border border-black/10 bg-white px-1 py-0.5 text-[10px] leading-none text-ink hover:bg-paper2"
                                    aria-label={L ? "Lên" : "Up"}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={() => moveModule(mod.id, -1)}
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded border border-black/10 bg-white px-1 py-0.5 text-[10px] leading-none text-red hover:bg-paper2"
                                    aria-label={L ? "Xóa" : "Delete"}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={() => deleteModule(mod.id)}
                                  >
                                    🗑
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded border border-black/10 bg-white px-1 py-0.5 text-[10px] leading-none text-ink hover:bg-paper2"
                                    aria-label={L ? "Xuống" : "Down"}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={() => moveModule(mod.id, 1)}
                                  >
                                    ↓
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )
                      }

                      if (entry.kind === "single") {
                        return ModuleShell(entry.m, "full")
                      }
                      const rowDragCls =
                        dropRowIndicator?.groupId === entry.groupId
                          ? dropRowIndicator.edge === "top"
                            ? "docmod-drag-over-top"
                            : "docmod-drag-over-bottom"
                          : ""
                      return (
                        <div
                          key={entry.groupId}
                          data-docmod-module-row={entry.groupId}
                          className={`docmod-module-row ${rowDragCls}`}
                          onDragOver={flowOnly ? undefined : (e) => handleRowContainerDragOver(e, entry.groupId)}
                          onDrop={flowOnly ? undefined : onDropModule}
                          onDragLeave={flowOnly ? undefined : (e) => handleDragLeaveRow(entry.groupId, e)}
                        >
                          {ModuleShell(entry.a, "row", entry.groupId)}
                          {ModuleShell(entry.b, "row", entry.groupId)}
                        </div>
                      )
                    })}
                  </PageSheet>
                </Fragment>
              ))}
            </div>
          )}
          </div>
          <div
            data-docmod-status
            className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-black/15 bg-[#e8e8e8] px-2 py-1 text-[11px] text-ink"
          >
            <span className="tabular-nums text-ink2">
              {L
                ? `${pageCountDisplay} trang · ~${approxWordCount} từ`
                : `${pageCountDisplay} page(s) · ~${approxWordCount} words`}
            </span>
            <label className="flex items-center gap-2 text-ink2">
              <span className="whitespace-nowrap">{L ? "Thu / phóng" : "Zoom"}</span>
              <input
                type="range"
                className="h-1 w-28 min-w-[6rem] cursor-pointer accent-[#185fa5]"
                min={50}
                max={150}
                value={canvasZoom}
                onChange={(e) => setCanvasZoom(Number(e.target.value))}
              />
              <span className="w-9 tabular-nums">{canvasZoom}%</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
})

DocModEditor.displayName = "DocModEditor"
