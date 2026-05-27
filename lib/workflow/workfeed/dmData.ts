import { buildHighlightRef } from "@/lib/workflow/workfeed/highlightRef"
import type { WorkfeedChat, WorkfeedDmRecipient } from "@/lib/workflow/workfeed/types"

export const WORKFEED_CURRENT_USER = "employee2"

export const WORKFEED_DM_RECIPIENTS: WorkfeedDmRecipient[] = [
  { id: "boss", name: "boss", handle: "@boss", initials: "BS", avatarBg: "#1a1208" },
  { id: "my", name: "my", handle: "@my", initials: "MY", avatarBg: "#7c3aed" },
  { id: "dung", name: "dung", handle: "@dung", initials: "DU", avatarBg: "#059669" },
  { id: "ductran", name: "ductran", handle: "@ductran", initials: "DT", avatarBg: "#0ea5e9" },
]

export const WORKFEED_DIRECT_THREADS: WorkfeedChat[] = [
  {
    id: "dm-my",
    kind: "direct",
    title: "my",
    handle: "@my",
    avatar: "MY",
    avatarBg: "#7c3aed",
    preview: "assets có chưa e?",
    time: "10:02",
    unread: 0,
    messages: [
      {
        id: "hl-demo-my",
        sender: WORKFEED_CURRENT_USER,
        kind: "highlight",
        text: "assets có chưa e?",
        align: "right",
        highlightPath: "M 120 80 L 140 90 L 160 85 L 180 95",
        highlightRef: buildHighlightRef({
          mainTab: "plan",
          sheetId: "plan-client-a",
          planRow: 0,
          planCol: 3,
          pathD: "M 120 80 L 140 90 L 160 85 L 180 95",
          label: "Week 3 · @hienvuive KOC live",
        }),
      },
    ],
  },
  {
    id: "dm-boss",
    kind: "direct",
    title: "boss",
    handle: "@boss",
    avatar: "BS",
    avatarBg: "#1a1208",
    preview: "Tap to message",
    time: "",
    unread: 0,
    messages: [],
  },
  {
    id: "dm-dung",
    kind: "direct",
    title: "dung",
    handle: "@dung",
    avatar: "DU",
    avatarBg: "#059669",
    preview: "Tap to message",
    time: "",
    unread: 0,
    messages: [],
  },
  {
    id: "dm-ductran",
    kind: "direct",
    title: "ductran",
    handle: "@ductran",
    avatar: "DT",
    avatarBg: "#0ea5e9",
    preview: "Tap to message",
    time: "",
    unread: 0,
    messages: [],
  },
]

export function dmThreadIdForRecipient(recipientId: string): string {
  return `dm-${recipientId}`
}
