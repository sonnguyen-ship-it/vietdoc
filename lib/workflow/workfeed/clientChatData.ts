import type { WorkfeedChat } from "@/lib/workflow/workfeed/types"

export const WORKFEED_CLIENT_CHAT_ID = "chat-client-a"

/** External client thread — pinned above team DMs in Messages. */
export const WORKFEED_CLIENT_CHAT: WorkfeedChat = {
  id: WORKFEED_CLIENT_CHAT_ID,
  kind: "client",
  title: "Client A",
  handle: "KOC Campaign · approval",
  avatar: "CA",
  avatarBg: "#ea580c",
  preview: "Can we see 3 hook options for this ad?",
  time: "10:21",
  unread: 2,
  messages: [
    {
      id: "cl-1",
      sender: "Client A",
      kind: "text",
      align: "left",
      text: "Can we see 3 hook options for this ad?",
    },
    {
      id: "cl-2",
      sender: "Client A",
      kind: "text",
      align: "left",
      text: "Please confirm final script before shooting.",
    },
    {
      id: "cl-3",
      sender: "Client A",
      kind: "text",
      align: "left",
      text: "Also — can you share the Week 3 plan board before Friday?",
    },
  ],
}
