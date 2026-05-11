"use client"

import type { Template } from "@/lib/types"
import { useLang } from "@/context/LangContext"

type TemplateCardProps = {
  template: Template
  onOpen: (t: Template) => void
}

export function TemplateCard({ template, onOpen }: TemplateCardProps) {
  const { lang } = useLang()
  const wide = template.featured

  return (
    <article
      className={`tcard flex cursor-pointer flex-col overflow-hidden ${
        wide ? "md:col-span-2" : ""
      }`}
      onClick={() => onOpen(template)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen(template)
        }
      }}
      role="button"
      tabIndex={0}
      style={{ backgroundColor: template.previewBg }}
    >
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-2xl" aria-hidden>
            {template.icon}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {template.updated ? (
              <span
                className={`rounded border border-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  template.updated === "Mới"
                    ? "bg-green/15 text-green"
                    : "bg-red/10 text-red"
                }`}
              >
                {template.updated}
              </span>
            ) : null}
            <span
              className={`rounded border border-black/10 px-2 py-0.5 text-[10px] font-semibold ${template.tagClass}`}
            >
              {template.tagLabel[lang]}
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            {template.name[lang]}
          </h3>
          <p className="mt-1 line-clamp-3 text-sm text-muted">
            {template.description[lang]}
          </p>
        </div>
        <dl className="mt-auto grid gap-1 text-[11px] text-ink2 sm:grid-cols-2">
          <div>
            <dt className="text-muted">
              {lang === "vi" ? "Căn cứ" : "Legal basis"}
            </dt>
            <dd className="font-medium">{template.decree}</dd>
          </div>
          <div>
            <dt className="text-muted">
              {lang === "vi" ? "Hiệu lực / cập nhật" : "Effective / updated"}
            </dt>
            <dd className="font-medium">{template.effectiveFrom}</dd>
          </div>
        </dl>
        <p className="text-xs font-semibold text-red">
          {lang === "vi" ? "Mở chỉnh sửa →" : "Open editor →"}
        </p>
      </div>
    </article>
  )
}
