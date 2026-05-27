"use client"

import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { WORKFEED_POSTS } from "@/lib/workflow/workfeed/content"
import { dmThreadIdForRecipient, WORKFEED_CURRENT_USER } from "@/lib/workflow/workfeed/dmData"
import { buildWorkflowMessagesChats } from "@/lib/workflow/workfeed/messagesData"
import { desktopTabSurface } from "@/lib/workflow/workfeed/desktopTabs"
import {
  WORKFLOW_MESSAGES_PANEL_DEFAULT,
  WORKFLOW_MESSAGES_PANEL_MAX,
  WORKFLOW_MESSAGES_PANEL_MIN,
} from "@/lib/workflow/workfeed/messagesPanelLayout"
import type { WorkfeedHighlightDragPayload, WorkfeedHighlightRef, WorkfeedMainTab } from "@/lib/workflow/workfeed/highlightRef"
import { PLAN_HIGHLIGHT_COLUMN, WORKFEED_PLAN_SHEETS } from "@/lib/workflow/workfeed/planData"
import type { WorkfeedChat, WorkfeedMoodPin } from "@/lib/workflow/workfeed/types"
import { useResizablePanel } from "@/lib/workflow/useResizablePanel"
import { FeedGlassLetterbox } from "@/components/workflow/desktop/FeedGlassLetterbox"
import { WorkflowHighlightOverlay } from "@/components/workflow/desktop/WorkflowHighlightOverlay"
import { WorkflowDesktopNav } from "@/components/workflow/desktop/WorkflowDesktopNav"
import { WorkflowMessagesPanel } from "@/components/workflow/desktop/WorkflowMessagesPanel"
import { WorkflowMessagesRail } from "@/components/workflow/desktop/WorkflowMessagesRail"
import { WorkflowMessagesResizeHandle } from "@/components/workflow/desktop/WorkflowMessagesResizeHandle"
import { WorkflowPendingHighlight } from "@/components/workflow/desktop/WorkflowPendingHighlight"
import { WorkflowMoodboard } from "@/components/workflow/panels/WorkflowMoodboard"
import { WorkflowPlan } from "@/components/workflow/panels/WorkflowPlan"
import { WorkfeedPostRouter } from "@/components/workflow/posts/WorkfeedPostRouter"
import { WorkflowDesktopGlassToolbar } from "@/components/workflow/desktop/WorkflowDesktopGlassToolbar"
import { WorkflowHighlightFlow } from "@/components/workflow/WorkflowHighlightFlow"
import { WorkflowPlanClipboardProvider } from "@/components/workflow/plan/WorkflowPlanClipboardContext"
import { WorkflowQuickNote } from "@/components/workflow/todos/WorkflowQuickNote"
import { WorkflowTodoProvider } from "@/components/workflow/todos/WorkflowTodoContext"

const MESSAGES_MIN = WORKFLOW_MESSAGES_PANEL_MIN
const MESSAGES_MAX = WORKFLOW_MESSAGES_PANEL_MAX
const MESSAGES_DEFAULT = WORKFLOW_MESSAGES_PANEL_DEFAULT

function buildInitialChats(): WorkfeedChat[] {
  return buildWorkflowMessagesChats()
}

export function WorkflowDesktopApp() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [mainTab, setMainTab] = useState<WorkfeedMainTab>("feed")
  const [messagesOpen, setMessagesOpen] = useState(false)
  const [feedIndex, setFeedIndex] = useState(0)
  const [chats, setChats] = useState<WorkfeedChat[]>(buildInitialChats)
  const [activeChatId, setActiveChatId] = useState<string | null>("dm-my")
  const [highlightOpen, setHighlightOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [pendingHighlight, setPendingHighlight] = useState<WorkfeedHighlightDragPayload | null>(null)
  const [viewingHighlight, setViewingHighlight] = useState<WorkfeedHighlightRef | null>(null)
  const [planFocus, setPlanFocus] = useState<{ row: number; col: number } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [checklistExpanded, setChecklistExpanded] = useState(false)

  const { width: messagesWidth, onResizePointerDown } = useResizablePanel({
    initialWidth: MESSAGES_DEFAULT,
    minWidth: MESSAGES_MIN,
    maxWidth: MESSAGES_MAX,
  })

  const scrollToPost = useCallback((postId: string) => {
    const idx = WORKFEED_POSTS.findIndex((p) => p.id === postId)
    if (idx < 0) return
    setMainTab("feed")
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

  const getHighlightContext = useCallback((): Omit<
    WorkfeedHighlightRef,
    "id" | "pathD" | "snapshotDataUrl" | "label"
  > => {
    const sheet = WORKFEED_PLAN_SHEETS[0]
    const week3Col = sheet.columns.indexOf(PLAN_HIGHLIGHT_COLUMN)

    if (mainTab === "feed") {
      const post = WORKFEED_POSTS[feedIndex]
      return { mainTab: "feed", postId: post?.id }
    }
    if (mainTab === "plan") {
      return {
        mainTab: "plan",
        sheetId: sheet.id,
        planRow: planFocus?.row ?? 0,
        planCol: planFocus?.col ?? week3Col,
      }
    }
    return { mainTab: "moodboard" }
  }, [mainTab, feedIndex, planFocus])

  const navigateToHighlight = useCallback(
    (ref: WorkfeedHighlightRef) => {
      setViewingHighlight(ref)
      setMainTab(ref.mainTab)
      if (ref.mainTab === "feed" && ref.postId) {
        scrollToPost(ref.postId)
      }
      if (ref.mainTab === "plan" && ref.planRow != null) {
        const col = ref.planCol ?? WORKFEED_PLAN_SHEETS[0].columns.indexOf(PLAN_HIGHLIGHT_COLUMN)
        setPlanFocus({ row: ref.planRow, col })
      }
      setMessagesOpen(true)
    },
    [scrollToPost]
  )

  const dismissHighlightView = () => {
    setViewingHighlight(null)
    setPlanFocus(null)
  }

  const removeHighlightView = () => {
    setViewingHighlight(null)
    setToast("Highlight removed from view")
    window.setTimeout(() => setToast(null), 2400)
  }

  const onPostToFeed = useCallback((pin: WorkfeedMoodPin, projectName: string) => {
    setToast(`Posted “${pin.title}” to team Feed · ${projectName}`)
    setMainTab("feed")
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
      setMessagesOpen(true)
      setActiveChatId(threadId)
      setToast(`Shared to ${recipient.name}`)
      window.setTimeout(() => setToast(null), 2800)
    },
    []
  )

  const openMoodPin = useCallback((pinId: string) => {
    setMainTab("moodboard")
    setToast(`Opened pin ${pinId}`)
    window.setTimeout(() => setToast(null), 1800)
  }, [])

  const onPostStub = useCallback(() => {
    setToast("Post — coming soon")
    window.setTimeout(() => setToast(null), 2400)
  }, [])

  const unreadTotal = chats.reduce((n, c) => n + c.unread, 0)

  return (
    <WorkflowTodoProvider>
    <WorkflowPlanClipboardProvider>
    <div className="wf-desktop-root relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[color:var(--wf-surface)]">
      {/* Ambient blobs behind chrome */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="wf-blob wf-blob-violet left-[8%] top-[18%] h-64 w-64" />
        <div className="wf-blob wf-blob-cyan right-[12%] top-[8%] h-56 w-56" />
        <div className="wf-blob wf-blob-lime left-[22%] bottom-[12%] h-48 w-48" />
        <div className="wf-blob wf-blob-coral right-[18%] bottom-[20%] h-52 w-52" />
      </div>

      <Link
        href="/"
        className="wf-glass-heavy fixed bottom-4 left-4 z-[60] rounded-[20px] px-3 py-1.5 text-xs font-medium text-[color:var(--wf-ink)] transition hover:bg-[rgba(255,255,255,0.85)]"
      >
        ← VietDoc
      </Link>

      <WorkflowDesktopNav
        mainTab={mainTab}
        onMainTabChange={(tab) => {
          setMainTab(tab)
          setViewingHighlight(null)
        }}
        checklistExpanded={checklistExpanded}
        onChecklistExpand={() => setChecklistExpanded(true)}
        onChecklistCollapse={() => setChecklistExpanded(false)}
      />

      <div className="flex min-h-0 flex-1">
        <main className="relative flex min-w-0 flex-1 flex-col">
          <div className={`relative min-h-0 flex-1 overflow-hidden ${desktopTabSurface(mainTab)}`}>
            {mainTab === "feed" ? (
              <FeedGlassLetterbox ref={scrollerRef} onScroll={onFeedScroll}>
                {WORKFEED_POSTS.map((post, index) => (
                  <WorkfeedPostRouter
                    key={post.id}
                    post={post}
                    layout="desktop"
                    onScrollUp={scrollToPrevPost}
                    onScrollDown={scrollToNextPost}
                    canScrollUp={index > 0}
                    canScrollDown={index < WORKFEED_POSTS.length - 1}
                    onOpenPost={scrollToPost}
                  />
                ))}
              </FeedGlassLetterbox>
            ) : null}

            {mainTab === "plan" ? (
              <WorkflowPlan desktop focusCell={planFocus} />
            ) : null}
            {mainTab === "moodboard" ? (
              <WorkflowMoodboard
                desktop
                onPostToFeed={onPostToFeed}
                onShareToInbox={onShareMoodPin}
              />
            ) : null}

            {viewingHighlight ? (
              <WorkflowHighlightOverlay
                highlight={viewingHighlight}
                onDismiss={dismissHighlightView}
                onRemove={removeHighlightView}
              />
            ) : null}

            {pendingHighlight ? (
              <WorkflowPendingHighlight
                payload={pendingHighlight}
                onDiscard={() => setPendingHighlight(null)}
              />
            ) : null}

            {highlightOpen ? (
              <WorkflowHighlightFlow
                mode="desktop"
                getContext={getHighlightContext}
                onClose={() => setHighlightOpen(false)}
                onSend={(payload) => {
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
                        highlightRef: payload.highlightRef,
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
                  setMessagesOpen(true)
                  setActiveChatId(threadId)
                  setToast(`Sent to ${payload.recipient.name}`)
                  window.setTimeout(() => setToast(null), 2800)
                }}
                onReady={(payload) => {
                  setPendingHighlight(payload)
                  setHighlightOpen(false)
                  setMessagesOpen(true)
                  setToast("Drag the highlight into a chat →")
                  window.setTimeout(() => setToast(null), 3200)
                }}
              />
            ) : null}

            {noteOpen ? (
              <WorkflowQuickNote variant="desktop" onClose={() => setNoteOpen(false)} />
            ) : null}

          </div>

          <WorkflowDesktopGlassToolbar
            onPost={onPostStub}
            onHighlight={() => {
              setHighlightOpen(true)
            }}
            onTask={() => {
              setNoteOpen(true)
            }}
          />
        </main>

        {messagesOpen ? (
          <>
            <WorkflowMessagesResizeHandle onPointerDown={onResizePointerDown} />
            <div
              style={{ width: messagesWidth }}
              className="wf-glass-heavy flex h-full shrink-0 flex-col overflow-hidden border border-[color:var(--wf-glass-border)] border-r-0 shadow-[-8px_0_24px_rgba(0,0,0,0.06)]"
            >
              <WorkflowMessagesPanel
                chats={chats}
                onChatsChange={(fn) => setChats(fn)}
                activeChatId={activeChatId}
                onActiveChatChange={setActiveChatId}
                onHighlightOpen={navigateToHighlight}
                onMoodPinOpen={openMoodPin}
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
      />

      {toast ? (
        <div
          className="pointer-events-none fixed left-1/2 top-20 z-[80] -translate-x-1/2 rounded-xl bg-[#1a1208]/92 px-4 py-2.5 text-center text-xs font-semibold text-white shadow-lg"
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

export default WorkflowDesktopApp
