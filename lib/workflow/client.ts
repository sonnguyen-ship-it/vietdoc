import { createSupabaseBrowser } from "@/lib/supabase/client"
import type { WorkflowPost } from "@/lib/workflow/types"

/** Client-side feed refresh (anon read). Use when adding live updates in the mobile app. */
export async function fetchWorkflowFeedClient(limit = 20): Promise<WorkflowPost[] | null> {
  const supabase = createSupabaseBrowser()
  if (!supabase) return null

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

  if (error || !data?.length) return null
  return data as unknown as WorkflowPost[]
}
