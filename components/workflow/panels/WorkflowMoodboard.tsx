"use client"

import { useMemo, useState } from "react"
import { MoodboardPinCard } from "@/components/workflow/panels/MoodboardPinCard"
import {
  REFERENCE_CAMPAIGNS_PROJECT_ID,
  WORKFEED_MOODBOARD_PROJECTS,
  WORKFEED_MOOD_PINS,
  WORKFEED_REFERENCE_CAMPAIGNS,
} from "@/lib/workflow/workfeed/moodboardData"
import type { WorkfeedMoodPin } from "@/lib/workflow/workfeed/types"

type WorkflowMoodboardProps = {
  onPostToFeed: (pin: WorkfeedMoodPin, projectName: string) => void
}

export function WorkflowMoodboard({ onPostToFeed }: WorkflowMoodboardProps) {
  const [activeProjectId, setActiveProjectId] = useState(WORKFEED_MOODBOARD_PROJECTS[0].id)
  const [view, setView] = useState<"explore" | "saved">("explore")
  const [pins, setPins] = useState<WorkfeedMoodPin[]>([
    ...WORKFEED_MOOD_PINS,
    ...WORKFEED_REFERENCE_CAMPAIGNS,
  ])

  const activeProject = WORKFEED_MOODBOARD_PROJECTS.find((p) => p.id === activeProjectId)

  const referencePins = useMemo(
    () => pins.filter((p) => p.projectId === REFERENCE_CAMPAIGNS_PROJECT_ID),
    [pins]
  )

  const projectPins = useMemo(() => {
    const forProject = pins.filter((p) => p.projectId === activeProjectId)
    return view === "saved" ? forProject.filter((p) => p.saved) : forProject
  }, [pins, activeProjectId, view])

  const savedReferencePins = useMemo(
    () => referencePins.filter((p) => p.saved),
    [referencePins]
  )

  const toggleSave = (pinId: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === pinId ? { ...p, saved: !p.saved } : p))
    )
  }

  const postPin = (pin: WorkfeedMoodPin) => {
    const label = pin.brand
      ? `${pin.brand} · reference`
      : (activeProject?.name ?? "Project")
    onPostToFeed(pin, label)
  }

  return (
    <div className="flex h-full flex-col bg-[#f8fafc] text-[#1a1208]">
      <div className="shrink-0 border-b border-[#1a1208]/10 bg-white px-4 pb-3 pt-14">
        <h1 className="text-lg font-black">Moodboard</h1>
        <p className="mt-0.5 text-xs font-semibold text-[#1a1208]/55">
          Visual refs · winning ads from other brands
        </p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setView("explore")}
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              view === "explore" ? "bg-[#1a1208] text-white" : "bg-[#f5f0e4] text-[#1a1208]/70"
            }`}
          >
            Explore
          </button>
          <button
            type="button"
            onClick={() => setView("saved")}
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              view === "saved" ? "bg-[#1a1208] text-white" : "bg-[#f5f0e4] text-[#1a1208]/70"
            }`}
          >
            My board
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {WORKFEED_MOODBOARD_PROJECTS.map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setActiveProjectId(proj.id)}
              className={`flex-shrink-0 rounded-full border-2 px-3 py-1 text-xs font-bold ${
                activeProjectId === proj.id
                  ? "border-[#1a1208] bg-white text-[#1a1208]"
                  : "border-transparent bg-[#f5f0e4] text-[#1a1208]/65"
              }`}
              style={
                activeProjectId === proj.id ? { borderColor: proj.color } : undefined
              }
            >
              {proj.name}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-28 pt-3">
        {view === "explore" ? (
          <section className="mb-5">
            <div className="mb-2 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-2">
              <h2 className="text-sm font-black text-[#1a1208]">
                Successful ad campaigns · other brands
              </h2>
              <p className="mt-0.5 text-[10px] font-semibold text-[#1a1208]/55">
                Reference what worked — save or post to your team feed
              </p>
            </div>
            <div className="columns-2 gap-2 [column-fill:balance]">
              {referencePins.map((pin) => (
                <MoodboardPinCard
                  key={pin.id}
                  pin={pin}
                  onSave={() => toggleSave(pin.id)}
                  onPost={() => postPin(pin)}
                />
              ))}
            </div>
          </section>
        ) : savedReferencePins.length > 0 ? (
          <section className="mb-5">
            <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/45">
              Saved references
            </h2>
            <div className="columns-2 gap-2 [column-fill:balance]">
              {savedReferencePins.map((pin) => (
                <MoodboardPinCard
                  key={pin.id}
                  pin={pin}
                  onSave={() => toggleSave(pin.id)}
                  onPost={() => postPin(pin)}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          {view === "explore" ? (
            <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[#1a1208]/45">
              {activeProject?.name ?? "Project"}
            </h2>
          ) : null}

          {projectPins.length === 0 && view === "saved" && savedReferencePins.length === 0 ? (
            <p className="py-12 text-center text-sm font-medium text-[#1a1208]/45">
              No pins saved yet. Tap Save on Explore.
            </p>
          ) : projectPins.length === 0 && view === "explore" ? (
            <p className="py-4 text-center text-xs font-medium text-[#1a1208]/40">
              No mood pins for this project yet.
            </p>
          ) : (
            <div className="columns-2 gap-2 [column-fill:balance]">
              {projectPins.map((pin) => (
                <MoodboardPinCard
                  key={pin.id}
                  pin={pin}
                  onSave={() => toggleSave(pin.id)}
                  onPost={() => postPin(pin)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
