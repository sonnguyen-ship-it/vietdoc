import { WORKFEED_CURRENT_USER } from "@/lib/workflow/workfeed/dmData"
import type { WorkflowTodoItem } from "@/lib/workflow/workfeed/todos"

/** Demo tasks shown on Tasks Map until replaced by real work. */
export const TASKS_MAP_PLACEHOLDER_TODOS: WorkflowTodoItem[] = [
  {
    id: "map-ph-you-1",
    title: "Review ad report draft",
    status: "in_progress",
    assigneeId: WORKFEED_CURRENT_USER,
    source: "note",
    sourceLabel: "Task Map · demo",
    severity: "week",
  },
  {
    id: "map-ph-boss-1",
    title: "Approve campaign timeline",
    status: "open",
    assigneeId: "boss",
    source: "note",
    sourceLabel: "Task Map · demo",
    severity: "month",
  },
  {
    id: "map-ph-my-1",
    title: "Cut hero video v2",
    status: "open",
    assigneeId: "my",
    source: "note",
    sourceLabel: "Task Map · demo",
    severity: "week",
  },
  {
    id: "map-ph-dung-1",
    title: "Export TikTok ad frames",
    status: "open",
    assigneeId: "dung",
    source: "note",
    sourceLabel: "Task Map · demo",
    severity: "tomorrow",
  },
  {
    id: "map-ph-ductran-1",
    title: "Animate Plan Week 3 cell",
    status: "open",
    assigneeId: "ductran",
    source: "note",
    sourceLabel: "Task Map · demo",
    severity: "week",
  },
]

export function isTasksMapPlaceholder(id: string): boolean {
  return id.startsWith("map-ph-")
}

export function mergeTodosForTasksMap(realTodos: WorkflowTodoItem[]): WorkflowTodoItem[] {
  const real = realTodos.filter((t) => !isTasksMapPlaceholder(t.id))
  return [...real, ...TASKS_MAP_PLACEHOLDER_TODOS]
}
