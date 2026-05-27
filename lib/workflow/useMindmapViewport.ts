"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type MindmapViewport = {
  panX: number
  panY: number
  zoom: number
}

const ZOOM_MIN = 0.25
const ZOOM_MAX = 2.5

function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z))
}

type Options = {
  worldW: number
  worldH: number
  resetKey?: number | string
}

export function useMindmapViewport({ worldW, worldH, resetKey }: Options) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<MindmapViewport>({ panX: 0, panY: 0, zoom: 1 })
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [panning, setPanning] = useState(false)
  const panDrag = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null)

  const centerOnWorld = useCallback(
    (zoom = 1) => {
      const el = viewportRef.current
      if (!el) return
      const z = clampZoom(zoom)
      setView({
        panX: el.clientWidth / 2 - (worldW / 2) * z,
        panY: el.clientHeight / 2 - (worldH / 2) * z,
        zoom: z,
      })
    },
    [worldW, worldH]
  )

  useEffect(() => {
    centerOnWorld(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-center when graph changes
  }, [resetKey, centerOnWorld])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      e.preventDefault()
      setSpaceHeld(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return
      setSpaceHeld(false)
      panDrag.current = null
      setPanning(false)
    }
    const onBlur = () => {
      setSpaceHeld(false)
      panDrag.current = null
      setPanning(false)
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onBlur)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onBlur)
    }
  }, [])

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    const el = viewportRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = clientX - rect.left
    const my = clientY - rect.top

    setView((prev) => {
      const nextZoom = clampZoom(prev.zoom * factor)
      const wx = (mx - prev.panX) / prev.zoom
      const wy = (my - prev.panY) / prev.zoom
      return {
        panX: mx - wx * nextZoom,
        panY: my - wy * nextZoom,
        zoom: nextZoom,
      }
    })
  }, [])

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const factor = Math.exp(-e.deltaY * 0.008)
        zoomAt(e.clientX, e.clientY, factor)
        return
      }
      setView((prev) => ({
        ...prev,
        panX: prev.panX - e.deltaX,
        panY: prev.panY - e.deltaY,
      }))
    },
    [zoomAt]
  )

  const startPan = useCallback((clientX: number, clientY: number) => {
    setView((prev) => {
      panDrag.current = {
        startX: clientX,
        startY: clientY,
        panX: prev.panX,
        panY: prev.panY,
      }
      return prev
    })
    setPanning(true)
  }, [])

  const endPan = useCallback(() => {
    panDrag.current = null
    setPanning(false)
  }, [])

  const onViewportPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const isMiddle = e.button === 1
      const isSpacePan = e.button === 0 && spaceHeld

      if (!isMiddle && !isSpacePan) return

      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      startPan(e.clientX, e.clientY)
    },
    [spaceHeld, startPan]
  )

  const onBackdropPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 || spaceHeld) return
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      startPan(e.clientX, e.clientY)
    },
    [spaceHeld, startPan]
  )

  const onViewportPointerMove = useCallback((e: React.PointerEvent) => {
    const drag = panDrag.current
    if (!drag) return
    setView((prev) => ({
      ...prev,
      panX: drag.panX + (e.clientX - drag.startX),
      panY: drag.panY + (e.clientY - drag.startY),
    }))
  }, [])

  const onViewportPointerUp = useCallback(
    (e: React.PointerEvent) => {
      endPan()
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* already released */
      }
    },
    [endPan]
  )

  const zoomBy = useCallback(
    (delta: number) => {
      const el = viewportRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1 + delta)
    },
    [zoomAt]
  )

  const panMode = spaceHeld || panning

  return {
    viewportRef,
    view,
    spaceHeld,
    panMode,
    centerOnWorld,
    zoomBy,
    onWheel,
    onViewportPointerDown,
    onBackdropPointerDown,
    onViewportPointerMove,
    onViewportPointerUp,
  }
}
