import { WORKFLOW_MOCK_POSTS } from "@/lib/workflow/mockPosts"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { createSupabasePublic } from "@/lib/supabase/public"
import type { WorkflowFeedResult, WorkflowPost, WorkflowProfile } from "@/lib/workflow/types"

type DbPostRow = {
  id: string
  created_at: string
  caption: string
  media_type: string
  media_url: string | null
  poster_url: string | null
  like_count: number
  comment_count: number
  share_count: number
  tags: string[] | null
  author: DbProfileRow | DbProfileRow[] | null
}

type DbProfileRow = {
  id: string
  handle: string
  display_name: string
  avatar_url: string | null
  role_title: string | null
}

function mapProfile(row: DbProfileRow): WorkflowProfile {
  return {
    id: row.id,
    handle: row.handle,
    display_name: row.display_name,
    avatar_url: row.avatar_url,
    role_title: row.role_title,
  }
}

function mapPost(row: DbPostRow): WorkflowPost | null {
  const authorRaw = row.author
  const authorRow = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw
  if (!authorRow) return null

  const mediaType = row.media_type
  if (mediaType !== "video" && mediaType !== "image" && mediaType !== "text") {
    return null
  }

  return {
    id: row.id,
    created_at: row.created_at,
    caption: row.caption,
    media_type: mediaType,
    media_url: row.media_url,
    poster_url: row.poster_url,
    like_count: row.like_count ?? 0,
    comment_count: row.comment_count ?? 0,
    share_count: row.share_count ?? 0,
    tags: row.tags ?? [],
    author: mapProfile(authorRow),
  }
}

/** Server-side feed loader (service role). Falls back to mock posts when DB is empty or unavailable. */
export async function getWorkflowFeed(limit = 20): Promise<WorkflowFeedResult> {
  const supabase = createSupabaseAdmin() ?? createSupabasePublic()
  if (!supabase) {
    return { posts: WORKFLOW_MOCK_POSTS, source: "mock" }
  }

  const { data, error } = await supabase
    .from("workflow_posts")
    .select(
      `
      id,
      created_at,
      caption,
      media_type,
      media_url,
      poster_url,
      like_count,
      comment_count,
      share_count,
      tags,
      author:workflow_profiles (
        id,
        handle,
        display_name,
        avatar_url,
        role_title
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data?.length) {
    return { posts: WORKFLOW_MOCK_POSTS, source: "mock" }
  }

  const posts = (data as DbPostRow[])
    .map(mapPost)
    .filter((p): p is WorkflowPost => p !== null)

  if (!posts.length) {
    return { posts: WORKFLOW_MOCK_POSTS, source: "mock" }
  }

  return { posts, source: "supabase" }
}
