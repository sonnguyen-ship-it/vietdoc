import { useEffect, type RefObject } from "react"

/**
 * Mobile-friendly horizontal carousel: locks axis on first move,
 * preventDefault on horizontal drags so the vertical feed does not steal the gesture.
 */
export function useHorizontalCarouselTouch(
  ref: RefObject<HTMLDivElement | null>,
  slideCount: number
) {
  useEffect(() => {
    const el = ref.current
    if (!el || slideCount < 2) return

    let startX = 0
    let startY = 0
    let lastX = 0
    let axis: "h" | "v" | null = null

    const reset = () => {
      axis = null
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      lastX = startX
      axis = null
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      const dx = x - startX
      const dy = y - startY

      if (!axis) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
        axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v"
      }

      if (axis === "v") return

      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return

      e.preventDefault()
      e.stopPropagation()

      const delta = lastX - x
      lastX = x
      el.scrollLeft = Math.min(max, Math.max(0, el.scrollLeft + delta))
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", reset, { passive: true })
    el.addEventListener("touchcancel", reset, { passive: true })

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", reset)
      el.removeEventListener("touchcancel", reset)
    }
  }, [ref, slideCount])
}
