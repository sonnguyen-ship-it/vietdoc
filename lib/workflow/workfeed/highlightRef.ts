import type {
  WorkfeedHighlightDragPayload,
  WorkfeedHighlightRef,
} from "@/lib/workflow/workfeed/types"

export type {
  WorkfeedHighlightDragPayload,
  WorkfeedHighlightRef,
  WorkfeedHighlightStyle,
  WorkfeedMainTab,
} from "@/lib/workflow/workfeed/types"

type Point = { x: number; y: number }

export function highlightRectPathD(a: Point, b: Point): string {
  const x0 = Math.min(a.x, b.x)
  const y0 = Math.min(a.y, b.y)
  const x1 = Math.max(a.x, b.x)
  const y1 = Math.max(a.y, b.y)
  return `M ${x0} ${y0} H ${x1} V ${y1} H ${x0} Z`
}

export const HIGHLIGHT_RECT_FILL = "rgba(251, 146, 60, 0.32)"
export const HIGHLIGHT_RECT_STROKE = "#f97316"

export const WORKFLOW_HIGHLIGHT_DRAG_TYPE = "application/vnd.vietdoc.workflow-highlight+json"

export function buildHighlightRef(
  partial: Omit<WorkfeedHighlightRef, "id"> & { id?: string }
): WorkfeedHighlightRef {
  return {
    id: partial.id ?? `hl-ref-${Date.now()}`,
    ...partial,
  }
}

export function parseHighlightDrag(data: string): WorkfeedHighlightDragPayload | null {
  try {
    return JSON.parse(data) as WorkfeedHighlightDragPayload
  } catch {
    return null
  }
}
