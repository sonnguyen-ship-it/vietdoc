"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export function WorkflowNavDropdown() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("touchstart", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("touchstart", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-7 w-6 items-center justify-center rounded border border-white/25 bg-white/10 text-white/90 hover:bg-white/20"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="More apps"
      >
        <span className="text-[10px] leading-none opacity-90" aria-hidden>
          ▾
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] mt-1 min-w-[9.5rem] overflow-hidden rounded-md border border-black/10 bg-white py-1 shadow-lg"
        >
          <Link
            href="/workflow"
            role="menuitem"
            className="block px-3 py-2 text-sm font-semibold text-blue hover:bg-paper2"
            onClick={() => setOpen(false)}
          >
            Workflow
          </Link>
        </div>
      ) : null}
    </div>
  )
}
