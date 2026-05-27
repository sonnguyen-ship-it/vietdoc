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
import { WORKFEED_CURRENT_USER } from "@/lib/workflow/workfeed/dmData"
import {
  buildInitialTodos,
  nextTodoStatus,
  type WorkflowTodoItem,
  type WorkflowTodoSeverity,
  type WorkflowTodoSource,
  type WorkflowTodoStatus,
} from "@/lib/workflow/workfeed/todos"
import {
  deleteTodoForDevice,
  fetchTodosForDevice,
  getWorkflowDeviceId,
  upsertTodoForDevice,
} from "@/lib/workflow/workfeed/todosSupabase"

type AddTodoInput = {
  title: string
  assigneeId: string
  source?: WorkflowTodoSource
  sourceLabel?: string
  postId?: string
  severity?: WorkflowTodoSeverity
}

type WorkflowTodoContextValue = {
  currentUserId: string
  todos: WorkflowTodoItem[]
  myTodos: WorkflowTodoItem[]
  addTodo: (input: AddTodoInput) => WorkflowTodoItem
  updateTodo: (
    id: string,
    patch: Partial<Pick<WorkflowTodoItem, "status" | "title" | "severity" | "sourceLabel">>
  ) => void
  cycleTodoStatus: (id: string) => void
  setTodoAssignee: (id: string, assigneeId: string) => void
  removeTodo: (id: string) => void
}

const WorkflowTodoContext = createContext<WorkflowTodoContextValue | null>(null)

export function WorkflowTodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<WorkflowTodoItem[]>(buildInitialTodos)
  const currentUserId = WORKFEED_CURRENT_USER
  const [deviceId] = useState(() => getWorkflowDeviceId())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const remote = await fetchTodosForDevice(deviceId)
      if (!remote || cancelled) return
      setTodos((prev) => {
        const map = new Map<string, WorkflowTodoItem>()
        for (const t of prev) map.set(t.id, t)
        for (const t of remote) map.set(t.id, t)
        return Array.from(map.values())
      })
    })()
    return () => {
      cancelled = true
    }
  }, [deviceId])

  const myTodos = useMemo(
    () => todos.filter((t) => t.assigneeId === currentUserId),
    [todos, currentUserId]
  )

  const addTodo = useCallback((input: AddTodoInput) => {
    const item: WorkflowTodoItem = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `todo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title: input.title.trim(),
      status: "open",
      assigneeId: input.assigneeId,
      source: input.source ?? "note",
      sourceLabel: input.sourceLabel,
      postId: input.postId,
      severity: input.severity,
    }
    setTodos((prev) => [...prev, item])
    void upsertTodoForDevice(deviceId, item)
    return item
  }, [deviceId])

  const updateTodo = useCallback(
    (id: string, patch: Partial<Pick<WorkflowTodoItem, "status" | "title" | "severity" | "sourceLabel">>) => {
      setTodos((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t
          const next = { ...t, ...patch }
          void upsertTodoForDevice(deviceId, next)
          return next
        })
      )
    },
    [deviceId]
  )

  const cycleTodoStatus = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const status: WorkflowTodoStatus = nextTodoStatus(t.status)
        const next = { ...t, status }
        void upsertTodoForDevice(deviceId, next)
        return next
      })
    )
  }, [deviceId])

  const setTodoAssignee = useCallback((id: string, assigneeId: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const next = { ...t, assigneeId }
        void upsertTodoForDevice(deviceId, next)
        return next
      })
    )
  }, [deviceId])

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    void deleteTodoForDevice(deviceId, id)
  }, [deviceId])

  const value = useMemo(
    () => ({
      currentUserId,
      todos,
      myTodos,
      addTodo,
      updateTodo,
      cycleTodoStatus,
      setTodoAssignee,
      removeTodo,
    }),
    [
      currentUserId,
      todos,
      myTodos,
      addTodo,
      updateTodo,
      cycleTodoStatus,
      setTodoAssignee,
      removeTodo,
    ]
  )

  return <WorkflowTodoContext.Provider value={value}>{children}</WorkflowTodoContext.Provider>
}

export function useWorkflowTodos() {
  const ctx = useContext(WorkflowTodoContext)
  if (!ctx) throw new Error("useWorkflowTodos must be used within WorkflowTodoProvider")
  return ctx
}

export function useWorkflowTodosOptional() {
  return useContext(WorkflowTodoContext)
}
