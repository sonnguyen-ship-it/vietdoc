"use client"

import { useMemo, useState } from "react"
import { MoodboardPinCard } from "@/components/workflow/panels/MoodboardPinCard"
import {
  REFERENCE_CAMPAIGNS_PROJECT_ID,
  WORKFEED_MOOD_PINS,
  WORKFEED_REFERENCE_CAMPAIGNS,
} from "@/lib/workflow/workfeed/moodboardData"
import { usePlanClipboardOptional } from "@/components/workflow/plan/WorkflowPlanClipboardContext"
import { WORKFEED_DM_RECIPIENTS } from "@/lib/workflow/workfeed/dmData"
import type { WorkfeedMoodPin } from "@/lib/workflow/workfeed/types"

type WorkflowMoodboardProps = {
  onPostToFeed: (pin: WorkfeedMoodPin, projectName: string) => void
  onShareToInbox?: (pin: WorkfeedMoodPin, recipient: { id: string; name: string }) => void
  desktop?: boolean
}

export function WorkflowMoodboard({ onPostToFeed, onShareToInbox, desktop }: WorkflowMoodboardProps) {
  const planClipboard = usePlanClipboardOptional()
  const [query, setQuery] = useState("")
  const [pins, setPins] = useState<WorkfeedMoodPin[]>([
    ...WORKFEED_MOOD_PINS,
    ...WORKFEED_REFERENCE_CAMPAIGNS,
  ])
  const [sharePin, setSharePin] = useState<WorkfeedMoodPin | null>(null)

  const referencePins = useMemo(
    () =>
      pins.filter(
        (p) =>
          p.projectId === REFERENCE_CAMPAIGNS_PROJECT_ID &&
          (query.trim()
            ? `${p.title} ${p.brand ?? ""} ${p.tags.join(" ")}`
                .toLowerCase()
                .includes(query.trim().toLowerCase())
            : true)
      ),
    [pins, query]
  )

  const projectPins = useMemo(
    () =>
      pins.filter(
        (p) =>
          p.projectId !== REFERENCE_CAMPAIGNS_PROJECT_ID &&
          (query.trim()
            ? `${p.title} ${p.brand ?? ""} ${p.tags.join(" ")}`
                .toLowerCase()
                .includes(query.trim().toLowerCase())
            : true)
      ),
    [pins, query]
  )

  const toggleSave = (pinId: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === pinId ? { ...p, saved: !p.saved } : p))
    )
  }

  const postPin = (pin: WorkfeedMoodPin) => {
    const label = pin.brand ? `${pin.brand} · reference` : "Moodboard"
    onPostToFeed(pin, label)
  }

  const shareProps = (pin: WorkfeedMoodPin) =>
    onShareToInbox ? () => setSharePin(pin) : undefined

  const copyProps = (pin: WorkfeedMoodPin) =>
    planClipboard ? () => planClipboard.copyFromMoodboard(pin) : undefined

  return (
    <div
      className={`flex h-full min-h-full flex-col text-[color:var(--wf-ink)] ${
        desktop ? "bg-transparent" : "bg-[#f8fafc] pt-[max(3rem,env(safe-area-inset-top))]"
      }`}
    >
      <div
        className={`min-h-0 flex-1 overflow-y-auto ${
          desktop ? "pb-4 pt-0" : "pb-28 pt-0"
        }`}
      >
        <div className={desktop ? "sticky top-0 z-20 border-b border-[color:var(--wf-glass-border)] bg-[rgba(255,255,255,0.76)] px-3 py-2.5 backdrop-blur-2xl backdrop-saturate-150" : "sticky top-0 z-20 border-b border-black/10 bg-white/85 px-3 py-2.5 backdrop-blur"}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-[rgba(26,18,8,0.55)]">
              Board
            </span>
            <div className="mx-1 h-4 w-px bg-black/10" aria-hidden />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="wf-glass-thin flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[color:var(--wf-glass-border-subtle)] px-3 py-2">
                <span className="text-[11px] font-bold text-[rgba(26,18,8,0.35)]" aria-hidden>
                  ⌕
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ideas, brands, tags…"
                  className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[color:var(--wf-ink)] outline-none placeholder:text-[rgba(26,18,8,0.35)]"
                />
              </div>
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full px-3 py-2 text-[11px] font-bold text-[rgba(26,18,8,0.55)] hover:bg-white/40"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="px-2 pt-2">
          <div
            className={
              desktop
                ? "columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 xl:columns-5 [column-fill:balance]"
                : "columns-2 gap-2 [column-fill:balance]"
            }
          >
            {referencePins.map((pin) => (
              <MoodboardPinCard
                key={pin.id}
                pin={pin}
                onSave={() => toggleSave(pin.id)}
                onShare={shareProps(pin) ?? (() => postPin(pin))}
                onCopyToPlan={copyProps(pin)}
              />
            ))}
            {projectPins.map((pin) => (
              <MoodboardPinCard
                key={pin.id}
                pin={pin}
                onSave={() => toggleSave(pin.id)}
                onShare={shareProps(pin) ?? (() => postPin(pin))}
                onCopyToPlan={copyProps(pin)}
              />
            ))}
          </div>
        </div>
      </div>

      {sharePin && onShareToInbox ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm">
          <div className="wf-glass-heavy w-full max-w-[420px] overflow-hidden rounded-2xl border border-[color:var(--wf-glass-border)] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[color:var(--wf-glass-border-subtle)] bg-white/40 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#1a1208]">Share to inbox</p>
                <p className="truncate text-[11px] font-medium text-[#1a1208]/55">
                  {sharePin.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSharePin(null)}
                className="rounded-lg px-2 py-1 text-xl font-bold text-[#1a1208]/45 hover:bg-white/40"
                aria-label="Close share"
              >
                ×
              </button>
            </header>
            <ul className="max-h-[min(52vh,420px)] overflow-y-auto p-2">
              {WORKFEED_DM_RECIPIENTS.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onShareToInbox(sharePin, { id: r.id, name: r.name })
                      setSharePin(null)
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-white/40"
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-extrabold text-white"
                      style={{ backgroundColor: r.avatarBg }}
                    >
                      {r.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-[#1a1208]">{r.name}</span>
                      <span className="block text-xs font-medium text-[#1a1208]/50">{r.handle}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
