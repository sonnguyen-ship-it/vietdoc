"use client"

import { WorkflowMinimizedChecklist } from "@/components/workflow/todos/WorkflowMinimizedChecklist"
import { DESKTOP_MAIN_TABS } from "@/lib/workflow/workfeed/desktopTabs"
import type { WorkfeedMainTab } from "@/lib/workflow/workfeed/highlightRef"
type WorkflowDesktopNavProps = {
  mainTab: WorkfeedMainTab
  onMainTabChange: (tab: WorkfeedMainTab) => void
  checklistExpanded: boolean
  onChecklistExpand: () => void
  onChecklistCollapse: () => void
}

function BrowserTab({
  label,
  icon,
  active,
  neonVar,
  onClick,
}: {
  label: string
  icon: string
  active: boolean
  neonVar: string
  onClick: () => void
}) {
  if (active) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current="page"
        className="wf-glass-heavy relative -mb-px z-10 flex h-9 min-w-[7.75rem] items-center gap-1.5 rounded-t-[10px] border border-b-0 border-[color:var(--wf-glass-border)] px-4 text-[13px] font-medium text-[color:var(--wf-ink)]"
      >
        <span className="opacity-75">{icon}</span>
        {label}
        <span
          className="absolute bottom-0 left-3 right-3 h-[2px] rounded-t-[2px]"
          style={{ backgroundColor: neonVar }}
          aria-hidden
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="wf-glass-thin mb-0.5 flex h-8 min-w-[6.75rem] items-center gap-1.5 rounded-t-[10px] px-3.5 pt-1 text-[13px] font-medium text-[color:var(--wf-ink-muted)] transition hover:bg-[rgba(255,255,255,0.48)]"
    >
      <span className="opacity-65">{icon}</span>
      {label}
    </button>
  )
}

export function WorkflowDesktopNav({
  mainTab,
  onMainTabChange,
  checklistExpanded,
  onChecklistExpand,
  onChecklistCollapse,
}: WorkflowDesktopNavProps) {
  return (
    <header className="relative z-[50] shrink-0 bg-transparent px-5 pt-2.5">
      <div className="flex items-end gap-3">
        <nav className="flex items-end gap-0.5" aria-label="Main views">
          {DESKTOP_MAIN_TABS.map((tab) => (
            <BrowserTab
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={mainTab === tab.id}
              neonVar={tab.neonVar}
              onClick={() => onMainTabChange(tab.id)}
            />
          ))}
        </nav>

        <div className="mb-1 ml-auto min-w-0 max-w-[min(100%,360px)] flex-1">
          <WorkflowMinimizedChecklist
            variant="desktop"
            expanded={checklistExpanded}
            onExpand={onChecklistExpand}
            onCollapse={onChecklistCollapse}
          />
        </div>
      </div>
    </header>
  )
}
