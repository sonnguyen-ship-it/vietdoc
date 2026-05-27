"use client"

import type { WorkfeedPost } from "@/lib/workflow/workfeed/types"
import { AdsCarouselPost } from "@/components/workflow/posts/AdsCarouselPost"
import { BossAnnouncementPost } from "@/components/workflow/posts/BossAnnouncementPost"
import { MeetingNotesPost } from "@/components/workflow/posts/MeetingNotesPost"
import { VideoBriefPost } from "@/components/workflow/posts/VideoBriefPost"

type WorkfeedPostRouterProps = {
  post: WorkfeedPost
  layout?: "mobile" | "desktop"
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
  onOpenPost?: (postId: string) => void
}

export function WorkfeedPostRouter({
  post,
  layout = "mobile",
  onScrollUp,
  onScrollDown,
  canScrollUp,
  canScrollDown,
  onOpenPost,
}: WorkfeedPostRouterProps) {
  const scrollProps = { layout, onScrollUp, onScrollDown, canScrollUp, canScrollDown }

  switch (post.kind) {
    case "boss-announcement":
      return <BossAnnouncementPost post={post} {...scrollProps} />
    case "ads-carousel":
      return <AdsCarouselPost post={post} {...scrollProps} />
    case "meeting-notes":
      return (
        <MeetingNotesPost
          post={post}
          {...scrollProps}
          onOpenVideo={() => onOpenPost?.(post.videoLink.targetPostId)}
        />
      )
    case "video-brief":
      return <VideoBriefPost post={post} {...scrollProps} />
    default:
      return null
  }
}
