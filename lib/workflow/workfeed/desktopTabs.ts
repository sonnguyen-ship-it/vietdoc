import type { WorkfeedMainTab } from "@/lib/workflow/workfeed/highlightRef"

export type DesktopTabMeta = {
  id: WorkfeedMainTab
  label: string
  icon: string
  neonVar: string
}

export const DESKTOP_MAIN_TABS: DesktopTabMeta[] = [
  { id: "feed", label: "Feed", icon: "⌂", neonVar: "var(--wf-neon-lime)" },
  { id: "plan", label: "Plan", icon: "▦", neonVar: "var(--wf-neon-violet)" },
  { id: "moodboard", label: "Board", icon: "▣", neonVar: "var(--wf-neon-coral)" },
]

/** Glass content pane per tab */
export function desktopTabSurface(mainTab: WorkfeedMainTab): string {
  if (mainTab === "plan") {
    return "wf-plan-surface border-t border-[color:var(--wf-glass-border)]"
  }
  return "wf-glass-heavy border-t border-[color:var(--wf-glass-border)]"
}
