"use client"

import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { WORKFEED_CHATS, WORKFEED_POSTS } from "@/lib/workflow/workfeed/content"
import {
  dmThreadIdForRecipient,
  WORKFEED_CURRENT_USER,
  WORKFEED_DIRECT_THREADS,
} from "@/lib/workflow/workfeed/dmData"
import { WORKFLOW_TAB_BAR_OFFSET } from "@/lib/workflow/workfeed/layout"
import type { WorkfeedChat, WorkfeedMoodPin, WorkfeedTab } from "@/lib/workflow/workfeed/types"
import { WorkflowMessages } from "@/components/workflow/panels/WorkflowMessages"
import { WorkflowMoodboard } from "@/components/workflow/panels/WorkflowMoodboard"
import { WorkflowPlan } from "@/components/workflow/panels/WorkflowPlan"
import { WorkfeedPostRouter } from "@/components/workflow/posts/WorkfeedPostRouter"
import { WorkflowFabMenu } from "@/components/workflow/WorkflowFabMenu"
import { WorkflowHighlightFlow } from "@/components/workflow/WorkflowHighlightFlow"
import { WorkflowNoteEditor } from "@/components/workflow/WorkflowNoteEditor"
import { WorkflowTabBar } from "@/components/workflow/WorkflowTabBar"

function buildInitialChats(): WorkfeedChat[] {
  return [...WORKFEED_CHATS, ...WORKFEED_DIRECT_THREADS]
}

export function WorkflowApp() {
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

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <header
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-3 pt-[max(0.5rem,env(safe-area-inset-top))] ${
          feedMode ? "" : "bg-white/90"
        }`}
      >
        <Link
          href="/"
          className={`pointer-events-auto rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
            feedMode
              ? "bg-black/40 text-white/90"
              : "bg-[#f5f0e4] text-[#1a1208]"
          }`}
        >
          ← VietDoc
        </Link>
        <span
          className={`pointer-events-auto font-display text-sm font-semibold tracking-tight ${
            feedMode ? "text-white drop-shadow-sm" : "text-[#1a1208]"
          }`}
        >
          Workflow
        </span>
        <div className="w-[4.5rem]" aria-hidden />
      </header>

      <div
        className="absolute inset-x-0 top-0 z-0 overflow-hidden"
        style={{ bottom: WORKFLOW_TAB_BAR_OFFSET }}
      >
        {activeTab === "feed" ? (
          <div
            ref={scrollerRef}
            data-workfeed-vertical
            onScroll={onFeedScroll}
            className="h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
          />
        ) : null}
        {activeTab === "moodboard" ? <WorkflowMoodboard onPostToFeed={onPostToFeed} /> : null}
      </div>

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

      {highlightOpen ? (
        <WorkflowHighlightFlow
          onClose={() => setHighlightOpen(false)}
          onSend={onHighlightSend}
        />
      ) : null}

      {noteOpen ? <WorkflowNoteEditor onClose={() => setNoteOpen(false)} /> : null}

      {toast ? (
        <div
          className="pointer-events-none absolute inset-x-4 top-[max(3.5rem,env(safe-area-inset-top))] z-[70] rounded-xl bg-[#1a1208]/92 px-4 py-3 text-center text-xs font-semibold text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </div>
  )
}
