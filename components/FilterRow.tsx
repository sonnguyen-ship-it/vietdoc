"use client"

import type { Category } from "@/lib/types"
import { useFilter, type ActiveFilter } from "@/context/FilterContext"
import { useLang } from "@/context/LangContext"

const CATS: { id: Category | "all"; vi: string; en: string }[] = [
  { id: "all", vi: "Tất cả", en: "All" },
  { id: "lao-dong", vi: "Lao động", en: "Labour" },
  { id: "thue", vi: "Thuế", en: "Tax" },
  { id: "hop-dong", vi: "Hợp đồng", en: "Contracts" },
  { id: "ke-toan", vi: "Kế toán", en: "Accounting" },
  { id: "hanh-chinh", vi: "Hành chính", en: "Admin" },
]

const EXTRA: { id: ActiveFilter; vi: string; en: string }[] = [
  { id: "featured", vi: "Nổi bật", en: "Featured" },
  { id: "moi", vi: "Mới", en: "New" },
  { id: "hot", vi: "Hot", en: "Hot" },
]

export function FilterRow() {
  const { lang } = useLang()
  const {
    activeCat,
    setActiveCat,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  } = useFilter()

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => {
            const active = activeCat === c.id
            const label = lang === "vi" ? c.vi : c.en
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveCat(c.id)
                  setActiveFilter("all")
                }}
                className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-red bg-red text-white"
                    : "border-black/10 bg-white text-ink2 hover:bg-paper2"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === "vi" ? "Tìm biểu mẫu…" : "Search templates…"}
          className="h-9 w-full rounded border border-black/10 bg-white px-3 text-sm text-ink2 outline-none ring-red/30 placeholder:text-hint focus:ring-2 sm:max-w-xs"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {EXTRA.map((x) => {
          const active = activeFilter === x.id
          const label = lang === "vi" ? x.vi : x.en
          return (
            <button
              key={x.id}
              type="button"
              onClick={() =>
                setActiveFilter(activeFilter === x.id ? "all" : x.id)
              }
              className={`rounded border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                active
                  ? "border-ink2 bg-ink2 text-paper"
                  : "border-black/10 bg-paper3 text-ink2 hover:bg-paper2"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
