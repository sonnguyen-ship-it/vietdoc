"use client"

import {
  WORKFEED_NOTIFICATIONS,
  WORKFEED_STORIES,
} from "@/lib/workflow/workfeed/content"
import type { WorkfeedStory } from "@/lib/workflow/workfeed/types"

type WorkflowNotificationsProps = {
  onOpenStory: (story: WorkfeedStory) => void
}

export function WorkflowNotifications({ onOpenStory }: WorkflowNotificationsProps) {
  const storyRings = WORKFEED_NOTIFICATIONS.filter((n) => n.kind === "story")
  const activities = WORKFEED_NOTIFICATIONS.filter((n) => n.kind !== "story")

  return (
    <div className="h-full overflow-y-auto bg-white pt-14 pb-24 text-[#1a1208]">
      <h1 className="px-4 text-lg font-black">Notifications</h1>

      <section className="mt-4 px-4">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/50">
          Stories đang chờ
        </p>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
          {storyRings.map((n) => {
            const story = WORKFEED_STORIES.find((s) => s.id === n.storyId)
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => story && onOpenStory(story)}
                className="flex flex-shrink-0 flex-col items-center gap-1 bg-transparent p-0"
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full p-[3px]"
                  style={{
                    background: `linear-gradient(135deg, #7c3aed, #f59e0b, #ec4899)`,
                  }}
                >
                  <span
                    className="flex h-full w-full items-center justify-center rounded-full text-xs font-extrabold text-white"
                    style={{ backgroundColor: n.avatarBg }}
                  >
                    {n.initials}
                  </span>
                </span>
                <span className="text-xs font-bold">{n.author}</span>
              </button>
            )
          })}
        </div>
      </section>

      <ul className="mt-2 divide-y divide-black/5">
        {activities.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-left"
              onClick={() => {
                if (n.storyId) {
                  const story = WORKFEED_STORIES.find((s) => s.id === n.storyId)
                  if (story) onOpenStory(story)
                }
              }}
            >
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                style={{ backgroundColor: n.avatarBg }}
              >
                {n.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-extrabold">{n.author}</span>{" "}
                <span className="font-medium">{n.text}</span>
              </span>
              <span className="flex flex-shrink-0 flex-col items-end text-[11px] font-bold text-[#1a1208]/45">
                <span>{n.time}</span>
                {n.emoji ? <span className="text-base">{n.emoji}</span> : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
