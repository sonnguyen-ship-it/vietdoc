"use client"

import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { WORKFEED_POSTS, WORKFEED_STORIES } from "@/lib/workflow/workfeed/content"
import type { WorkfeedStory, WorkfeedTab } from "@/lib/workflow/workfeed/types"
import { WorkflowMessages } from "@/components/workflow/panels/WorkflowMessages"
import { WorkflowNotifications } from "@/components/workflow/panels/WorkflowNotifications"
import { WorkflowProfile } from "@/components/workflow/panels/WorkflowProfile"
import { WorkflowStories } from "@/components/workflow/panels/WorkflowStories"
import { WorkfeedPostRouter } from "@/components/workflow/posts/WorkfeedPostRouter"
import { WorkflowTabBar } from "@/components/workflow/WorkflowTabBar"

export function WorkflowApp() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<WorkfeedTab>("feed")
  const [feedIndex, setFeedIndex] = useState(0)
  const [story, setStory] = useState<{ stories: WorkfeedStory[]; index: number } | null>(
    null
  )

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

  const openStory = useCallback((s: WorkfeedStory) => {
    const index = WORKFEED_STORIES.findIndex((x) => x.id === s.id)
    setStory({ stories: WORKFEED_STORIES, index: index >= 0 ? index : 0 })
  }, [])

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

      {activeTab === "feed" ? (
        <div
          ref={scrollerRef}
          data-workfeed-vertical
          onScroll={onFeedScroll}
          className="h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-y] [&::-webkit-scrollbar]:hidden"
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

      {activeTab === "notif" ? <WorkflowNotifications onOpenStory={openStory} /> : null}
      {activeTab === "dm" ? <WorkflowMessages /> : null}
      {activeTab === "profile" ? <WorkflowProfile /> : null}

      <WorkflowTabBar activeTab={activeTab} onTabChange={setActiveTab} dark={darkNav} />

      {story ? (
        <WorkflowStories
          stories={story.stories}
          initialIndex={story.index}
          onClose={() => setStory(null)}
        />
      ) : null}
    </div>
  )
}
