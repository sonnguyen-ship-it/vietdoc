"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { WORKFEED_DM_RECIPIENTS } from "@/lib/workflow/workfeed/dmData"
import {
  buildHighlightRef,
  highlightRectPathD,
  HIGHLIGHT_RECT_FILL,
  HIGHLIGHT_RECT_STROKE,
  type WorkfeedHighlightDragPayload,
} from "@/lib/workflow/workfeed/highlightRef"
import { WORKFLOW_FAB_CLEARANCE, WORKFLOW_TAB_BAR_OFFSET } from "@/lib/workflow/workfeed/layout"
import type { WorkfeedDmRecipient, WorkfeedHighlightStyle } from "@/lib/workflow/workfeed/types"
import type { WorkfeedHighlightRef as HighlightRefType } from "@/lib/workflow/workfeed/highlightRef"

type Point = { x: number; y: number }

const MIN_RECT_PX = 8
const MIN_STROKE_POINTS = 4

type WorkflowHighlightFlowProps = {
  mode?: "mobile" | "desktop"
  onClose: () => void
  getContext?: () => Omit<HighlightRefType, "id" | "pathD" | "snapshotDataUrl" | "label" | "highlightStyle">
  onSend?: (payload: {
    recipient: WorkfeedDmRecipient
    text: string
    highlightPath: string
    highlightRef?: HighlightRefType
    snapshotDataUrl?: string
  }) => void
  onReady?: (payload: WorkfeedHighlightDragPayload) => void
}

function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { ctx, w, h }
}

export function WorkflowHighlightFlow({
  mode = "mobile",
  onClose,
  getContext,
  onSend,
  onReady,
}: WorkflowHighlightFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rectStartRef = useRef<Point | null>(null)
  const [frozenRect, setFrozenRect] = useState<{ a: Point; b: Point } | null>(null)
  const [points, setPoints] = useState<Point[]>([])
  const [drawing, setDrawing] = useState(false)
  const [pathD, setPathD] = useState("")
  const [highlightStyle, setHighlightStyle] = useState<WorkfeedHighlightStyle>("stroke")
  const [phase, setPhase] = useState<"draw" | "compose" | "recipients">("draw")
  const [message, setMessage] = useState("")
  const [desktopRecipientId, setDesktopRecipientId] = useState<string>("")
  const isDesktop = mode === "desktop"
  const bottomPad = isDesktop ? "1.5rem" : WORKFLOW_FAB_CLEARANCE

  const snapshot = useCallback((): string | undefined => {
    const canvas = canvasRef.current
    if (!canvas || canvas.width === 0) return undefined
    try {
      return canvas.toDataURL("image/png")
    } catch {
      return undefined
    }
  }, [])

  const redrawStroke = useCallback((pts: Point[]) => {
    const canvas = canvasRef.current
    if (!canvas || pts.length < 2) return
    const setup = setupCanvas(canvas)
    if (!setup) return
    const { ctx, w, h } = setup
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = HIGHLIGHT_RECT_STROKE
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y)
    }
    ctx.stroke()
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    setPathD(d)
    setHighlightStyle("stroke")
  }, [])

  const redrawRect = useCallback((a: Point, b: Point, finalize = false) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const setup = setupCanvas(canvas)
    if (!setup) return
    const { ctx, w, h } = setup
    const x0 = Math.min(a.x, b.x)
    const y0 = Math.min(a.y, b.y)
    const x1 = Math.max(a.x, b.x)
    const y1 = Math.max(a.y, b.y)
    const rw = x1 - x0
    const rh = y1 - y0
    ctx.clearRect(0, 0, w, h)
    if (rw >= 1 && rh >= 1) {
      ctx.fillStyle = HIGHLIGHT_RECT_FILL
      ctx.fillRect(x0, y0, rw, rh)
      ctx.strokeStyle = HIGHLIGHT_RECT_STROKE
      ctx.lineWidth = 2
      ctx.strokeRect(x0, y0, rw, rh)
    }
    const d = highlightRectPathD(a, b)
    if (finalize) {
      setPathD(d)
      setHighlightStyle("rect")
    }
  }, [])

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrawing(true)
    const p = getPoint(e)
    if (isDesktop) {
      rectStartRef.current = p
      redrawRect(p, p)
      return
    }
    const next = [p]
    setPoints(next)
    redrawStroke(next)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const p = getPoint(e)
    if (isDesktop) {
      const start = rectStartRef.current
      if (!start) return
      redrawRect(start, p)
      return
    }
    setPoints((prev) => {
      const next = [...prev, p]
      redrawStroke(next)
      return next
    })
  }

  const completeRect = useCallback(
    (start: Point, end: Point) => {
      if (
        Math.abs(end.x - start.x) < MIN_RECT_PX ||
        Math.abs(end.y - start.y) < MIN_RECT_PX
      ) {
        const canvas = canvasRef.current
        const setup = canvas ? setupCanvas(canvas) : null
        if (setup) setup.ctx.clearRect(0, 0, setup.w, setup.h)
        return
      }
      redrawRect(start, end, true)
      setFrozenRect({ a: start, b: end })
      setPhase("compose")
    },
    [redrawRect]
  )

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    setDrawing(false)
    if (isDesktop) {
      const start = rectStartRef.current
      if (!start) return
      completeRect(start, getPoint(e))
      rectStartRef.current = null
    }
  }

  useEffect(() => {
    if (phase !== "compose") return
    if (highlightStyle === "rect" && frozenRect) {
      redrawRect(frozenRect.a, frozenRect.b, true)
      return
    }
    if (highlightStyle === "stroke" && points.length >= 2) {
      redrawStroke(points)
    }
  }, [phase, points, highlightStyle, frozenRect, redrawStroke, redrawRect])

  const finishDraw = () => {
    if (points.length < MIN_STROKE_POINTS) return
    setPhase("compose")
  }

  const buildPayload = useCallback((): WorkfeedHighlightDragPayload | null => {
    if (!message.trim() || !pathD) return null
    const ctx = getContext?.()
    const ref = buildHighlightRef({
      ...ctx,
      mainTab: ctx?.mainTab ?? "feed",
      pathD,
      highlightStyle,
      label: message.trim(),
      snapshotDataUrl: snapshot(),
    })
    return { text: message.trim(), ref }
  }, [getContext, message, pathD, highlightStyle, snapshot])

  const openRecipients = () => {
    if (!message.trim()) return
    if (isDesktop) {
      const payload = buildPayload()
      if (!payload) return

      const recipient = WORKFEED_DM_RECIPIENTS.find((r) => r.id === desktopRecipientId)
      if (recipient && onSend) {
        onSend({
          recipient,
          text: payload.text,
          highlightPath: payload.ref.pathD,
          highlightRef: payload.ref,
          snapshotDataUrl: payload.ref.snapshotDataUrl,
        })
        onClose()
        return
      }

      // Fallback: no recipient picked yet → keep old drag-to-chat behavior.
      onReady?.(payload)
      onClose()
      return
    }
    setPhase("recipients")
  }

  const sendTo = (recipient: WorkfeedDmRecipient) => {
    const payload = buildPayload()
    onSend?.({
      recipient,
      text: message.trim(),
      highlightPath: pathD,
      highlightRef: payload?.ref,
      snapshotDataUrl: payload?.ref.snapshotDataUrl,
    })
  }

  const cancelHighlight = () => {
    onClose()
  }

  return (
    <div className="absolute inset-0 z-[55] flex flex-col overflow-hidden bg-black/20">
      <div
        className={`flex shrink-0 items-center justify-between px-3 py-2.5 text-white backdrop-blur-sm ${
          isDesktop ? "bg-[#1a1208]/80" : "bg-[#1a1208]/75 pt-[max(0.5rem,env(safe-area-inset-top))]"
        }`}
      >
        {phase === "draw" ? (
          <button type="button" onClick={cancelHighlight} className="bg-transparent text-sm font-bold">
            Cancel
          </button>
        ) : (
          <span className="w-12" aria-hidden />
        )}
        <span className="text-sm font-extrabold">◎ Highlight</span>
        <span className="w-12" aria-hidden />
      </div>

      <div className="relative min-h-0 flex-1" style={{ paddingBottom: bottomPad }}>
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full touch-none ${
            phase === "draw" ? "cursor-crosshair" : "pointer-events-none"
          }`}
          onPointerDown={phase === "draw" ? onPointerDown : undefined}
          onPointerMove={phase === "draw" ? onPointerMove : undefined}
          onPointerUp={phase === "draw" ? onPointerUp : undefined}
          onPointerLeave={phase === "draw" ? onPointerUp : undefined}
        />
        {phase === "draw" ? (
          <p className="pointer-events-none absolute inset-x-4 top-3 text-center text-xs font-semibold text-white drop-shadow-md">
            {isDesktop
              ? "Drag to highlight an area · release to continue"
              : "Draw on the screen to highlight"}
          </p>
        ) : null}
      </div>

      {phase === "draw" && !isDesktop ? (
        <div className="absolute inset-x-0 z-10 px-4" style={{ bottom: bottomPad }}>
          <button
            type="button"
            onClick={finishDraw}
            disabled={points.length < MIN_STROKE_POINTS}
            className="w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-extrabold text-[#1a1208] shadow-lg disabled:opacity-40"
          >
            Done
          </button>
        </div>
      ) : null}

      {phase === "compose" ? (
        <div
          className="absolute inset-x-0 z-10 border-t border-black/10 bg-white px-3 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.12)]"
          style={{ bottom: bottomPad }}
        >
          <p className="mb-2 text-[10px] font-bold text-[#1a1208]/50">Message with highlight</p>
          {isDesktop ? (
            <div className="mb-2">
              <p className="mb-1 text-[10px] font-bold text-[#1a1208]/45">Send to</p>
              <div className="flex flex-wrap gap-1.5">
                {WORKFEED_DM_RECIPIENTS.map((r) => {
                  const active = desktopRecipientId === r.id
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setDesktopRecipientId(r.id)}
                      className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold transition ${
                        active
                          ? "border-amber-400 bg-amber-500/15 text-amber-900"
                          : "border-black/10 bg-[#f5f0e4] text-[#1a1208]/70 hover:bg-[#ede7d5]"
                      }`}
                    >
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-extrabold text-white"
                        style={{ backgroundColor: r.avatarBg }}
                      >
                        {r.initials}
                      </span>
                      {r.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={cancelHighlight}
              className="flex-shrink-0 rounded-2xl border border-black/15 bg-white px-3 py-3 text-sm font-bold text-[#1a1208]/70"
            >
              Cancel
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message…"
              className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-[#f5f0e4] px-4 py-3 text-base outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={openRecipients}
              disabled={!message.trim()}
              className="flex-shrink-0 rounded-2xl bg-red px-5 py-3 text-sm font-extrabold text-white disabled:opacity-40"
            >
              {isDesktop ? "Send" : "Send"}
            </button>
          </div>
          {isDesktop ? (
            <p className="mt-2 text-center text-[10px] font-semibold text-[#1a1208]/45">
              Pick a person above, then Send.
            </p>
          ) : null}
        </div>
      ) : null}

      {phase === "recipients" && !isDesktop ? (
        <div
          className="absolute inset-x-0 z-20 flex max-h-[min(52vh,420px)] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl"
          style={{ bottom: WORKFLOW_TAB_BAR_OFFSET }}
        >
          <div className="flex justify-center pt-2">
            <div className="h-1 w-10 rounded-full bg-black/15" aria-hidden />
          </div>
          <div className="overflow-y-auto px-4 pb-4 pt-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-black text-[#1a1208]">Send to</p>
              <button
                type="button"
                onClick={cancelHighlight}
                className="rounded-lg px-2 py-1 text-xs font-bold text-[#1a1208]/55 hover:bg-black/5"
              >
                Cancel
              </button>
            </div>
            <p className="mt-1 truncate text-xs font-medium text-[#1a1208]/55">
              “{message.trim()}”
            </p>
            <ul className="mt-3 space-y-1">
              {WORKFEED_DM_RECIPIENTS.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => sendTo(r)}
                    className="flex w-full items-center gap-3 rounded-xl bg-[#f5f0e4]/80 px-3 py-3 text-left"
                  >
                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                      style={{ backgroundColor: r.avatarBg }}
                    >
                      {r.initials}
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold">{r.name}</span>
                      <span className="block text-xs font-medium text-[#1a1208]/50">{r.handle}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
