"use client"

import { DocModEditor } from "@/components/dung-thu/DocModEditor"

export function DungThuTryClient({ initialTemplateId }: { initialTemplateId?: string }) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <DocModEditor initialTemplateId={initialTemplateId} />
    </div>
  )
}
