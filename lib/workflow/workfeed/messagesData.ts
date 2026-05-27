import { WORKFEED_CHATS } from "@/lib/workflow/workfeed/content"
import { WORKFEED_CLIENT_CHAT } from "@/lib/workflow/workfeed/clientChatData"
import { WORKFEED_DIRECT_THREADS } from "@/lib/workflow/workfeed/dmData"
import type { WorkfeedChat } from "@/lib/workflow/workfeed/types"

export function buildWorkflowMessagesChats(): WorkfeedChat[] {
  return [WORKFEED_CLIENT_CHAT, ...WORKFEED_CHATS, ...WORKFEED_DIRECT_THREADS]
}
