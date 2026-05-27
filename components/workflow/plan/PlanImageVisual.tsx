"use client"

import Image from "next/image"

type PlanImageVisualProps = {
  gradient: string
  imageUrl?: string
  alt?: string
  className?: string
  /** Show title overlay on full-size thumbs only */
  showCaption?: boolean
  caption?: string
  sizes?: string
}

export function PlanImageVisual({
  gradient,
  imageUrl,
  alt = "",
  className = "",
  showCaption = false,
  caption,
  sizes = "(max-width: 640px) 50vw, 240px",
}: PlanImageVisualProps) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: gradient }}>
      {imageUrl ? (
        <Image src={imageUrl} alt={alt} fill className="object-cover" sizes={sizes} />
      ) : null}
      {showCaption && caption ? (
        <span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1 py-0.5 text-[8px] font-bold text-white">
          {caption}
        </span>
      ) : null}
    </div>
  )
}
