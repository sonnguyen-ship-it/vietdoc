export type WorkfeedComment = {
  id: string
  author: string
  avatar: string
  avatarBg: string
  text: string
  time: string
}

export type WorkfeedAuthor = {
  initials: string
  avatarBg: string
  name: string
  sub: string
  lightText?: boolean
}

export type WorkfeedRail = {
  hearts: number
  comments: number
  repeat?: number
  showBookmark?: boolean
  showRepeat?: boolean
  lightMode?: boolean
}

export type WorkfeedPostBase = {
  id: string
  author: WorkfeedAuthor
  tagRow?: string
  rail: WorkfeedRail
  comments: WorkfeedComment[]
}

export type WorkfeedBossPost = WorkfeedPostBase & {
  kind: "boss-announcement"
  background: string
  lines: { parts: WorkfeedTextPart[] }[]
  mentions: string[]
}

export type WorkfeedTextPart =
  | { type: "text"; value: string }
  | { type: "highlight"; value: string; bg: string; color?: string; large?: boolean }

export type WorkfeedAdsSlide = {
  label: string
  background: string
  headline: WorkfeedTextPart[]
  card?: {
    title: string
    kind: "overview" | "channels" | "koc"
  }
  highlightStrip?: string
  swipeHint?: string
}

export type WorkfeedCarouselPost = WorkfeedPostBase & {
  kind: "ads-carousel"
  slides: WorkfeedAdsSlide[]
}

export type WorkfeedTaskRow = {
  id: string
  label: string
  assignee: string
  checked: boolean
}

export type WorkfeedNotesPost = WorkfeedPostBase & {
  kind: "meeting-notes"
  background: string
  chip: string
  headline: WorkfeedTextPart[]
  goal: string
  tasks: WorkfeedTaskRow[]
  videoLink: { title: string; sub: string; targetPostId: string }
}

export type WorkfeedVideoPost = WorkfeedPostBase & {
  kind: "video-brief"
  mentions: string[]
  stickerTitle: string
  badge: string
  subtitles: { line: string; style: "shot" | "vi" | "en" }[]
}

export type WorkfeedPost =
  | WorkfeedBossPost
  | WorkfeedCarouselPost
  | WorkfeedNotesPost
  | WorkfeedVideoPost

export type WorkfeedStory = {
  id: string
  author: string
  initials: string
  avatarBg: string
  background: string
  badge: string
  badgeClass: string
  text: string
  viewers: string
}

export type WorkfeedNotification = {
  id: string
  kind: "story" | "activity" | "like"
  author: string
  initials: string
  avatarBg: string
  text: string
  time: string
  emoji?: string
  storyId?: string
}

export type WorkfeedChatMessage = {
  id: string
  sender: string
  kind: "text" | "table" | "list-card" | "highlight"
  text?: string
  table?: { headers: string[] }
  listCard?: { items: string[]; caption: string }
  align: "left" | "right"
  /** SVG path for highlight circle sketch */
  highlightPath?: string
}

export type WorkfeedChat = {
  id: string
  title: string
  avatar: string
  avatarBg: string
  preview: string
  time: string
  unread: number
  messages: WorkfeedChatMessage[]
  kind?: "group" | "direct"
  handle?: string
}

export type WorkfeedDmRecipient = {
  id: string
  name: string
  handle: string
  initials: string
  avatarBg: string
}

export type WorkfeedTab = "feed" | "plan" | "dm" | "moodboard"

export type WorkfeedPlanSheet = {
  id: string
  title: string
  subtitle: string
  columns: string[]
  rows: string[][]
}

export type WorkfeedMoodboardProject = {
  id: string
  name: string
  color: string
}

export type WorkfeedMoodPin = {
  id: string
  title: string
  projectId: string
  gradient: string
  height: number
  tags: string[]
  saved: boolean
  /** External brand reference (winning ads section) */
  brand?: string
  statLine?: string
  channel?: string
}
