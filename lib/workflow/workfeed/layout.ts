/** Height of bottom tab bar (matches WorkflowTabBar). */
export const WORKFLOW_TAB_BAR_OFFSET =
  "calc(3.25rem + env(safe-area-inset-bottom, 0px))"

/** Main content area between header and tab bar (feed posts, panels). */
export const WORKFLOW_CONTENT_HEIGHT =
  "calc(100dvh - 3.25rem - env(safe-area-inset-bottom, 0px))"

/** Clearance above tab bar for + FAB and spin-out children. */
export const WORKFLOW_FAB_CLEARANCE =
  "calc(7.25rem + env(safe-area-inset-bottom, 0px))"

/** Mobile feed: minimized checklist row + safe area. */
export const WORKFLOW_MOBILE_CHECKLIST_OFFSET =
  "calc(3.25rem + env(safe-area-inset-top, 0px))"
