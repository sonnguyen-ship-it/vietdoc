import { createSupabaseBrowser } from "@/lib/supabase/client"
import type { WorkflowTodoItem, WorkflowTodoSource, WorkflowTodoStatus } from "@/lib/workflow/workfeed/todos"

type DbTodoRow = {
  id: string
  created_at: string
  device_id: string
  title: string
  status: WorkflowTodoStatus
  assignee_id: string
  source: WorkflowTodoSource
  source_label: string | null
  post_id: string | null
}

export function getWorkflowDeviceId(): string {
  if (typeof window === "undefined") return "server"
  const k = "vietdoc.workflow.device_id"
  const existing = window.localStorage.getItem(k)
  if (existing) return existing
  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `dev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(k, next)
  return next
}

export async function fetchTodosForDevice(deviceId: string): Promise<WorkflowTodoItem[] | null> {
  const supabase = createSupabaseBrowser()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("workflow_todos")
    .select("id, created_at, device_id, title, status, assignee_id, source, source_label, post_id")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: true })

  if (error || !data) return null
  return (data as unknown as DbTodoRow[]).map((r) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    assigneeId: r.assignee_id,
    source: r.source,
    sourceLabel: r.source_label ?? undefined,
    postId: r.post_id ?? undefined,
  }))
}

export async function upsertTodoForDevice(deviceId: string, todo: WorkflowTodoItem): Promise<void> {
  const supabase = createSupabaseBrowser()
  if (!supabase) return
  await supabase.from("workflow_todos").upsert(
    {
      id: todo.id,
      device_id: deviceId,
      title: todo.title,
      status: todo.status,
      assignee_id: todo.assigneeId,
      source: todo.source,
      source_label: todo.sourceLabel ?? null,
      post_id: todo.postId ?? null,
    },
    { onConflict: "id" }
  )
}

export async function deleteTodoForDevice(deviceId: string, id: string): Promise<void> {
  const supabase = createSupabaseBrowser()
  if (!supabase) return
  await supabase.from("workflow_todos").delete().eq("device_id", deviceId).eq("id", id)
}

