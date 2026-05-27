"use client"

import {
  HIGHLIGHT_RECT_FILL,
  HIGHLIGHT_RECT_STROKE,
} from "@/lib/workflow/workfeed/highlightRef"
import type { WorkfeedHighlightStyle } from "@/lib/workflow/workfeed/types"

type HighlightPathProps = {
  pathD: string
  highlightStyle?: WorkfeedHighlightStyle
  className?: string
  strokeWidth?: number
}

export function HighlightPath({
  pathD,
  highlightStyle = "stroke",
  className = "",
  strokeWidth = 4,
}: HighlightPathProps) {
  const isRect = highlightStyle === "rect"
  return (
    <path
      d={pathD}
      fill={isRect ? HIGHLIGHT_RECT_FILL : "none"}
      stroke={HIGHLIGHT_RECT_STROKE}
      strokeWidth={isRect ? 2 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
  )
}
