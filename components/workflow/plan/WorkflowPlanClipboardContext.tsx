"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { WorkfeedMoodPin } from "@/lib/workflow/workfeed/types"
import {
  buildInitialPlanCellImages,
  isPlanImageSlot,
  MAX_PLAN_CELL_IMAGES,
  MAX_PLAN_CLIPBOARD_IMAGES,
  planCellKey,
  planImageForCell,
  planImageFromPin,
  type PlanCellImage,
  type PlanClipboardImage,
} from "@/lib/workflow/workfeed/planImages"
import {
  hydratePlanCellImages,
  loadPersistedPlanState,
  savePersistedPlanState,
} from "@/lib/workflow/workfeed/planImagesStorage"

type WorkflowPlanClipboardContextValue = {
  cellImages: Record<string, PlanCellImage[]>
  clipboard: PlanClipboardImage[]
  selectedCell: { row: number; col: number } | null
  lightboxImage: PlanCellImage | null
  copyFromMoodboard: (pin: WorkfeedMoodPin) => void
  removeFromClipboard: (imageId: string) => void
  clearClipboard: () => void
  setSelectedCell: (cell: { row: number; col: number } | null) => void
  openLightbox: (image: PlanCellImage) => void
  closeLightbox: () => void
  pasteToCell: (row: number, col: number) => boolean
  addImageToCell: (row: number, col: number, image: PlanCellImage) => boolean
  removeImageFromCell: (row: number, col: number, imageId: string) => void
  canPasteAt: (row: number, col: number) => boolean
}

const WorkflowPlanClipboardContext = createContext<WorkflowPlanClipboardContextValue | null>(
  null
)

export function WorkflowPlanClipboardProvider({ children }: { children: ReactNode }) {
  const [cellImages, setCellImages] = useState(buildInitialPlanCellImages)
  const [clipboard, setClipboard] = useState<PlanClipboardImage[]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [lightboxImage, setLightboxImage] = useState<PlanCellImage | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = loadPersistedPlanState()
    if (stored) {
      setCellImages(hydratePlanCellImages(stored.cellImages))
      setClipboard(stored.clipboard)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    savePersistedPlanState(cellImages, clipboard)
  }, [cellImages, clipboard, hydrated])

  const canPasteAt = useCallback((row: number, col: number) => isPlanImageSlot(row, col), [])

  const addImageToCell = useCallback((row: number, col: number, image: PlanCellImage) => {
    if (!isPlanImageSlot(row, col)) return false
    const key = planCellKey(row, col)
    const nextImage = planImageForCell(image, key, image.source)

    setCellImages((prev) => {
      const existing = prev[key] ?? []
      if (existing.length === 0) {
        return { ...prev, [key]: [nextImage] }
      }
      if (existing.length < MAX_PLAN_CELL_IMAGES) {
        return { ...prev, [key]: [...existing, nextImage] }
      }
      return {
        ...prev,
        [key]: [...existing.slice(0, MAX_PLAN_CELL_IMAGES - 1), nextImage],
      }
    })
    setSelectedCell({ row, col })
    // Remove the source image from the temporary clipboard tray once it has been used.
    setClipboard((prev) => prev.filter((img) => img.id !== image.id))
    return true
  }, [])

  const removeImageFromCell = useCallback((row: number, col: number, imageId: string) => {
    const key = planCellKey(row, col)
    if (!isPlanImageSlot(row, col)) return
    setCellImages((prev) => {
      const filtered = (prev[key] ?? []).filter((img) => img.id !== imageId)
      return { ...prev, [key]: filtered }
    })
  }, [])

  const pasteToCell = useCallback(
    (row: number, col: number) => {
      const latest = clipboard[clipboard.length - 1]
      if (!latest) return false
      return addImageToCell(row, col, latest)
    },
    [clipboard, addImageToCell]
  )

  const copyFromMoodboard = useCallback((pin: WorkfeedMoodPin) => {
    const next = planImageFromPin(pin)
    setClipboard((prev) => {
      const merged = [...prev, next]
      if (merged.length <= MAX_PLAN_CLIPBOARD_IMAGES) return merged
      return merged.slice(-MAX_PLAN_CLIPBOARD_IMAGES)
    })
  }, [])

  const removeFromClipboard = useCallback((imageId: string) => {
    setClipboard((prev) => prev.filter((img) => img.id !== imageId))
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "v") return
      if (!selectedCell || clipboard.length === 0) return
      if (!isPlanImageSlot(selectedCell.row, selectedCell.col)) return
      e.preventDefault()
      pasteToCell(selectedCell.row, selectedCell.col)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selectedCell, clipboard, pasteToCell])

  const value = useMemo(
    () => ({
      cellImages,
      clipboard,
      selectedCell,
      lightboxImage,
      copyFromMoodboard,
      removeFromClipboard,
      clearClipboard: () => setClipboard([]),
      setSelectedCell,
      openLightbox: setLightboxImage,
      closeLightbox: () => setLightboxImage(null),
      pasteToCell,
      addImageToCell,
      removeImageFromCell,
      canPasteAt,
    }),
    [
      cellImages,
      clipboard,
      selectedCell,
      lightboxImage,
      copyFromMoodboard,
      pasteToCell,
      addImageToCell,
      removeImageFromCell,
      removeFromClipboard,
      canPasteAt,
    ]
  )

  return (
    <WorkflowPlanClipboardContext.Provider value={value}>
      {children}
    </WorkflowPlanClipboardContext.Provider>
  )
}

export function usePlanClipboard() {
  const ctx = useContext(WorkflowPlanClipboardContext)
  if (!ctx) {
    throw new Error("usePlanClipboard must be used within WorkflowPlanClipboardProvider")
  }
  return ctx
}

export function usePlanClipboardOptional() {
  return useContext(WorkflowPlanClipboardContext)
}
