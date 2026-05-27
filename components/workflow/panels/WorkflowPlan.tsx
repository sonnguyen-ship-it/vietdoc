"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { PlanImageLightbox } from "@/components/workflow/plan/PlanImageLightbox"
import { PlanImageVisual } from "@/components/workflow/plan/PlanImageVisual"
import { WorkflowPlanClipboardTray } from "@/components/workflow/plan/WorkflowPlanClipboardTray"
import { usePlanClipboardOptional } from "@/components/workflow/plan/WorkflowPlanClipboardContext"
import {
  isPlanImageSlot,
  parsePlanImageDrag,
  PLAN_IMAGE_DRAG_TYPE,
  planCellKey,
  type PlanCellImage,
} from "@/lib/workflow/workfeed/planImages"
import { PLAN_HIGHLIGHT_COLUMN, WORKFEED_PLAN_SHEETS } from "@/lib/workflow/workfeed/planData"
import {
  isPlanRoasColumn,
  isPlanStatusColumn,
  planStatusPillClass,
} from "@/lib/workflow/workfeed/planStatusStyles"

const COL_W = 92
const ROW_W_FULL = 112
const ROW_W_MIN = 48

const TH_BASE =
  "sticky top-0 z-[6] border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.82)] px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.7px] text-[rgba(26,18,8,0.28)] backdrop-blur-[12px]"
const TD_BASE =
  "border-b border-[rgba(0,0,0,0.05)] px-3 py-2 text-left text-xs text-[rgba(26,18,8,0.50)] align-middle transition-colors"
const W3_HEAD =
  "border-l-2 border-r-2 border-l-[rgba(255,140,0,0.5)] border-r-[rgba(255,140,0,0.5)] bg-[rgba(255,165,0,0.14)] text-[#7c3d00] backdrop-blur-[12px]"
const W3_CELL =
  "border-l-2 border-r-2 border-l-[rgba(255,140,0,0.30)] border-r-[rgba(255,140,0,0.30)] bg-[rgba(255,165,0,0.07)]"
const W3_CELL_TOTAL = "bg-[rgba(255,165,0,0.12)]"

const STATUS_FALLBACK =
  "inline-block rounded-[20px] border border-[rgba(0,0,0,0.10)] bg-[rgba(0,0,0,0.07)] px-2 py-0.5 text-center text-[10px] font-semibold leading-tight text-[rgba(26,18,8,0.50)]"

type WorkflowPlanProps = {
  desktop?: boolean
  focusCell?: { row: number; col: number } | null
}

function StatusPill({ label }: { label: string }) {
  const trimmed = label.trim()
  if (!trimmed || trimmed === "—") {
    return <span className="text-[rgba(26,18,8,0.28)]">—</span>
  }
  const pillClass = planStatusPillClass(trimmed)
  return <span className={pillClass ?? STATUS_FALLBACK}>{trimmed}</span>
}

function PlanImageThumb({
  image,
  onView,
  onRemove,
}: {
  image: PlanCellImage
  onView: () => void
  onRemove: () => void
}) {
  const label = image.brand ?? image.title

  return (
    <div className="relative min-h-0 min-w-0 h-full w-full">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onView()
        }}
        className="relative block h-full w-full overflow-hidden rounded-[5px]"
        title={image.title}
      >
        <PlanImageVisual
          gradient={image.gradient}
          imageUrl={image.imageUrl}
          alt={image.title}
          className="h-full w-full"
          sizes="96px"
        />
        <span
          className="pointer-events-none absolute bottom-0 left-0 max-w-full truncate px-1 py-0.5 text-[9px] font-semibold text-[rgba(255,255,255,0.9)]"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
        >
          {label}
        </span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute right-[3px] top-[3px] z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(0,0,0,0.55)] text-[8px] font-bold leading-none text-white"
        aria-label="Remove image"
      >
        ×
      </button>
    </div>
  )
}

function PlanCellImageStack({
  images,
  onView,
  onRemove,
}: {
  images: PlanCellImage[]
  onView: (image: PlanCellImage) => void
  onRemove: (imageId: string) => void
}) {
  const shown = images.slice(0, 4)
  const count = shown.length

  const gridClass =
    count === 1
      ? "grid h-[32px] w-full grid-cols-1 gap-[3px]"
      : count === 2
        ? "grid h-[32px] w-full grid-cols-2 gap-[3px]"
        : "grid h-[34px] w-full grid-cols-2 grid-rows-2 gap-[3px]"

  return (
    <div className={gridClass}>
      {shown.map((img) => (
        <PlanImageThumb
          key={img.id}
          image={img}
          onView={() => onView(img)}
          onRemove={() => onRemove(img.id)}
        />
      ))}
    </div>
  )
}

function PlanAmbientBlobs() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-[280px] w-[280px] rounded-full blur-[55px]"
        style={{ background: "#b388ff", opacity: 0.15 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 h-[200px] w-[200px] rounded-full blur-[55px]"
        style={{ background: "#c8ff00", opacity: 0.15 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 h-[160px] w-[160px] rounded-full blur-[55px]"
        style={{ background: "#ff6b6b", opacity: 0.14 }}
        aria-hidden
      />
    </>
  )
}

export function WorkflowPlan({ desktop, focusCell }: WorkflowPlanProps = {}) {
  const sheet = WORKFEED_PLAN_SHEETS[0]
  const highlightCol = sheet.columns.indexOf(PLAN_HIGHLIGHT_COLUMN)
  const budgetCol = sheet.columns.indexOf("Budget (VNĐ)")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolledX, setScrolledX] = useState(false)
  const lastScrollLeftRef = useRef(0)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const rowHeaderW = scrolledX ? ROW_W_MIN : ROW_W_FULL

  const planCtx = usePlanClipboardOptional()
  const cellImages = planCtx?.cellImages ?? {}
  const selectedCell = planCtx?.selectedCell ?? null
  const lightboxImage = planCtx?.lightboxImage ?? null

  useEffect(() => {
    if (!focusCell) return
    const el = scrollRef.current?.querySelector(
      `[data-plan-cell="${focusCell.row}-${focusCell.col}"]`
    )
    el?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
  }, [focusCell])

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const x = el.scrollLeft
    lastScrollLeftRef.current = x
    setScrolledX((prev) => (prev ? x > 2 : x > 24))
  }, [])

  const handleCellClick = (row: number, col: number) => {
    if (!planCtx) return
    if (isPlanImageSlot(row, col)) {
      planCtx.setSelectedCell({ row, col })
    } else {
      planCtx.setSelectedCell(null)
    }
  }

  const onCellDragOver = (e: React.DragEvent, row: number, col: number) => {
    if (!isPlanImageSlot(row, col)) return
    if (!e.dataTransfer.types.includes(PLAN_IMAGE_DRAG_TYPE)) return
    e.preventDefault()
    setDropTarget(planCellKey(row, col))
  }

  const onCellDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()
    setDropTarget(null)
    if (!planCtx) return
    const raw = e.dataTransfer.getData(PLAN_IMAGE_DRAG_TYPE)
    const payload = parsePlanImageDrag(raw)
    if (payload) {
      planCtx.addImageToCell(row, col, payload)
      return
    }
    planCtx.pasteToCell(row, col)
  }

  const w3Classes = (ci: number, isHeader: boolean, isTotal: boolean) => {
    if (ci !== highlightCol) return ""
    if (isHeader) return W3_HEAD
    return isTotal ? `${W3_CELL} ${W3_CELL_TOTAL}` : W3_CELL
  }

  const stickyOwner = (isHeader: boolean) =>
    isHeader
      ? "sticky left-0 z-[7] shadow-[2px_0_8px_rgba(0,0,0,0.04)]"
      : "sticky left-0 z-[4] bg-white/90 shadow-[2px_0_6px_rgba(0,0,0,0.03)] backdrop-blur-[8px] group-hover:bg-[rgba(255,255,255,0.55)]"

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col text-[color:var(--wf-ink)] ${
        desktop ? "wf-plan-page" : "bg-[#f8fafc] pt-[max(3rem,env(safe-area-inset-top))]"
      }`}
    >
      {desktop ? <PlanAmbientBlobs /> : null}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
      >
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead>
            <tr>
              {sheet.columns.map((col, ci) => {
                const isW3 = ci === highlightCol
                return (
                  <th
                    key={col}
                    scope="col"
                    title={col}
                    className={`${TH_BASE} ${w3Classes(ci, true, false)} ${ci === 0 ? stickyOwner(true) : ""}`}
                    style={{
                      left: ci === 0 ? 0 : undefined,
                      minWidth: ci === 0 ? rowHeaderW : COL_W,
                      width: ci === 0 ? rowHeaderW : COL_W,
                    }}
                  >
                    {isW3 ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span>Week 3</span>
                        <span className="rounded-[10px] bg-[rgba(255,140,0,0.25)] px-1.5 py-px text-[9px] font-bold normal-case tracking-normal text-[#7c3d00]">
                          current
                        </span>
                      </span>
                    ) : (
                      <span className={ci === 0 && scrolledX ? "sr-only" : ""}>{col}</span>
                    )}
                    {ci === 0 && scrolledX ? (
                      <span className="text-[9px] font-bold uppercase tracking-[0.7px] text-[rgba(26,18,8,0.28)]">
                        Owner
                      </span>
                    ) : null}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, ri) => (
              <tr key={ri} className="group">
                {row.map((cell, ci) => {
                  const isOwnerCol = ci === 0
                  const isTotal = row[0] === "TOTAL"
                  const isPaid = isOwnerCol && !isTotal && cell.startsWith("Paid")
                  const key = planCellKey(ri, ci)
                  const isImage = isPlanImageSlot(ri, ci)
                  const images = cellImages[key] ?? []
                  const isSelected =
                    selectedCell?.row === ri && selectedCell?.col === ci
                  const isDrop = dropTarget === key
                  const isFocused = focusCell?.row === ri && focusCell?.col === ci
                  const isStatus = isPlanStatusColumn(sheet.columns[ci])
                  const isRoas = isPlanRoasColumn(sheet.columns[ci])
                  const isBudget = ci === budgetCol

                  return (
                    <td
                      key={`${ri}-${ci}`}
                      data-plan-cell={`${ri}-${ci}`}
                      title={
                        isImage
                          ? images.map((img) => img.title).join(" · ") || "Image cell"
                          : cell
                      }
                      onClick={() => handleCellClick(ri, ci)}
                      onDragOver={(e) => onCellDragOver(e, ri, ci)}
                      onDragLeave={() => setDropTarget(null)}
                      onDrop={(e) => onCellDrop(e, ri, ci)}
                      className={`${TD_BASE} ${w3Classes(ci, false, isTotal)} ${
                        isOwnerCol ? stickyOwner(false) : ""
                      } ${isTotal ? "bg-[rgba(200,255,0,0.08)] font-bold text-[#1a1208]" : "group-hover:bg-[rgba(255,255,255,0.35)]"} ${
                        isFocused ? "ring-2 ring-amber-500 ring-inset" : ""
                      } ${isSelected ? "ring-2 ring-[#b388ff] ring-inset" : ""} ${
                        isDrop ? "bg-[rgba(179,136,255,0.12)] ring-2 ring-[#b388ff] ring-inset" : ""
                      } ${isImage ? "" : "whitespace-nowrap"}`}
                      style={{
                        left: isOwnerCol ? 0 : undefined,
                        minWidth: isOwnerCol ? rowHeaderW : COL_W,
                        width: isOwnerCol ? rowHeaderW : COL_W,
                      }}
                    >
                      {isImage ? (
                        images.length > 0 ? (
                          <PlanCellImageStack
                            images={images}
                            onView={(img) => planCtx?.openLightbox(img)}
                            onRemove={(imageId) =>
                              planCtx?.removeImageFromCell(ri, ci, imageId)
                            }
                          />
                        ) : (
                          <span className="flex h-[32px] items-center justify-center text-[9px] font-semibold text-[rgba(26,18,8,0.28)]">
                            Drop / ⌘V
                          </span>
                        )
                      ) : isStatus ? (
                        <StatusPill label={cell} />
                      ) : isRoas ? (
                        <span
                          className={`text-xs font-bold ${
                            isTotal && cell !== "—"
                              ? "text-[#14532d]"
                              : "text-[#1a1208]"
                          }`}
                        >
                          {cell}
                        </span>
                      ) : (
                        <span
                          className={`block truncate ${
                            isOwnerCol
                              ? `text-[11px] font-semibold ${
                                  isPaid ? "text-[#7c3d00]" : "text-[#1a1208]"
                                }`
                              : ""
                          } ${isBudget && isTotal ? "text-[13px]" : ""} ${
                            isOwnerCol && scrolledX ? "text-[10px]" : ""
                          }`}
                        >
                          {isOwnerCol && scrolledX
                            ? cell.replace("@", "").slice(0, 6)
                            : cell}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {desktop ? <WorkflowPlanClipboardTray variant="desktop" planDock /> : null}

      {lightboxImage ? (
        <PlanImageLightbox image={lightboxImage} onClose={() => planCtx?.closeLightbox()} />
      ) : null}
    </div>
  )
}
