import type { WorkflowTodoItem } from "@/lib/workflow/workfeed/todos"

export const MINDMAP_SIZE = { w: 1400, h: 900 }

export type MindmapNodeKind = "hub" | "assignee" | "task" | "detail"

export type MindmapLayoutNode = {
  id: string
  kind: MindmapNodeKind
  x: number
  y: number
  label: string
  sublabel?: string
  assigneeId?: string
  todo?: WorkflowTodoItem
  color?: string
  initials?: string
  w: number
  h: number
}

export type MindmapLayoutEdge = {
  id: string
  from: string
  to: string
  color: string
  strokeWidth: number
}

export type MindmapLayout = {
  nodes: MindmapLayoutNode[]
  edges: MindmapLayoutEdge[]
}

type AssigneeLike = {
  id: string
  name: string
  initials: string
  avatarBg: string
  role?: string
}

const BRANCH_COLORS = ["#2563eb", "#059669", "#7c3aed", "#ea580c", "#0ea5e9"]

/** Radial org chart — hub center, all teammates visible around it. */
export function buildTasksMindmapLayout(
  assignees: AssigneeLike[],
  todosByAssignee: Record<string, WorkflowTodoItem[]>,
  hubLabel = "Team"
): MindmapLayout {
  const { w, h } = MINDMAP_SIZE
  const cx = w / 2
  const cy = h / 2

  const hub: MindmapLayoutNode = {
    id: "hub",
    kind: "hub",
    x: cx,
    y: cy,
    label: hubLabel,
    color: "#2563eb",
    w: 148,
    h: 44,
  }

  const nodes: MindmapLayoutNode[] = [hub]
  const edges: MindmapLayoutEdge[] = []
  const n = assignees.length
  const assigneeRadius = 200
  const taskRadius = 130

  assignees.forEach((person, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const ax = cx + Math.cos(angle) * assigneeRadius
    const ay = cy + Math.sin(angle) * assigneeRadius
    const branchColor = BRANCH_COLORS[i % BRANCH_COLORS.length]
    const taskCount = (todosByAssignee[person.id] ?? []).length

    nodes.push({
      id: person.id,
      kind: "assignee",
      x: ax,
      y: ay,
      label: person.name,
      sublabel: person.role ? `${person.role} · ${taskCount} tasks` : `${taskCount} tasks`,
      assigneeId: person.id,
      color: "#fef08a",
      initials: person.initials,
      w: 156,
      h: 76,
    })

    edges.push({
      id: `e-hub-${person.id}`,
      from: hub.id,
      to: person.id,
      color: branchColor,
      strokeWidth: 5,
    })

    const tasks = todosByAssignee[person.id] ?? []
    const perpX = -Math.sin(angle)
    const perpY = Math.cos(angle)

    tasks.forEach((todo, ti) => {
      const spread = (ti - (tasks.length - 1) / 2) * 54
      const tx = ax + Math.cos(angle) * taskRadius + perpX * spread
      const ty = ay + Math.sin(angle) * taskRadius + perpY * spread

      nodes.push({
        id: todo.id,
        kind: "task",
        x: tx,
        y: ty,
        label: todo.title,
        assigneeId: person.id,
        todo,
        color: "#fecaca",
        w: Math.min(240, Math.max(136, todo.title.length * 7.2)),
        h: 40,
      })

      edges.push({
        id: `e-${person.id}-${todo.id}`,
        from: person.id,
        to: todo.id,
        color: "#ef4444",
        strokeWidth: 3.5,
      })

      if (todo.severity) {
        const detailId = `${todo.id}-detail`
        nodes.push({
          id: detailId,
          kind: "detail",
          x: tx + Math.cos(angle) * 72,
          y: ty + Math.sin(angle) * 72,
          label:
            todo.severity === "tomorrow"
              ? "Due tomorrow"
              : todo.severity === "week"
                ? "This week"
                : "This month",
          assigneeId: person.id,
          todo,
          color: "#e5e7eb",
          w: 108,
          h: 28,
        })
        edges.push({
          id: `e-${todo.id}-detail`,
          from: todo.id,
          to: detailId,
          color: "#9ca3af",
          strokeWidth: 2,
        })
      }
    })
  })

  return { nodes, edges }
}

export function anchorBetween(
  from: MindmapLayoutNode,
  to: MindmapLayoutNode
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.hypot(dx, dy) || 1
  const ux = dx / dist
  const uy = dy / dist

  return {
    x1: from.x + ux * (from.w / 2),
    y1: from.y + uy * (from.h / 2),
    x2: to.x - ux * (to.w / 2),
    y2: to.y - uy * (to.h / 2),
  }
}

export function mindmapCurvePath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1
  const dy = y2 - y1
  const bend = Math.min(100, Math.hypot(dx, dy) * 0.28)
  const nx = -dy / (Math.hypot(dx, dy) || 1)
  const ny = dx / (Math.hypot(dx, dy) || 1)

  const c1x = x1 + dx * 0.35 + nx * bend * 0.35
  const c1y = y1 + dy * 0.35 + ny * bend * 0.35
  const c2x = x1 + dx * 0.65 + nx * bend * 0.15
  const c2y = y1 + dy * 0.65 + ny * bend * 0.15

  return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`
}
