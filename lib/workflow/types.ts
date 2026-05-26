export type WorkflowMediaType = "video" | "image" | "text"

export type WorkflowProfile = {
  id: string
  handle: string
  display_name: string
  avatar_url: string | null
  role_title: string | null
}

export type WorkflowPost = {
  id: string
  created_at: string
  caption: string
  media_type: WorkflowMediaType
  media_url: string | null
  poster_url: string | null
  like_count: number
  comment_count: number
  share_count: number
  tags: string[]
  author: WorkflowProfile
}

export type WorkflowFeedSource = "supabase" | "mock"

export type WorkflowFeedResult = {
  posts: WorkflowPost[]
  source: WorkflowFeedSource
}
