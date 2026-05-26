import type { MouseEvent, ReactNode, SVGProps } from "react"

/** Office / Word–style ribbon control (28×28-ish hit target, neutral chrome). */
export function RibbonBtn({
  title,
  disabled,
  active,
  children,
  onMouseDown,
}: {
  title: string
  disabled?: boolean
  active?: boolean
  children: ReactNode
  onMouseDown: (e: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      disabled={disabled}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border bg-white text-[#323130] shadow-[0_0.5px_1px_rgba(0,0,0,0.08)] outline-none hover:bg-[#f3f2f1] active:bg-[#edebe9] disabled:pointer-events-none disabled:opacity-40 ${
        active ? "border-[#2b579a] bg-[#d6e8fc] text-[#1a4480] hover:bg-[#c9e0fb]" : "border-[#d1d1d1] hover:border-[#b3b3b3]"
      }`}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  )
}

const s = "h-4 w-4 shrink-0"
const strokeIcon: SVGProps<SVGSVGElement> = {
  className: s,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  stroke: "currentColor",
  strokeWidth: 1.65,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

export function IconCut() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
    </svg>
  )
}

export function IconCopy() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <rect x="8" y="8" width="11" height="13" rx="1.5" />
      <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function IconPaste() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M9 4h6v2H9V4zM8 6H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2" />
      <path d="M9 6V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 12h6M9 15h6" />
    </svg>
  )
}

export function IconSelectAll() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M4 7V5a1 1 0 0 1 1-1h2M4 17v2a1 1 0 0 0 1 1h2M17 4h2a1 1 0 0 1 1 1v2M17 20h2a1 1 0 0 0 1-1v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  )
}

export function IconBold() {
  return (
    <svg className={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="currentColor"
        d="M7 5h6.5c2.2 0 3.8 1.1 3.8 3.1 0 1.2-.6 2.1-1.6 2.6 1.3.5 2.1 1.6 2.1 3.1 0 2.3-1.8 3.7-4.6 3.7H7V5zm2.2 2v3.2h3.8c1.1 0 1.8-.5 1.8-1.5 0-1.1-.7-1.7-1.9-1.7H9.2zm0 5.2V17h4.3c1.4 0 2.2-.6 2.2-1.8 0-1.2-.8-1.8-2.3-1.8H9.2z"
      />
    </svg>
  )
}

export function IconItalic() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M12 5h4M10 19h4M14 5L10 19" />
    </svg>
  )
}

export function IconUnderline() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M6 19h12M8 5v8a4 4 0 0 0 8 0V5" />
    </svg>
  )
}

export function IconStrikethrough() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M5 12h14M8 8c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5M8 16c0 2 1.8 3.5 4 3.5s4-1.5 4-3.5" />
    </svg>
  )
}

export function IconClearFormat() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M8 18l-3-3 7-7 4 4-7 7H8z" />
      <path d="M14 5l5 5" />
    </svg>
  )
}

export function IconBullets() {
  return (
    <svg className={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="currentColor" d="M7 7h2v2H7V7zm0 5h2v2H7v-2zm0 5h2v2H7v-2z" />
      <path stroke="currentColor" strokeWidth={1.65} strokeLinecap="round" d="M12 8h9M12 12h9M12 16h9" />
    </svg>
  )
}

export function IconNumbering() {
  return (
    <svg className={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="currentColor" d="M6 6h1.2v3H6V6zm0 5.5h2V17H5v-1h1.5v-1H6v-1h1v-2H6zm0 6.5h2v1H6v-1z" />
      <path stroke="currentColor" strokeWidth={1.65} strokeLinecap="round" d="M12 8h9M12 12h9M12 16h9" />
    </svg>
  )
}

export function IconIndent() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M4 6h16M4 12h7m5 0h7M4 18h16" />
      <path d="M11 9l3 3-3 3" />
    </svg>
  )
}

export function IconOutdent() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M4 6h16M4 12h7m5 0h7M4 18h16" />
      <path d="M14 9l-3 3 3 3" />
    </svg>
  )
}

export function IconAlignLeft() {
  return (
    <svg className={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="currentColor" d="M5 5h14v2H5V5zm0 4h10v2H5V9zm0 4h14v2H5v-2zm0 4h8v2H5v-2z" />
    </svg>
  )
}

export function IconAlignCenter() {
  return (
    <svg className={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="currentColor" d="M4 5h16v2H4V5zm2 4h12v2H6V9zm-2 4h16v2H4v-2zm4 4h8v2H8v-2z" />
    </svg>
  )
}

export function IconAlignRight() {
  return (
    <svg className={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="currentColor" d="M5 5h14v2H5V5zm4 4h10v2H9V9zm0 4h14v2H9v-2zm6 4h8v2h-8v-2z" />
    </svg>
  )
}

export function IconAlignJustify() {
  return (
    <svg className={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="currentColor" d="M5 5h14v2H5V5zm0 4h14v2H5V9zm0 4h14v2H5v-2zm0 4h14v2H5v-2z" />
    </svg>
  )
}

export function IconLink() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </svg>
  )
}

export function IconPageBreak() {
  return (
    <svg className={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path stroke="currentColor" strokeWidth={1.65} strokeLinecap="round" d="M5 8h14M5 16h14" />
      <path fill="currentColor" d="M11 11h2v2h-2v-2z" />
    </svg>
  )
}

export function IconUndo() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M9 14 5 10l4-4M5 10h8a5 5 0 0 1 5 5" />
    </svg>
  )
}

export function IconRedo() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M15 14l4-4-4-4M19 10h-8a5 5 0 0 0-5 5" />
    </svg>
  )
}

export function IconPrint() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7H5a2 2 0 0 0-2 2v4h18v-4a2 2 0 0 0-2-2h-2M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5M7 17h10v5H7v-5z" />
    </svg>
  )
}

export function IconDownload() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M12 4v12m0 0-3.5-3.5M12 16l3.5-3.5M5 20h14" />
    </svg>
  )
}

/** Double chevron left — collapse side panel (Word-style). */
export function IconSidebarCollapse() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M14 7l-4 5 4 5M19 7l-4 5 4 5" />
    </svg>
  )
}

/** Double chevron right — expand side panel. */
export function IconSidebarExpand() {
  return (
    <svg {...strokeIcon} aria-hidden>
      <path d="M10 7l4 5-4 5M5 7l4 5-4 5" />
    </svg>
  )
}
