"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { WORKFEED_DM_RECIPIENTS } from "@/lib/workflow/workfeed/dmData"
import { WORKFLOW_FAB_CLEARANCE, WORKFLOW_TAB_BAR_OFFSET } from "@/lib/workflow/workfeed/layout"
import type { WorkfeedDmRecipient } from "@/lib/workflow/workfeed/types"

type Point = { x: number; y: number }

type WorkflowHighlightFlowProps = {
  onClose: () => void
  onSend: (payload: {
    recipient: WorkfeedDmRecipient
    text: string
    highlightPath: string
  }) => void
}

export function WorkflowHighlightFlow({ onClose, onSend }: WorkflowHighlightFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [points, setPoints] = useState<Point[]>([])
  const [drawing, setDrawing] = useState(false)
  const [pathD, setPathD] = useState("")
  const [phase, setPhase] = useState<"draw" | "compose" | "recipients">("draw")
  const [message, setMessage] = useState("")

  const redraw = useCallback((pts: Point[]) => {
    const canvas = canvasRef.current
    if (!canvas || pts.length < 2) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = "#f97316"
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
  }, [])

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrawing(true)
    const p = getPoint(e)
    const next = [p]
    setPoints(next)
    redraw(next)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const p = getPoint(e)
    setPoints((prev) => {
      const next = [...prev, p]
      redraw(next)
      return next
    })
  }

  const onPointerUp = () => {
    setDrawing(false)
  }

  useEffect(() => {
    if (phase !== "compose" || points.length < 2) return
    redraw(points)
  }, [phase, points, redraw])

  const finishDraw = () => {
    if (points.length < 4) return
    setPhase("compose")
  }

  const openRecipients = () => {
    if (!message.trim()) return
    setPhase("recipients")
  }

  const sendTo = (recipient: WorkfeedDmRecipient) => {
    onSend({
      recipient,
      text: message.trim(),
      highlightPath: pathD,
    })
  }

  return (
    <div className="absolute inset-0 z-[55] flex flex-col overflow-hidden bg-black/20">
      <div className="flex shrink-0 items-center justify-between bg-[#1a1208]/75 px-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))] text-white backdrop-blur-sm">
        <button type="button" onClick={onClose} className="bg-transparent text-sm font-bold">
          Cancel
        </button>
        <span className="text-sm font-extrabold">◎ Highlight</span>
        <span className="w-12" aria-hidden />
      </div>

      <div
        className="relative min-h-0 flex-1"
        style={{ paddingBottom: WORKFLOW_FAB_CLEARANCE }}
      >
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
            Draw a circle on the screen
          </p>
        ) : null}
      </div>

      {phase === "draw" ? (
        <div
          className="absolute inset-x-0 z-10 px-4"
          style={{ bottom: WORKFLOW_FAB_CLEARANCE }}
        >
          <button
            type="button"
            onClick={finishDraw}
            disabled={points.length < 4}
            className="w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-extrabold text-[#1a1208] shadow-lg disabled:opacity-40"
          >
            Done
          </button>
        </div>
      ) : null}

      {phase === "compose" ? (
        <div
          className="absolute inset-x-0 z-10 border-t border-black/10 bg-white px-3 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.12)]"
          style={{ bottom: WORKFLOW_FAB_CLEARANCE }}
        >
          <p className="mb-2 text-[10px] font-bold text-[#1a1208]/50">Message with highlight</p>
          <div className="flex items-end gap-2">
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
              Send
            </button>
          </div>
        </div>
      ) : null}

      {phase === "recipients" ? (
        <div
          className="absolute inset-x-0 z-20 flex max-h-[min(52vh,420px)] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl"
          style={{ bottom: WORKFLOW_TAB_BAR_OFFSET }}
        >
          <div className="flex justify-center pt-2">
            <div className="h-1 w-10 rounded-full bg-black/15" aria-hidden />
          </div>
          <div className="overflow-y-auto px-4 pb-4 pt-2">
            <p className="text-sm font-black text-[#1a1208]">Send to</p>
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
