"use client"

import { useCallback, useEffect, useState } from "react"
import type { WorkfeedStory } from "@/lib/workflow/workfeed/types"

type WorkflowStoriesProps = {
  stories: WorkfeedStory[]
  initialIndex?: number
  onClose: () => void
}

export function WorkflowStories({ stories, initialIndex = 0, onClose }: WorkflowStoriesProps) {
  const [index, setIndex] = useState(initialIndex)
  const [progress, setProgress] = useState(0)
  const story = stories[index]

  const next = useCallback(() => {
    setProgress(0)
    if (index < stories.length - 1) setIndex((i) => i + 1)
    else onClose()
  }, [index, stories.length, onClose])

  const prev = useCallback(() => {
    setProgress(0)
    if (index > 0) setIndex((i) => i - 1)
  }, [index])

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next()
          return 0
        }
        return p + 2.5
      })
    }, 100)
    return () => clearInterval(tick)
  }, [index, next])

  if (!story) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black">
      <div className="flex gap-1 px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        {stories.map((_, i) => (
          <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full bg-white transition-all"
              style={{
                width: i < index ? "100%" : i === index ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-10 z-10 bg-transparent p-2 text-2xl text-white"
        aria-label="Close story"
      >
        ×
      </button>

      <div
        className="relative flex flex-1 flex-col justify-end px-5 pb-24 pt-16"
        style={{ background: story.background }}
      >
        <button type="button" className="absolute inset-y-0 left-0 w-1/2" onClick={prev} aria-label="Previous" />
        <button type="button" className="absolute inset-y-0 right-0 w-1/2" onClick={next} aria-label="Next" />

        <span className={`mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-extrabold ${story.badgeClass}`}>
          {story.badge}
        </span>
        <p className="max-w-sm text-lg font-semibold leading-relaxed text-white">{story.text}</p>
        {story.viewers ? (
          <p className="mt-4 text-xs font-bold text-white/60">{story.viewers}</p>
        ) : null}
      </div>

      <div className="border-t border-white/10 bg-black/80 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <input
          type="text"
          placeholder="Reply to story…"
          className="w-full rounded-full border-0 bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-white/40"
        />
      </div>
    </div>
  )
}
