"use client"

import {
  PLAN_IMAGE_DRAG_TYPE,
  type PlanClipboardImage,
} from "@/lib/workflow/workfeed/planImages"
import { PlanImageVisual } from "@/components/workflow/plan/PlanImageVisual"
import { usePlanClipboardOptional } from "@/components/workflow/plan/WorkflowPlanClipboardContext"

function TrayThumb({
  image,
  onRemove,
}: {
  image: PlanClipboardImage
  onRemove: () => void
}) {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(PLAN_IMAGE_DRAG_TYPE, JSON.stringify(image))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group relative h-[38px] w-[38px] shrink-0 cursor-grab overflow-hidden rounded-[9px] border-[1.5px] border-[rgba(255,255,255,0.80)] shadow-[0_2px_8px_rgba(0,0,0,0.20)] active:cursor-grabbing"
      title={`Drag to Plan · ${image.title}`}
    >
      <PlanImageVisual
        gradient={image.gradient}
        imageUrl={image.imageUrl}
        alt={image.title}
        className="h-full w-full"
        sizes="96px"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[rgba(0,0,0,0.55)] text-[8px] font-bold leading-none text-white"
        aria-label="Remove from stash"
      >
        ×
      </button>
    </div>
  )
}

type WorkflowPlanClipboardTrayProps = {
  variant?: "desktop" | "mobile"
  floating?: boolean
  /** Plan tab — bottom-right inside content */
  planDock?: boolean
}

export function WorkflowPlanClipboardTray({
  variant = "desktop",
  floating = false,
  planDock = false,
}: WorkflowPlanClipboardTrayProps) {
  const ctx = usePlanClipboardOptional()
  if (!ctx || ctx.clipboard.length === 0) return null

  const { clipboard, removeFromClipboard, clearClipboard } = ctx
  const count = clipboard.length

  const thumbs = clipboard.map((image) => (
    <TrayThumb key={image.id} image={image} onRemove={() => removeFromClipboard(image.id)} />
  ))

  if (variant === "mobile") {
    return (
      <div className="pointer-events-auto flex max-w-[min(100vw-2rem,280px)] items-center gap-2 rounded-full bg-[#1a1208]/90 px-3 py-1.5 shadow-lg">
        <span className="shrink-0 text-[9px] font-bold text-white/60">Plan · {count}</span>
        <div className="flex gap-1.5 overflow-x-auto">{thumbs}</div>
      </div>
    )
  }

  if (planDock || floating) {
    return (
      <div
        className={`pointer-events-auto z-20 flex items-center gap-2 ${
          planDock ? "absolute bottom-4 right-4" : "flex-col items-end gap-1.5"
        }`}
      >
        {floating && !planDock && count > 1 ? (
          <button
            type="button"
            onClick={clearClipboard}
            className="rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-[#1a1208]/70 shadow ring-1 ring-black/10 hover:text-red"
          >
            Clear
          </button>
        ) : null}
        <span className="flex shrink-0 items-center gap-1.5 rounded-[20px] bg-[#1a1208] px-3 py-1.5 text-[11px] font-semibold text-[rgba(255,255,255,0.9)]">
          <span className="text-[13px] leading-none opacity-90" aria-hidden>
            📋
          </span>
          {count} {count === 1 ? "photo" : "photos"}
        </span>
        <div className="flex flex-row items-center gap-2">{thumbs}</div>
      </div>
    )
  }

  return <div className="pointer-events-auto flex flex-wrap items-center gap-2">{thumbs}</div>
}
