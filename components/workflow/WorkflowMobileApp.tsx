"use client"

import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { WORKFEED_POSTS } from "@/lib/workflow/workfeed/content"
import {
  dmThreadIdForRecipient,
  WORKFEED_CURRENT_USER,
} from "@/lib/workflow/workfeed/dmData"
import { buildWorkflowMessagesChats } from "@/lib/workflow/workfeed/messagesData"
import {
  WORKFLOW_CONTENT_HEIGHT,
  WORKFLOW_MOBILE_CHECKLIST_OFFSET,
  WORKFLOW_TAB_BAR_OFFSET,
} from "@/lib/workflow/workfeed/layout"
import type { WorkfeedChat, WorkfeedMoodPin, WorkfeedTab } from "@/lib/workflow/workfeed/types"
import { WorkflowMessages } from "@/components/workflow/panels/WorkflowMessages"
import { WorkflowMoodboard } from "@/components/workflow/panels/WorkflowMoodboard"
import { WorkflowPlan } from "@/components/workflow/panels/WorkflowPlan"
import { WorkfeedPostRouter } from "@/components/workflow/posts/WorkfeedPostRouter"
import { WorkflowFabMenu } from "@/components/workflow/WorkflowFabMenu"
import { WorkflowHighlightFlow } from "@/components/workflow/WorkflowHighlightFlow"
import { WorkflowMinimizedChecklist } from "@/components/workflow/todos/WorkflowMinimizedChecklist"
import { WorkflowQuickNote } from "@/components/workflow/todos/WorkflowQuickNote"
import { WorkflowTodoProvider } from "@/components/workflow/todos/WorkflowTodoContext"
import { WorkflowPlanClipboardProvider } from "@/components/workflow/plan/WorkflowPlanClipboardContext"
import { WorkflowPlanClipboardTray } from "@/components/workflow/plan/WorkflowPlanClipboardTray"
import { WorkflowTabBar } from "@/components/workflow/WorkflowTabBar"

function buildInitialChats(): WorkfeedChat[] {
  return buildWorkflowMessagesChats()
}

export function WorkflowMobileApp() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<WorkfeedTab>("feed")
  const [feedIndex, setFeedIndex] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [fabOpen, setFabOpen] = useState(false)
  const [highlightOpen, setHighlightOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const overlayOpen = highlightOpen || noteOpen
  const [chats, setChats] = useState<WorkfeedChat[]>(buildInitialChats)
  const [openDmChatId, setOpenDmChatId] = useState<string | null>(null)
  const [checklistExpanded, setChecklistExpanded] = useState(false)

  const scrollToPost = useCallback((postId: string) => {
    const idx = WORKFEED_POSTS.findIndex((p) => p.id === postId)
    if (idx < 0) return
    setActiveTab("feed")
    requestAnimationFrame(() => {
      const el = scrollerRef.current
      if (!el) return
      const h = el.clientHeight
      el.scrollTo({ top: idx * h, behavior: "smooth" })
      setFeedIndex(idx)
    })
  }, [])

  const scrollToNextPost = useCallback(() => {
    const next = Math.min(feedIndex + 1, WORKFEED_POSTS.length - 1)
    if (next !== feedIndex) scrollToPost(WORKFEED_POSTS[next].id)
  }, [feedIndex, scrollToPost])

  const scrollToPrevPost = useCallback(() => {
    const prev = Math.max(feedIndex - 1, 0)
    if (prev !== feedIndex) scrollToPost(WORKFEED_POSTS[prev].id)
  }, [feedIndex, scrollToPost])

  const onFeedScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const h = el.clientHeight || 1
    const idx = Math.round(el.scrollTop / h)
    setFeedIndex(Math.min(Math.max(idx, 0), WORKFEED_POSTS.length - 1))
  }, [])

  const onPostToFeed = useCallback((pin: WorkfeedMoodPin, projectName: string) => {
    setToast(`Posted “${pin.title}” to team Feed · ${projectName}`)
    setActiveTab("feed")
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const onShareMoodPin = useCallback(
    (pin: WorkfeedMoodPin, recipient: { id: string; name: string }) => {
      const threadId = dmThreadIdForRecipient(recipient.id)
      const now = new Date().toLocaleTimeString("vi-VN", {
        hour: "numeric",
        minute: "2-digit",
      })

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== threadId) return chat
          const msg = {
            id: `pin-${Date.now()}`,
            sender: WORKFEED_CURRENT_USER,
            kind: "mood-pin" as const,
            text: `Shared: ${pin.title}`,
            align: "right" as const,
            moodPin: { id: pin.id, title: pin.title, gradient: pin.gradient, brand: pin.brand },
          }
          return {
            ...chat,
            messages: [...chat.messages, msg],
            preview: `▣ ${pin.title}`,
            time: now,
          }
        })
      )

      setActiveTab("dm")
      setOpenDmChatId(threadId)
      setToast(`Shared to ${recipient.name}`)
      window.setTimeout(() => setToast(null), 2800)
    },
    []
  )

  const onHighlightSend = useCallback(
    (payload: {
      recipient: { id: string; name: string }
      text: string
      highlightPath: string
    }) => {
      const threadId = dmThreadIdForRecipient(payload.recipient.id)
      const now = new Date().toLocaleTimeString("vi-VN", {
        hour: "numeric",
        minute: "2-digit",
      })

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== threadId) return chat
          const msg = {
            id: `hl-${Date.now()}`,
            sender: WORKFEED_CURRENT_USER,
            kind: "highlight" as const,
            text: payload.text,
            align: "right" as const,
            highlightPath: payload.highlightPath,
          }
          return {
            ...chat,
            messages: [...chat.messages, msg],
            preview: payload.text,
            time: now,
          }
        })
      )

      setHighlightOpen(false)
      setFabOpen(false)
      setActiveTab("dm")
      setOpenDmChatId(threadId)
      setToast(`Sent to ${payload.recipient.name}`)
      window.setTimeout(() => setToast(null), 2800)
    },
    []
  )

  const activePost = WORKFEED_POSTS[feedIndex]
  const darkNav = activeTab === "feed" && activePost?.kind === "video-brief"
  const feedMode = activeTab === "feed"

  const showPlanTray =
    activeTab === "plan" || activeTab === "moodboard"

  return (
    <WorkflowTodoProvider>
    <WorkflowPlanClipboardProvider>
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[color:var(--wf-surface)]">
      {/* Mobile top chrome (glass) */}
      <header
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center px-3 pt-[max(0.5rem,env(safe-area-inset-top))] ${
          darkNav ? "bg-black/55 text-white" : "bg-[rgba(255,255,255,0.72)] text-[#1a1208]"
        } backdrop-blur-xl backdrop-saturate-150`}
      >
        <Link
          href="/"
          className={`pointer-events-auto inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
            darkNav ? "bg-white/10 text-white/90" : "wf-glass-thin text-[#1a1208]/70"
          }`}
        >
          ← VietDoc
        </Link>
      </header>

      <div
        className="absolute inset-x-0 z-0 overflow-hidden"
        style={{
          top: feedMode ? 0 : 0,
          bottom: WORKFLOW_TAB_BAR_OFFSET,
          minHeight: WORKFLOW_CONTENT_HEIGHT,
        }}
      >
        {activeTab === "feed" ? (
          <div
            ref={scrollerRef}
            data-workfeed-vertical
            onScroll={onFeedScroll}
            className="h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>article]:snap-start"
            style={{ paddingTop: WORKFLOW_MOBILE_CHECKLIST_OFFSET }}
          >
            {WORKFEED_POSTS.map((post, index) => (
              <WorkfeedPostRouter
                key={post.id}
                post={post}
                onScrollUp={scrollToPrevPost}
                onScrollDown={scrollToNextPost}
                canScrollUp={index > 0}
                canScrollDown={index < WORKFEED_POSTS.length - 1}
                onOpenPost={scrollToPost}
              />
            ))}
          </div>
        ) : null}

        {activeTab === "plan" ? <WorkflowPlan /> : null}
        {activeTab === "dm" ? (
          <WorkflowMessages
            chats={chats}
            openChatId={openDmChatId}
            onOpenChatHandled={() => setOpenDmChatId(null)}
            onOpenMoodPin={() => {
              setActiveTab("moodboard")
              setToast("Opened on Board")
              window.setTimeout(() => setToast(null), 1800)
            }}
          />
        ) : null}
        {activeTab === "moodboard" ? (
          <WorkflowMoodboard onPostToFeed={onPostToFeed} onShareToInbox={onShareMoodPin} />
        ) : null}
      </div>

      {/* Mobile checklist (expanded panel) */}
      {feedMode ? (
        <div className="pointer-events-auto absolute inset-x-0 top-0 z-[35] pt-[max(0.35rem,env(safe-area-inset-top))]">
          <WorkflowMinimizedChecklist
            variant="mobile"
            mobileHideMinimized
            expanded={checklistExpanded}
            onExpand={() => setChecklistExpanded(true)}
            onCollapse={() => setChecklistExpanded(false)}
          />
        </div>
      ) : null}

      {fabOpen && !overlayOpen ? (
        <button
          type="button"
          className="absolute inset-x-0 top-0 z-40 bg-black/25"
          style={{ bottom: WORKFLOW_TAB_BAR_OFFSET }}
          aria-label="Close menu"
          onClick={() => setFabOpen(false)}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50">
        {showPlanTray ? (
          <div className="mb-14 flex justify-center">
            <WorkflowPlanClipboardTray variant="mobile" />
          </div>
        ) : null}
        <WorkflowTabBar activeTab={activeTab} onTabChange={setActiveTab} dark={darkNav} />
        {!overlayOpen ? (
          <WorkflowFabMenu
            open={fabOpen}
            onToggle={() => setFabOpen((v) => !v)}
            onHighlight={() => {
              setFabOpen(false)
              setHighlightOpen(true)
            }}
            onNote={() => {
              setFabOpen(false)
              setNoteOpen(true)
            }}
          />
        ) : null}
      </div>

      {/* Floating minimized checklist button (square) */}
      {feedMode && !checklistExpanded && !overlayOpen ? (
        <button
          type="button"
          onClick={() => setChecklistExpanded(true)}
          className="pointer-events-auto absolute z-[55] flex h-11 w-11 items-center justify-center rounded-[12px] border border-[color:var(--wf-glass-border)] bg-[rgba(255,255,255,0.72)] text-[13px] font-black text-[#1a1208] shadow-[0_10px_28px_rgba(0,0,0,0.16)] backdrop-blur-2xl backdrop-saturate-150"
          style={{
            right: 14,
            bottom: `calc(${WORKFLOW_TAB_BAR_OFFSET}px + 12px)`,
          }}
          aria-label="Open checklist"
        >
          ✓
        </button>
      ) : null}

      {highlightOpen ? (
        <WorkflowHighlightFlow
          mode="mobile"
          onClose={() => setHighlightOpen(false)}
          onSend={onHighlightSend}
        />
      ) : null}

      {noteOpen ? (
        <WorkflowQuickNote variant="mobile" onClose={() => setNoteOpen(false)} />
      ) : null}

      {toast ? (
        <div
          className="pointer-events-none absolute inset-x-4 z-[70] rounded-xl bg-[#1a1208]/92 px-4 py-3 text-center text-xs font-semibold text-white shadow-lg"
          style={{ top: feedMode ? WORKFLOW_MOBILE_CHECKLIST_OFFSET : "max(3.5rem, env(safe-area-inset-top))" }}
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </div>
    </WorkflowPlanClipboardProvider>
    </WorkflowTodoProvider>
  )
}

export default WorkflowMobileApp
