"use client"

import { useMemo } from "react"
import { templates } from "@/lib/templates"
import type { Template } from "@/lib/types"
import { useFilter } from "@/context/FilterContext"
import { useLang } from "@/context/LangContext"
import { TemplateCard } from "@/components/TemplateCard"

type TemplateGridProps = {
  onOpen: (t: Template) => void
}

export function TemplateGrid({ onOpen }: TemplateGridProps) {
  const { activeCat, activeFilter, searchQuery } = useFilter()
  const { lang } = useLang()

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return templates.filter((t) => {
      if (activeCat !== "all" && t.category !== activeCat) return false
      if (activeFilter === "featured" && !t.featured) return false
      if (activeFilter === "moi" && t.updated !== "Mới") return false
      if (activeFilter === "hot" && t.updated !== "Hot") return false
      if (!q) return true
      const blob = `${t.name.vi} ${t.name.en} ${t.description.vi} ${t.description.en} ${t.decree}`.toLowerCase()
      return blob.includes(q)
    })
  }, [activeCat, activeFilter, searchQuery])

  return (
    <section id="templates" className="space-y-4">
      {filtered.length === 0 ? (
        <p className="rounded-lg border border-black/10 bg-white px-4 py-8 text-center text-sm text-muted">
          {lang === "vi"
            ? "Không có biểu mẫu phù hợp bộ lọc. Hãy thử điều chỉnh tìm kiếm."
            : "No templates match your filters. Try adjusting search or filters."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  )
}
