"use client"

import { useMemo, useState } from "react"
import type { WorkflowTodoItem } from "@/lib/workflow/workfeed/todos"
import {
  anchorBetween,
  buildTasksMindmapLayout,
  MINDMAP_SIZE,
  mindmapCurvePath,
  type MindmapLayoutNode,
} from "@/lib/workflow/tasksMindmapLayout"
import { useMindmapViewport } from "@/lib/workflow/useMindmapViewport"
import { isTasksMapPlaceholder } from "@/lib/workflow/workfeed/tasksMapPlaceholders"

const TODO_DRAG = "application/vnd.vietdoc.todo+id"

type AssigneeLike = {
  id: string
  name: string
  initials: string
  avatarBg: string
  role?: string
}

type TasksMindmapCanvasProps = {
  assignees: AssigneeLike[]
  todosByAssignee: Record<string, WorkflowTodoItem[]>
  onAssignTodo: (todoId: string, assigneeId: string) => void
  onCycleStatus: (todoId: string) => void
  onSendToClient: (todo: WorkflowTodoItem) => void
}

export function TasksMindmapCanvas({
  assignees,
  todosByAssignee,
  onAssignTodo,
  onCycleStatus,
  onSendToClient,
}: TasksMindmapCanvasProps) {
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  const layout = useMemo(
    () => buildTasksMindmapLayout(assignees, todosByAssignee),
    [assignees, todosByAssignee]
  )

  const nodeMap = useMemo(() => {
    const m = new Map<string, MindmapLayoutNode>()
    for (const n of layout.nodes) m.set(n.id, n)
    return m
  }, [layout.nodes])

  const {
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
  } = useMindmapViewport({
    worldW: MINDMAP_SIZE.w,
    worldH: MINDMAP_SIZE.h,
    resetKey: layout.nodes.length,
  })

  const cursorClass = panMode
    ? "cursor-grabbing"
    : spaceHeld
      ? "cursor-grab"
      : "cursor-default"

  return (
    <div className={`absolute inset-0 min-h-0 bg-[color:var(--wf-surface)] ${cursorClass}`}>
      <div
        ref={viewportRef}
        className={`absolute inset-0 touch-none overflow-hidden ${cursorClass}`}
        onWheel={onWheel}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={onViewportPointerUp}
        onPointerCancel={onViewportPointerUp}
        style={{ overscrollBehavior: "none" }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            width: MINDMAP_SIZE.w,
            height: MINDMAP_SIZE.h,
            transform: `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`,
          }}
        >
          {/* Empty canvas — drag to pan (Figma-style) */}
          <div
            className="absolute z-0 cursor-grab active:cursor-grabbing"
            style={{ width: MINDMAP_SIZE.w, height: MINDMAP_SIZE.h }}
            onPointerDown={onBackdropPointerDown}
            onPointerMove={onViewportPointerMove}
            onPointerUp={onViewportPointerUp}
            onPointerCancel={onViewportPointerUp}
            aria-hidden
          />

          <svg
            className="pointer-events-none absolute inset-0"
            width={MINDMAP_SIZE.w}
            height={MINDMAP_SIZE.h}
            aria-hidden
          >
            {layout.edges.map((edge) => {
              const from = nodeMap.get(edge.from)
              const to = nodeMap.get(edge.to)
              if (!from || !to) return null
              const { x1, y1, x2, y2 } = anchorBetween(from, to)
              return (
                <path
                  key={edge.id}
                  d={mindmapCurvePath(x1, y1, x2, y2)}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth={edge.strokeWidth}
                  strokeLinecap="round"
                />
              )
            })}
          </svg>

          {layout.nodes.map((node) => {
            if (node.kind === "hub") {
              return (
                <div
                  key={node.id}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563eb] px-6 py-2.5 text-center shadow-[0_4px_20px_rgba(37,99,235,0.35)]"
                  style={{ left: node.x, top: node.y, width: node.w }}
                >
                  <p className="text-sm font-extrabold text-white">{node.label}</p>
                </div>
              )
            }

            if (node.kind === "assignee") {
              const person = assignees.find((a) => a.id === node.assigneeId)
              const hot = dropTargetId === node.id
              return (
                <div
                  key={node.id}
                  className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 bg-[#fef08a] px-3 py-2.5 shadow-md transition ${
                    hot ? "border-amber-500 ring-4 ring-amber-300/50" : "border-[#fbbf24]/80"
                  }`}
                  style={{ left: node.x, top: node.y, width: node.w, minHeight: node.h }}
                  onPointerDown={(e) => {
                    if (!spaceHeld) e.stopPropagation()
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.dataTransfer.dropEffect = "move"
                    setDropTargetId(node.id)
                  }}
                  onDragLeave={() => setDropTargetId((id) => (id === node.id ? null : id))}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const todoId = e.dataTransfer.getData(TODO_DRAG)
                    if (todoId && node.assigneeId) onAssignTodo(todoId, node.assigneeId)
                    setDropTargetId(null)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                      style={{ backgroundColor: person?.avatarBg ?? "#1a1208" }}
                    >
                      {node.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-[#1a1208]">{node.label}</p>
                      <p className="text-[10px] font-bold text-[#1a1208]/45">{node.sublabel}</p>
                    </div>
                  </div>
                </div>
              )
            }

            if (node.kind === "detail") {
              return (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#d1d5db] bg-[#f3f4f6] px-2.5 py-1 text-center shadow-sm"
                  style={{ left: node.x, top: node.y, width: node.w }}
                >
                  <p className="truncate text-[10px] font-bold text-[#1a1208]/65">{node.label}</p>
                </div>
              )
            }

            if (node.kind !== "task" || !node.todo) return null

            const todo = node.todo
            const done = todo.status === "done"
            const inProgress = todo.status === "in_progress"
            const isPlaceholder = isTasksMapPlaceholder(todo.id)

            return (
              <div
                key={node.id}
                draggable={!spaceHeld && !panMode}
                onDragStart={(e) => {
                  if (spaceHeld || panMode) {
                    e.preventDefault()
                    return
                  }
                  e.stopPropagation()
                  e.dataTransfer.setData(TODO_DRAG, todo.id)
                  e.dataTransfer.effectAllowed = "move"
                }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${
                  spaceHeld || panMode ? "cursor-grab" : "cursor-grab active:cursor-grabbing"
                }`}
                style={{ left: node.x, top: node.y, width: node.w }}
                onPointerDown={(e) => {
                  if (!spaceHeld) e.stopPropagation()
                }}
              >
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-sm ${
                    isPlaceholder
                      ? "border-dashed border-red-200/70 bg-[#fecaca]/75"
                      : "border-red-300/80 bg-[#fecaca]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCycleStatus(todo.id)
                    }}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-extrabold ${
                      done
                        ? "border-emerald-600 bg-emerald-500 text-white"
                        : inProgress
                          ? "border-amber-500 bg-amber-400"
                          : "border-red-400/60 bg-white/70"
                    }`}
                    aria-label="Cycle status"
                  >
                    {done ? "✓" : ""}
                  </button>
                  <p
                    className={`min-w-0 flex-1 truncate text-xs font-extrabold ${
                      done ? "text-[#1a1208]/45 line-through" : "text-[#991b1b]"
                    }`}
                    title={node.label}
                  >
                    {node.label}
                  </p>
                  {done ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSendToClient(todo)
                      }}
                      className="shrink-0 rounded-full bg-blue px-2 py-0.5 text-[9px] font-extrabold text-white"
                    >
                      Send
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute left-4 top-3 z-10 rounded-lg border border-[color:var(--wf-glass-border-subtle)] bg-[var(--wf-glass-heavy)] px-2.5 py-1.5 text-[10px] font-medium text-[color:var(--wf-ink-muted)] shadow-sm backdrop-blur">
        Pinch or ⌘ scroll to zoom · scroll to pan · Space + drag · click + drag empty area
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[color:var(--wf-glass-border)] bg-[var(--wf-glass-heavy)] px-2 py-1 shadow-lg backdrop-blur">
        <button
          type="button"
          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full text-lg font-light text-[color:var(--wf-ink)] hover:bg-black/5"
          onClick={() => zoomBy(-0.12)}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className="pointer-events-auto min-w-[3rem] text-center text-xs font-extrabold text-[color:var(--wf-ink-muted)] hover:text-[color:var(--wf-ink)]"
          onClick={() => centerOnWorld(1)}
          title="Reset view"
        >
          {Math.round(view.zoom * 100)}%
        </button>
        <button
          type="button"
          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full text-lg font-light text-[color:var(--wf-ink)] hover:bg-black/5"
          onClick={() => zoomBy(0.12)}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  )
}
