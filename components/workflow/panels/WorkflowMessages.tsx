"use client"

import { useEffect, useState } from "react"
import type { WorkfeedChat, WorkfeedChatMessage } from "@/lib/workflow/workfeed/types"

function MessageBubble({ msg }: { msg: WorkfeedChatMessage }) {
  const isRight = msg.align === "right"
  const base = `max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
    isRight ? "ml-auto bg-blue text-white" : "mr-auto bg-[#f5f0e4] text-[#1a1208]"
  }`

  if (msg.kind === "highlight") {
    return (
      <div className={base}>
        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-200">
          ◎ Highlight
        </p>
        <p className="font-medium">{msg.text}</p>
      </div>
    )
  }

  if (msg.kind === "table" && msg.table) {
    return (
      <div className={base}>
        <div className="overflow-x-auto rounded-lg bg-white/90 p-2 text-[10px] font-bold text-[#1a1208]">
          <div className="flex gap-2">
            {msg.table.headers.map((h) => (
              <span key={h} className="min-w-[4.5rem]">
                {h}
              </span>
            ))}
          </div>
        </div>
        {msg.text ? <p className="mt-2 font-medium">{msg.text}</p> : null}
      </div>
    )
  }

  if (msg.kind === "list-card" && msg.listCard) {
    return (
      <div className={base}>
        <ul className="space-y-1 font-semibold">
          {msg.listCard.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs opacity-80">{msg.listCard.caption}</p>
      </div>
    )
  }

  return <div className={base}>{msg.text}</div>
}

function ChatThread({ chat, onBack }: { chat: WorkfeedChat; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col bg-white pt-12 text-[#1a1208]">
      <header className="flex items-center gap-2 border-b border-black/10 px-3 py-2">
        <button type="button" onClick={onBack} className="bg-transparent p-1 text-lg">
          ←
        </button>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold text-white"
          style={{ backgroundColor: chat.avatarBg }}
        >
          {chat.avatar}
        </span>
        <div>
          <span className="block font-extrabold">{chat.title}</span>
          {chat.handle ? (
            <span className="block text-[10px] font-semibold text-[#1a1208]/45">{chat.handle}</span>
          ) : null}
        </div>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {chat.messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#1a1208]/45">No messages yet</p>
        ) : (
          chat.messages.map((m) => (
            <div key={m.id}>
              <p className="mb-1 text-[10px] font-bold text-[#1a1208]/45">{m.sender}</p>
              <MessageBubble msg={m} />
            </div>
          ))
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-black/10 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button type="button" className="bg-transparent p-2 text-lg" aria-label="Camera">
          📷
        </button>
        <input
          type="text"
          placeholder="Message…"
          className="min-w-0 flex-1 rounded-full border-0 bg-[#f5f0e4] px-4 py-2 text-sm outline-none"
        />
        <button type="button" className="bg-transparent px-2 text-sm font-extrabold text-blue">
          Send
        </button>
      </div>
    </div>
  )
}

type WorkflowMessagesProps = {
  chats: WorkfeedChat[]
  openChatId?: string | null
  onOpenChatHandled?: () => void
}

export function WorkflowMessages({ chats, openChatId, onOpenChatHandled }: WorkflowMessagesProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null

  const directChats = chats.filter((c) => c.kind === "direct")
  const groupChats = chats.filter((c) => c.kind !== "direct")

  useEffect(() => {
    if (!openChatId) return
    setActiveChatId(openChatId)
    onOpenChatHandled?.()
  }, [openChatId, onOpenChatHandled])

  if (activeChat) {
    return <ChatThread chat={activeChat} onBack={() => setActiveChatId(null)} />
  }

  return (
    <div className="h-full overflow-y-auto bg-white pt-14 pb-28 text-[#1a1208]">
      <h1 className="px-4 text-lg font-black">Messages</h1>

      {directChats.length > 0 ? (
        <section className="mt-4">
          <p className="px-4 text-[10px] font-extrabold uppercase tracking-wide text-[#1a1208]/45">
            Direct
          </p>
          <ul>
            {directChats.map((chat) => (
              <li key={chat.id}>
                <ChatListRow chat={chat} onOpen={() => setActiveChatId(chat.id)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {groupChats.length > 0 ? (
        <section className="mt-4">
          <p className="px-4 text-[10px] font-extrabold uppercase tracking-wide text-[#1a1208]/45">
            Groups
          </p>
          <ul>
            {groupChats.map((chat) => (
              <li key={chat.id}>
                <ChatListRow chat={chat} onOpen={() => setActiveChatId(chat.id)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

function ChatListRow({ chat, onOpen }: { chat: WorkfeedChat; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-left"
    >
      <span
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
        style={{ backgroundColor: chat.avatarBg }}
      >
        {chat.avatar}
      </span>
      <span className="min-w-0 flex-1">
        <p className="font-extrabold">{chat.title}</p>
        <p className="truncate text-sm font-medium text-[#1a1208]/55">{chat.preview}</p>
      </span>
      <span className="flex flex-col items-end gap-1 text-[11px] font-bold">
        <span className="text-[#1a1208]/45">{chat.time || " "}</span>
        {chat.unread > 0 ? (
          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red px-1.5 text-[10px] text-white">
            {chat.unread}
          </span>
        ) : null}
      </span>
    </button>
  )
}
