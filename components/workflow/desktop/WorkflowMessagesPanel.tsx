"use client"

import { useCallback, useState } from "react"
import {
  parseHighlightDrag,
  WORKFLOW_HIGHLIGHT_DRAG_TYPE,
  type WorkfeedHighlightDragPayload,
} from "@/lib/workflow/workfeed/highlightRef"
import { WORKFEED_CURRENT_USER } from "@/lib/workflow/workfeed/dmData"
import type { WorkfeedHighlightRef } from "@/lib/workflow/workfeed/highlightRef"
import type { WorkfeedChat, WorkfeedChatMessage } from "@/lib/workflow/workfeed/types"
import { HighlightMessageCard } from "@/components/workflow/shared/HighlightMessageCard"
import { MoodboardShareCard } from "@/components/workflow/shared/MoodboardShareCard"

function MessageBubble({
  msg,
  onHighlightOpen,
  onMoodPinOpen,
}: {
  msg: WorkfeedChatMessage
  onHighlightOpen?: (ref: WorkfeedHighlightRef) => void
  onMoodPinOpen?: (pinId: string) => void
}) {
  const isRight = msg.align === "right"
  const base = `max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
    isRight
      ? "ml-auto bg-[#1a1208] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
      : "mr-auto wf-glass-thin border border-[color:var(--wf-glass-border-subtle)] text-[#1a1208] shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
  }`

  if (msg.kind === "highlight") {
    return (
      <div className={isRight ? "ml-auto max-w-[90%]" : "mr-auto max-w-[90%]"}>
        <HighlightMessageCard
          msg={msg}
          onOpen={
            msg.highlightRef && onHighlightOpen
              ? () => onHighlightOpen(msg.highlightRef!)
              : undefined
          }
        />
      </div>
    )
  }

  if (msg.kind === "mood-pin") {
    return (
      <div className={isRight ? "ml-auto max-w-[90%]" : "mr-auto max-w-[90%]"}>
        <MoodboardShareCard
          msg={msg}
          onOpen={
            msg.moodPin?.id && onMoodPinOpen ? () => onMoodPinOpen(msg.moodPin!.id) : undefined
          }
        />
      </div>
    )
  }

  return <div className={base}>{msg.text}</div>
}

type WorkflowMessagesPanelProps = {
  chats: WorkfeedChat[]
  onChatsChange: (updater: (prev: WorkfeedChat[]) => WorkfeedChat[]) => void
  activeChatId: string | null
  onActiveChatChange: (id: string | null) => void
  onHighlightOpen: (ref: WorkfeedHighlightRef) => void
  onMoodPinOpen?: (pinId: string) => void
  onClosePanel: () => void
}

export function WorkflowMessagesPanel({
  chats,
  onChatsChange,
  activeChatId,
  onActiveChatChange,
  onHighlightOpen,
  onMoodPinOpen,
  onClosePanel,
}: WorkflowMessagesPanelProps) {
  const [draft, setDraft] = useState("")
  const [dropActive, setDropActive] = useState(false)

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null
  const clientChats = chats.filter((c) => c.kind === "client")
  const directChats = chats.filter((c) => c.kind === "direct")
  const groupChats = chats.filter((c) => c.kind !== "direct" && c.kind !== "client")

  const appendMessage = useCallback(
    (chatId: string, msg: WorkfeedChatMessage) => {
      const now = new Date().toLocaleTimeString("vi-VN", {
        hour: "numeric",
        minute: "2-digit",
      })
      onChatsChange((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat
          return {
            ...chat,
            messages: [...chat.messages, msg],
            preview: msg.text ?? "◎ Highlight",
            time: now,
          }
        })
      )
    },
    [onChatsChange]
  )

  const sendHighlight = useCallback(
    (chatId: string, payload: WorkfeedHighlightDragPayload) => {
      appendMessage(chatId, {
        id: `hl-${Date.now()}`,
        sender: WORKFEED_CURRENT_USER,
        kind: "highlight",
        text: payload.text,
        align: "right",
        highlightPath: payload.ref.pathD,
        highlightRef: payload.ref,
      })
    },
    [appendMessage]
  )

  const onDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(WORKFLOW_HIGHLIGHT_DRAG_TYPE)) return
    e.preventDefault()
    setDropActive(true)
  }

  const onDragLeave = () => setDropActive(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDropActive(false)
    if (!activeChatId) return
    const raw = e.dataTransfer.getData(WORKFLOW_HIGHLIGHT_DRAG_TYPE)
    const payload = parseHighlightDrag(raw)
    if (payload) sendHighlight(activeChatId, payload)
  }

  const sendText = () => {
    if (!draft.trim() || !activeChatId) return
    appendMessage(activeChatId, {
      id: `msg-${Date.now()}`,
      sender: WORKFEED_CURRENT_USER,
      kind: "text",
      text: draft.trim(),
      align: "right",
    })
    setDraft("")
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-transparent">
      {!activeChat ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <PanelHeader onClose={onClosePanel} />
          {clientChats.length > 0 ? (
            <section className="mt-2">
              <p className="px-4 text-[10px] font-extrabold uppercase tracking-wide text-[#1a1208]/45">
                Client chat
              </p>
              <ul>
                {clientChats.map((chat) => (
                  <ChatRow key={chat.id} chat={chat} onOpen={() => onActiveChatChange(chat.id)} />
                ))}
              </ul>
            </section>
          ) : null}
          {directChats.length > 0 ? (
            <section className="mt-2">
              <p className="px-4 text-[10px] font-extrabold uppercase tracking-wide text-[#1a1208]/45">
                Direct
              </p>
              <ul>
                {directChats.map((chat) => (
                  <ChatRow key={chat.id} chat={chat} onOpen={() => onActiveChatChange(chat.id)} />
                ))}
              </ul>
            </section>
          ) : null}
          {groupChats.length > 0 ? (
            <section className="mt-2 pb-4">
              <p className="px-4 text-[10px] font-extrabold uppercase tracking-wide text-[#1a1208]/45">
                Groups
              </p>
              <ul>
                {groupChats.map((chat) => (
                  <ChatRow key={chat.id} chat={chat} onOpen={() => onActiveChatChange(chat.id)} />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : (
        <>
          <header className="flex items-center gap-2 border-b border-[color:var(--wf-glass-border-subtle)] bg-[rgba(255,255,255,0.62)] px-2 py-2 backdrop-blur-xl backdrop-saturate-150">
            <button
              type="button"
              onClick={() => onActiveChatChange(null)}
              className="rounded-lg bg-transparent p-1 text-lg font-bold text-[#1a1208]/55 hover:bg-white/40"
              aria-label="Back to list"
            >
              ←
            </button>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
              style={{ backgroundColor: activeChat.avatarBg }}
            >
              {activeChat.avatar}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{activeChat.title}</p>
              {activeChat.handle ? (
                <p className="text-[10px] font-medium text-[#1a1208]/45">{activeChat.handle}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClosePanel}
              className="rounded-lg bg-transparent px-2 py-1 text-xl font-medium text-[#1a1208]/45 hover:bg-white/40"
              aria-label="Close messages"
            >
              ×
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {activeChat.messages.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#1a1208]/45">
                Drop a highlight here or type a message
              </p>
            ) : (
              activeChat.messages.map((m) => (
                <div key={m.id}>
                  <p className="mb-1 text-[10px] font-bold text-[#1a1208]/45">{m.sender}</p>
                  <MessageBubble
                    msg={m}
                    onHighlightOpen={onHighlightOpen}
                    onMoodPinOpen={onMoodPinOpen}
                  />
                </div>
              ))
            )}
          </div>

          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border-t border-[color:var(--wf-glass-border-subtle)] px-3 py-3 backdrop-blur-xl backdrop-saturate-150 transition ${
              dropActive
                ? "bg-[rgba(251,191,36,0.16)] ring-2 ring-inset ring-amber-400"
                : "bg-[rgba(255,255,255,0.62)]"
            }`}
          >
            {dropActive ? (
              <p className="mb-2 text-center text-[10px] font-extrabold text-amber-700">
                Drop highlight to send
              </p>
            ) : null}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder="Message…"
                className="min-w-0 flex-1 rounded-full border border-[color:var(--wf-glass-border-subtle)] bg-white/55 px-4 py-2 text-sm font-medium text-[#1a1208] outline-none placeholder:text-[#1a1208]/35"
              />
              <button
                type="button"
                onClick={sendText}
                className="rounded-full bg-[#1a1208] px-3 py-2 text-[11px] font-extrabold text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}

function PanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[color:var(--wf-glass-border-subtle)] bg-[rgba(255,255,255,0.62)] px-3 py-3 backdrop-blur-xl backdrop-saturate-150">
      <h2 className="text-sm font-black text-[#1a1208]">Messages</h2>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg bg-transparent px-2 py-0.5 text-xl font-medium text-[#1a1208]/45 hover:bg-white/40"
        aria-label="Close messages"
      >
        ×
      </button>
    </div>
  )
}

function ChatRow({ chat, onOpen }: { chat: WorkfeedChat; onOpen: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 bg-transparent px-4 py-2.5 text-left transition hover:bg-white/40"
      >
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
          style={{ backgroundColor: chat.avatarBg }}
        >
          {chat.avatar}
        </span>
        <span className="min-w-0 flex-1">
          <p className="font-extrabold text-sm">{chat.title}</p>
          <p className="truncate text-xs font-medium text-[#1a1208]/55">{chat.preview}</p>
        </span>
        {chat.unread > 0 ? (
          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red px-1.5 text-[10px] font-bold text-white shadow-[0_2px_10px_rgba(200,16,46,0.25)]">
            {chat.unread}
          </span>
        ) : null}
      </button>
    </li>
  )
}
