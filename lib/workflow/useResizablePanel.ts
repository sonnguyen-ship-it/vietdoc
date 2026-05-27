"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Options = {
  initialWidth: number
  minWidth: number
  maxWidth: number
  /** Drag handle on the left edge of a right-side panel */
  side?: "right"
}

export function useResizablePanel({
  initialWidth,
  minWidth,
  maxWidth,
}: Options) {
  const [width, setWidth] = useState(initialWidth)
  const dragging = useRef(false)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      dragging.current = true
      const startX = e.clientX
      const startW = width

      const onMove = (ev: PointerEvent) => {
        if (!dragging.current) return
        const delta = startX - ev.clientX
        const next = Math.min(maxWidth, Math.max(minWidth, startW + delta))
        setWidth(next)
      }

      const onUp = () => {
        dragging.current = false
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }

      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [width, minWidth, maxWidth]
  )

  useEffect(() => {
    const clamp = () => {
      const cap = Math.min(maxWidth, Math.max(minWidth, window.innerWidth * 0.5))
      setWidth((w) => Math.min(cap, Math.max(minWidth, w)))
    }
    clamp()
    window.addEventListener("resize", clamp)
    return () => window.removeEventListener("resize", clamp)
  }, [minWidth, maxWidth])

  return { width, setWidth, onResizePointerDown: onPointerDown }
}
