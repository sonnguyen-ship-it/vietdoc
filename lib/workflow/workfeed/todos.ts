import { WORKFEED_POSTS } from "@/lib/workflow/workfeed/content"
import { WORKFEED_CURRENT_USER } from "@/lib/workflow/workfeed/dmData"
import type { WorkfeedPost } from "@/lib/workflow/workfeed/types"

export type WorkflowTodoSource = "post" | "note"

/** open → in_progress (yellow) → done (green ✓) → open */
export type WorkflowTodoStatus = "open" | "in_progress" | "done"

export type WorkflowTodoSeverity = "tomorrow" | "week" | "month"

export const WORKFLOW_TODO_SEVERITY_LABELS: Record<WorkflowTodoSeverity, string> = {
  tomorrow: "Tomorrow",
  week: "This Week",
  month: "This Month",
}

export type WorkflowTodoItem = {
  id: string
  title: string
  status: WorkflowTodoStatus
  assigneeId: string
  source: WorkflowTodoSource
  sourceLabel?: string
  postId?: string
  severity?: WorkflowTodoSeverity
}

export function nextTodoStatus(status: WorkflowTodoStatus): WorkflowTodoStatus {
  if (status === "open") return "in_progress"
  if (status === "in_progress") return "done"
  return "open"
}

export function flattenPostLines(post: WorkfeedPost): string {
  if (post.kind !== "boss-announcement") return post.author.name
  return post.lines
    .map((line) => line.parts.map((p) => p.value).join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

function mentionToUserId(mention: string): string {
  return mention.replace(/^@/, "")
}

export function buildTodosFromPosts(assigneeId: string): WorkflowTodoItem[] {
  const todos: WorkflowTodoItem[] = []
  for (const post of WORKFEED_POSTS) {
    if (post.kind !== "boss-announcement" || !post.mentions?.length) continue
    const tagged = post.mentions.map(mentionToUserId)
    if (!tagged.includes(assigneeId)) continue
    todos.push({
      id: `todo-post-${post.id}`,
      title: flattenPostLines(post),
      status: "open",
      assigneeId,
      source: "post",
      sourceLabel: `${post.author.name} · Feed`,
      postId: post.id,
    })
  }
  return todos
}

export function buildInitialTodos(): WorkflowTodoItem[] {
  return buildTodosFromPosts(WORKFEED_CURRENT_USER)
}

export const WORKFLOW_TODO_ASSIGNEES = [
  { id: WORKFEED_CURRENT_USER, name: "You", initials: "E2", avatarBg: "#2563eb", role: "PM" },
  { id: "boss", name: "boss", initials: "BS", avatarBg: "#1a1208", role: "Lead" },
  { id: "my", name: "my", initials: "MY", avatarBg: "#7c3aed", role: "Creative" },
  { id: "dung", name: "dung", initials: "DU", avatarBg: "#059669", role: "Editor" },
  { id: "ductran", name: "ductran", initials: "DT", avatarBg: "#0ea5e9", role: "Motion" },
]
