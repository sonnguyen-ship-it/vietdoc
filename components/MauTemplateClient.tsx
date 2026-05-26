"use client"

import { useMemo, useState } from "react"
import { EditorModal } from "@/components/EditorModal"
import { templates } from "@/lib/templates"

type MauTemplateClientProps = {
  templateId: string
}

export function MauTemplateClient({ templateId }: MauTemplateClientProps) {
  const template = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templateId]
  )
  const [open, setOpen] = useState(true)

  if (!template) return null

  return (
    <>
      <EditorModal template={template} open={open} onClose={() => setOpen(false)} />
      {!open ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded bg-red px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Mở chỉnh sửa biểu mẫu →
          </button>
        </div>
      ) : null}
    </>
  )
}
