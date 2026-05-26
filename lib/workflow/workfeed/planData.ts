import type { WorkfeedPlanSheet } from "@/lib/workflow/workfeed/types"

/** Column highlighted with a bracket in the Plan UI */
export const PLAN_HIGHLIGHT_COLUMN = "Week 3"

export const WORKFEED_PLAN_SHEETS: WorkfeedPlanSheet[] = [
  {
    id: "plan-client-a",
    title: "Client A · KOC Campaign",
    subtitle: "Jul–Aug 2025 · Marketing plan",
    columns: [
      "KOC / Owner",
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Budget (VNĐ)",
      "Channel",
      "Format",
      "Status",
      "ROAS",
      "Notes",
    ],
    rows: [
      ["@hienvuive", "Reel + Story", "Boost ads", "KOC live", "Report", "2.4M", "TikTok", "Video", "Live", "3.2x", "Top performer"],
      ["@trangkoc", "Brief sent", "Draft review", "Film", "Edit", "1.8M", "TikTok", "Video", "In progress", "2.8x", ""],
      ["@minh.koc", "—", "Outreach", "Contract", "Shoot TBD", "1.2M", "IG Reels", "Carousel", "Planned", "—", "New face"],
      ["@ductran", "Vendor sync", "—", "—", "—", "0.9M", "Internal", "Coord", "On track", "—", "Ops support"],
      ["@dung", "Research", "Ideas deck", "Present", "—", "—", "Strategy", "Doc", "Done", "—", ""],
      ["@my", "Props list", "Studio book", "Shoot assist", "B-roll", "500K", "Production", "Photo", "Scheduled", "—", "Studio HN"],
      ["Paid — TikTok Ads", "Run", "Optimize", "Scale +20%", "Report", "5.1M", "TikTok Ads", "Performance", "Active", "2.8x", "Lead channel"],
      ["Paid — Meta", "Run", "Reduce", "1.2M cap", "—", "1.8M", "Facebook", "Performance", "Active", "2.1x", ""],
      ["Paid — Google", "Always on", "—", "—", "—", "0.9M", "Google", "Search", "Active", "2.8x", ""],
      ["TOTAL", "—", "—", "—", "—", "13.8M", "—", "—", "—", "2.8x", "Blended target"],
    ],
  },
]
