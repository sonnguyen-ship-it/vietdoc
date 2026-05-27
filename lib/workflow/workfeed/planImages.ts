import type { WorkfeedMoodPin } from "@/lib/workflow/workfeed/types"

export const PLAN_IMAGE_DRAG_TYPE = "application/vnd.vietdoc.plan-image+json"

/** Max images in one Plan cell (halves when 2, 2×2 grid when 3–4). */
export const MAX_PLAN_CELL_IMAGES = 4

/** Max images held in the corner Plan clipboard tray. */
export const MAX_PLAN_CLIPBOARD_IMAGES = 12

export type PlanCellImage = {
  id: string
  gradient: string
  /** Real photo from Moodboard (`/moodboard/...`) when copied from Board. */
  imageUrl?: string
  title: string
  brand?: string
  pinId?: string
  source: "placeholder" | "moodboard"
}

export type PlanClipboardImage = PlanCellImage

export function planCellKey(row: number, col: number): string {
  return `${row}-${col}`
}

/** Cells that accept images (paste, drop). Key = row-col */
export const PLAN_IMAGE_SLOTS: Record<
  string,
  { gradient: string; title: string; brand?: string }
> = {
  "0-1": {
    gradient: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)",
    title: "Week 1 · hero",
  },
  "0-3": {
    gradient: "linear-gradient(135deg, #fdba74 0%, #f97316 100%)",
    title: "Week 3 · live",
  },
  "1-3": {
    gradient: "linear-gradient(135deg, #67e8f9 0%, #0ea5e9 100%)",
    title: "Film still",
  },
  "2-2": {
    gradient: "linear-gradient(135deg, #86efac 0%, #16a34a 100%)",
    title: "Contract mood",
  },
  "6-7": {
    gradient: "linear-gradient(135deg, #1a1208 0%, #44403c 100%)",
    title: "TikTok ad frame",
    brand: "Paid",
  },
}

export function isPlanImageSlot(row: number, col: number): boolean {
  return planCellKey(row, col) in PLAN_IMAGE_SLOTS
}

export function buildInitialPlanCellImages(): Record<string, PlanCellImage[]> {
  const out: Record<string, PlanCellImage[]> = {}
  for (const [key, slot] of Object.entries(PLAN_IMAGE_SLOTS)) {
    out[key] = [
      {
        id: `ph-${key}`,
        gradient: slot.gradient,
        title: slot.title,
        brand: slot.brand,
        source: "placeholder",
      },
    ]
  }
  return out
}

export function planImageForCell(
  image: PlanCellImage,
  cellKey: string,
  source: PlanCellImage["source"] = "moodboard"
): PlanCellImage {
  return {
    ...image,
    id: `cell-${cellKey}-${Date.now()}`,
    source,
  }
}

export function planImageFromPin(pin: WorkfeedMoodPin): PlanClipboardImage {
  return {
    id: `clip-${pin.id}-${Date.now()}`,
    gradient: pin.gradient,
    imageUrl: pin.imageUrl,
    title: pin.title,
    brand: pin.brand,
    pinId: pin.id,
    source: "moodboard",
  }
}

export function parsePlanImageDrag(data: string): PlanClipboardImage | null {
  try {
    return JSON.parse(data) as PlanClipboardImage
  } catch {
    return null
  }
}
