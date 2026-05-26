"use client"

import type { WorkfeedTab } from "@/lib/workflow/workfeed/types"

type WorkflowTabBarProps = {
  activeTab: WorkfeedTab
  onTabChange: (tab: WorkfeedTab) => void
  dark?: boolean
}

export function WorkflowTabBar({ activeTab, onTabChange, dark }: WorkflowTabBarProps) {
  const itemClass = (active: boolean) =>
    `flex w-full flex-col items-center gap-0.5 bg-transparent py-1 text-[10px] font-bold ${
      active
        ? dark
          ? "text-white"
          : "text-[#1a1208]"
        : dark
          ? "text-white/50"
          : "text-[#1a1208]/45"
    }`

  return (
    <nav
      className={`pointer-events-auto absolute inset-x-0 bottom-0 z-20 pb-[max(0.5rem,env(safe-area-inset-bottom))] ${
        dark ? "bg-black/75 backdrop-blur-md" : "bg-white/95 backdrop-blur-md"
      }`}
      aria-label="Workflow navigation"
    >
      <ul className="flex items-stretch justify-around px-1 pt-1">
        <li className="flex-1">
          <button
            type="button"
            onClick={() => onTabChange("feed")}
            className={itemClass(activeTab === "feed")}
            aria-current={activeTab === "feed" ? "page" : undefined}
          >
            <span className="text-base leading-none">⌂</span>
            <span>Feed</span>
          </button>
        </li>
        <li className="flex-1">
          <button
            type="button"
            onClick={() => onTabChange("notif")}
            className={itemClass(activeTab === "notif")}
            aria-current={activeTab === "notif" ? "page" : undefined}
          >
            <span className="text-base leading-none">🔔</span>
            <span>Notif</span>
          </button>
        </li>
        <li className="-mt-3 flex flex-1 justify-center">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red text-2xl font-light text-white shadow-lg"
            aria-label="Create post"
          >
            ＋
          </button>
        </li>
        <li className="flex-1">
          <button
            type="button"
            onClick={() => onTabChange("dm")}
            className={itemClass(activeTab === "dm")}
            aria-current={activeTab === "dm" ? "page" : undefined}
          >
            <span className="text-base leading-none">✉</span>
            <span>DM</span>
          </button>
        </li>
        <li className="flex-1">
          <button
            type="button"
            onClick={() => onTabChange("profile")}
            className={itemClass(activeTab === "profile")}
            aria-current={activeTab === "profile" ? "page" : undefined}
          >
            <span className="text-base leading-none">☺</span>
            <span>Profile</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
