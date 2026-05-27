"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { WORKFEED_CLIENT_CHAT_ID } from "@/lib/workflow/workfeed/clientChatData"
import { WORKFEED_CURRENT_USER } from "@/lib/workflow/workfeed/dmData"
import { buildWorkflowMessagesChats } from "@/lib/workflow/workfeed/messagesData"
import type { WorkfeedChat, WorkfeedChatMessage } from "@/lib/workflow/workfeed/types"
import { useResizablePanel } from "@/lib/workflow/useResizablePanel"
import { WorkflowMessagesPanel } from "@/components/workflow/desktop/WorkflowMessagesPanel"
import { WorkflowMessagesRail } from "@/components/workflow/desktop/WorkflowMessagesRail"
import { WorkflowMessagesResizeHandle } from "@/components/workflow/desktop/WorkflowMessagesResizeHandle"
import {
  WORKFLOW_MESSAGES_PANEL_DEFAULT,
  WORKFLOW_MESSAGES_PANEL_MAX,
  WORKFLOW_MESSAGES_PANEL_MIN,
} from "@/lib/workflow/workfeed/messagesPanelLayout"
import {
  WORKFLOW_TODO_ASSIGNEES,
  nextTodoStatus,
  type WorkflowTodoItem,
} from "@/lib/workflow/workfeed/todos"
import {
  TASKS_MAP_PLACEHOLDER_TODOS,
  isTasksMapPlaceholder,
  mergeTodosForTasksMap,
} from "@/lib/workflow/workfeed/tasksMapPlaceholders"
import { TasksMindmapCanvas } from "@/components/workflow/todos/TasksMindmapCanvas"
import { TaskSlashComposer } from "@/components/workflow/todos/TaskSlashComposer"
import { useWorkflowTodos } from "@/components/workflow/todos/WorkflowTodoContext"

type WorkflowTasksMapModalProps = {
  open: boolean
  onClose: () => void
}

const MESSAGES_MIN = WORKFLOW_MESSAGES_PANEL_MIN
const MESSAGES_MAX = WORKFLOW_MESSAGES_PANEL_MAX
const MESSAGES_DEFAULT = WORKFLOW_MESSAGES_PANEL_DEFAULT

function appendChatMessage(
  chats: WorkfeedChat[],
  chatId: string,
  msg: WorkfeedChatMessage
): WorkfeedChat[] {
  const now = new Date().toLocaleTimeString("vi-VN", {
    hour: "numeric",
    minute: "2-digit",
  })
  return chats.map((chat) => {
    if (chat.id !== chatId) return chat
    return {
      ...chat,
      messages: [...chat.messages, msg],
      preview: msg.text ?? chat.preview,
      time: now,
      unread: 0,
    }
  })
}

export function WorkflowTasksMapModal({ open, onClose }: WorkflowTasksMapModalProps) {
  const { todos, setTodoAssignee, cycleTodoStatus } = useWorkflowTodos()
  const [placeholders, setPlaceholders] = useState(TASKS_MAP_PLACEHOLDER_TODOS)
  const [messagesOpen, setMessagesOpen] = useState(true)
  const [chats, setChats] = useState<WorkfeedChat[]>(() => buildWorkflowMessagesChats())
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { width: messagesWidth, onResizePointerDown } = useResizablePanel({
    initialWidth: MESSAGES_DEFAULT,
    minWidth: MESSAGES_MIN,
    maxWidth: MESSAGES_MAX,
  })

  const unreadTotal = useMemo(
    () => chats.reduce((sum, c) => sum + c.unread, 0),
    [chats]
  )

  const displayTodos = useMemo(
    () =>
      mergeTodosForTasksMap(todos).map((t) =>
        isTasksMapPlaceholder(t.id) ? placeholders.find((p) => p.id === t.id) ?? t : t
      ),
    [todos, placeholders]
  )

  const todosByAssignee = useMemo(() => {
    const map: Record<string, WorkflowTodoItem[]> = {}
    for (const a of WORKFLOW_TODO_ASSIGNEES) map[a.id] = []
    for (const t of displayTodos) {
      if (!map[t.assigneeId]) map[t.assigneeId] = []
      map[t.assigneeId].push(t)
    }
    return map
  }, [displayTodos])

  const postToClientChat = useCallback((text: string) => {
    const msg: WorkfeedChatMessage = {
      id: `pm-${Date.now()}`,
      sender: WORKFEED_CURRENT_USER,
      kind: "text",
      text,
      align: "right",
    }
    setChats((prev) => appendChatMessage(prev, WORKFEED_CLIENT_CHAT_ID, msg))
    setActiveChatId(WORKFEED_CLIENT_CHAT_ID)
    setMessagesOpen(true)
  }, [])

  const handleAssignTodo = (todoId: string, assigneeId: string) => {
    if (isTasksMapPlaceholder(todoId)) {
      setPlaceholders((prev) =>
        prev.map((t) => (t.id === todoId ? { ...t, assigneeId } : t))
      )
      return
    }
    setTodoAssignee(todoId, assigneeId)
  }

  const handleCycleStatus = (todoId: string) => {
    if (isTasksMapPlaceholder(todoId)) {
      setPlaceholders((prev) =>
        prev.map((t) =>
          t.id === todoId ? { ...t, status: nextTodoStatus(t.status) } : t
        )
      )
      return
    }
    cycleTodoStatus(todoId)
  }

  const sendToClient = (todo: WorkflowTodoItem) => {
    postToClientChat(`✅ Done: ${todo.title} — sharing for approval`)
  }

  if (!open) return null

  const modal = (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-[#1a1208]/8 px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[#1a1208]">Task Map</p>
          <p className="text-[11px] font-medium text-[#1a1208]/45">
            Pinch/⌘ scroll zoom · drag to pan · Space + drag · drag tasks between people
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm font-bold text-[#1a1208]/60 hover:bg-black/5"
        >
          Close
        </button>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="relative min-h-0 min-w-0 flex-1">
          <TasksMindmapCanvas
            assignees={WORKFLOW_TODO_ASSIGNEES}
            todosByAssignee={todosByAssignee}
            onAssignTodo={handleAssignTodo}
            onCycleStatus={handleCycleStatus}
            onSendToClient={sendToClient}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[95] flex justify-center px-4">
            <div className="pointer-events-auto w-[min(100%,720px)] rounded-2xl border border-[#1a1208]/10 bg-white/95 p-2 shadow-[0_8px_32px_rgba(26,18,8,0.12)] backdrop-blur">
              <TaskSlashComposer sourceLabel="Task Map" />
            </div>
          </div>
        </div>

        {messagesOpen ? (
          <>
            <WorkflowMessagesResizeHandle onPointerDown={onResizePointerDown} />
            <div
              style={{ width: messagesWidth }}
              className="wf-glass-heavy flex min-h-0 shrink-0 flex-col overflow-hidden border border-[color:var(--wf-glass-border)] border-r-0 shadow-[-8px_0_24px_rgba(26,18,8,0.06)]"
            >
              <WorkflowMessagesPanel
                chats={chats}
                onChatsChange={(fn) => setChats(fn)}
                activeChatId={activeChatId}
                onActiveChatChange={setActiveChatId}
                onHighlightOpen={() => {}}
                onClosePanel={() => setMessagesOpen(false)}
              />
            </div>
          </>
        ) : null}
      </div>

      <WorkflowMessagesRail
        open={messagesOpen}
        onOpen={() => setMessagesOpen(true)}
        unreadTotal={unreadTotal}
        elevated
      />
    </div>
  )

  if (!mounted) return null

  return createPortal(modal, document.body)
}
