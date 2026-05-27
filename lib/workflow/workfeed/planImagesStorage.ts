import {
  buildInitialPlanCellImages,
  PLAN_IMAGE_SLOTS,
  type PlanCellImage,
  type PlanClipboardImage,
} from "@/lib/workflow/workfeed/planImages"
import { getWorkflowDeviceId } from "@/lib/workflow/workfeed/todosSupabase"

const STORAGE_VERSION = 1

export type PersistedPlanState = {
  version: number
  cellImages: Record<string, PlanCellImage[]>
  clipboard: PlanClipboardImage[]
}

function storageKey(deviceId: string): string {
  return `vietdoc.workflow.plan_state.${deviceId}`
}

function isPlanImage(value: unknown): value is PlanCellImage {
  if (!value || typeof value !== "object") return false
  const v = value as PlanCellImage
  return (
    typeof v.id === "string" &&
    typeof v.gradient === "string" &&
    typeof v.title === "string" &&
    (v.source === "placeholder" || v.source === "moodboard") &&
    (v.imageUrl === undefined || typeof v.imageUrl === "string") &&
    (v.brand === undefined || typeof v.brand === "string") &&
    (v.pinId === undefined || typeof v.pinId === "string")
  )
}

function sanitizeCellImages(raw: unknown): Record<string, PlanCellImage[]> {
  if (!raw || typeof raw !== "object") return {}
  const out: Record<string, PlanCellImage[]> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue
    const images = value.filter(isPlanImage)
    if (images.length > 0 || key in PLAN_IMAGE_SLOTS) out[key] = images
  }
  return out
}

function sanitizeClipboard(raw: unknown): PlanClipboardImage[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(isPlanImage)
}

export function loadPersistedPlanState(): PersistedPlanState | null {
  if (typeof window === "undefined") return null
  try {
    const deviceId = getWorkflowDeviceId()
    const raw = window.localStorage.getItem(storageKey(deviceId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedPlanState
    if (!parsed || typeof parsed !== "object") return null
    return {
      version: STORAGE_VERSION,
      cellImages: sanitizeCellImages(parsed.cellImages),
      clipboard: sanitizeClipboard(parsed.clipboard),
    }
  } catch {
    return null
  }
}

/** Apply saved cells over demo placeholders; explicit empty arrays keep cells cleared. */
export function hydratePlanCellImages(
  saved: Record<string, PlanCellImage[]>
): Record<string, PlanCellImage[]> {
  const initial = buildInitialPlanCellImages()
  const out = { ...initial }
  for (const [key, images] of Object.entries(saved)) {
    out[key] = images
  }
  return out
}

export function savePersistedPlanState(
  cellImages: Record<string, PlanCellImage[]>,
  clipboard: PlanClipboardImage[]
): void {
  if (typeof window === "undefined") return
  try {
    const deviceId = getWorkflowDeviceId()
    const payload: PersistedPlanState = {
      version: STORAGE_VERSION,
      cellImages,
      clipboard,
    }
    window.localStorage.setItem(storageKey(deviceId), JSON.stringify(payload))
  } catch {
    // Quota or private mode — ignore
  }
}

export function clearPersistedPlanState(): void {
  if (typeof window === "undefined") return
  const deviceId = getWorkflowDeviceId()
  window.localStorage.removeItem(storageKey(deviceId))
}
