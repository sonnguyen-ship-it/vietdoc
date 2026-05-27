"use client"

import type { PlanCellImage } from "@/lib/workflow/workfeed/planImages"
import { PlanImageVisual } from "@/components/workflow/plan/PlanImageVisual"

type PlanImageLightboxProps = {
  image: PlanCellImage
  onClose: () => void
}

export function PlanImageLightbox({ image, onClose }: PlanImageLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal
      aria-label="Image preview"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl font-light text-white hover:bg-white/25"
        aria-label="Close"
      >
        ×
      </button>
      <div
        className="relative max-h-[min(85vh,720px)] max-w-[min(92vw,960px)] overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <PlanImageVisual
          gradient={image.gradient}
          imageUrl={image.imageUrl}
          alt={image.title}
          className="aspect-[4/3] w-[min(92vw,960px)] max-w-full"
          sizes="(max-width: 960px) 90vw, 640px"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12">
          {image.brand ? (
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-white/70">
              {image.brand}
            </p>
          ) : null}
          <p className="text-lg font-bold text-white">{image.title}</p>
        </div>
      </div>
    </div>
  )
}
