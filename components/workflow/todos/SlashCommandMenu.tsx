"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export type SlashMenuOption = {
  id: string
  label: string
  hint?: string
  avatar?: { initials: string; bg: string }
}

type SlashCommandMenuProps = {
  open: boolean
  top: number
  left: number
  title?: string
  options: SlashMenuOption[]
  highlightIndex: number
  onHighlight: (index: number) => void
  onSelect: (id: string) => void
}

export function SlashCommandMenu({
  open,
  top,
  left,
  title,
  options,
  highlightIndex,
  onHighlight,
  onSelect,
}: SlashCommandMenuProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[highlightIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: "nearest" })
  }, [open, highlightIndex])

  if (!open || options.length === 0) return null

  const menu = (
    <div
      className="pointer-events-auto fixed z-[90] w-[min(280px,calc(100vw-1rem))] overflow-hidden rounded-xl border border-[#1a1208]/12 bg-white shadow-[0_12px_40px_rgba(26,18,8,0.2)]"
      style={{ top: Math.max(8, top), left: Math.min(left, typeof window !== "undefined" ? window.innerWidth - 296 : left) }}
      role="listbox"
      aria-label={title ?? "Slash commands"}
    >
      {title ? (
        <p className="border-b border-[#1a1208]/8 px-3 py-2 text-[11px] font-bold text-[#1a1208]/50">
          {title}
        </p>
      ) : null}
      <ul ref={listRef} className="max-h-52 overflow-y-auto py-1">
        {options.map((opt, i) => {
          const active = i === highlightIndex
          return (
            <li key={opt.id} role="option" aria-selected={active}>
              <button
                type="button"
                onMouseEnter={() => onHighlight(i)}
                onClick={() => onSelect(opt.id)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition ${
                  active ? "bg-amber-500/15" : "hover:bg-amber-500/10"
                }`}
              >
                {opt.avatar ? (
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                    style={{ backgroundColor: opt.avatar.bg }}
                  >
                    {opt.avatar.initials}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-[#1a1208]">{opt.label}</span>
                  {opt.hint ? (
                    <span className="block text-[11px] font-medium text-[#1a1208]/50">{opt.hint}</span>
                  ) : null}
                </span>
                {active ? (
                  <span className="shrink-0 text-[10px] font-bold text-amber-800/70">↵</span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="border-t border-[#1a1208]/6 px-3 py-1.5 text-[10px] font-medium text-[#1a1208]/40">
        ↑↓ select · Enter confirm · Esc close
      </p>
    </div>
  )

  if (typeof document === "undefined") return null
  return createPortal(menu, document.body)
}
