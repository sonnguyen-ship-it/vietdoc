"use client"

import { useState } from "react"
import { WORKFEED_CHATS } from "@/lib/workflow/workfeed/content"
import type { WorkfeedChat, WorkfeedChatMessage } from "@/lib/workflow/workfeed/types"

function MessageBubble({ msg }: { msg: WorkfeedChatMessage }) {
  const isRight = msg.align === "right"
  const base = `max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
    isRight ? "ml-auto bg-blue text-white" : "mr-auto bg-[#f5f0e4] text-[#1a1208]"
  }`

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
        <span className="font-extrabold">{chat.title}</span>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {chat.messages.map((m) => (
          <div key={m.id}>
            <p className="mb-1 text-[10px] font-bold text-[#1a1208]/45">{m.sender}</p>
            <MessageBubble msg={m} />
          </div>
        ))}
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
        <button type="button" className="bg-transparent p-2 text-lg" aria-label="Photo">
          🖼
        </button>
        <button type="button" className="bg-transparent px-2 text-sm font-extrabold text-blue">
          Send
        </button>
      </div>
    </div>
  )
}

export function WorkflowMessages() {
  const [activeChat, setActiveChat] = useState<WorkfeedChat | null>(null)

  if (activeChat) {
    return <ChatThread chat={activeChat} onBack={() => setActiveChat(null)} />
  }

  return (
    <div className="h-full overflow-y-auto bg-white pt-14 pb-24 text-[#1a1208]">
      <h1 className="px-4 text-lg font-black">Messages</h1>
      <ul className="mt-4">
        {WORKFEED_CHATS.map((chat) => (
          <li key={chat.id}>
            <button
              type="button"
              onClick={() => setActiveChat(chat)}
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
                <span className="text-[#1a1208]/45">{chat.time}</span>
                {chat.unread > 0 ? (
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red px-1.5 text-[10px] text-white">
                    {chat.unread}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
