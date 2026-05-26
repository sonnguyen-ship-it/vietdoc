"use client"

import type { Category } from "@/lib/types"
import { templates } from "@/lib/templates"
import { useFilter } from "@/context/FilterContext"
import { useLang } from "@/context/LangContext"

const ICONS: Record<Category | "all", string> = {
  all: "✦",
  "lao-dong": "📋",
  thue: "📊",
  "hop-dong": "🤝",
  "ke-toan": "📒",
  "hanh-chinh": "🏛️",
}

const ROWS: { id: Category | "all"; vi: string; en: string }[] = [
  { id: "all", vi: "Tất cả danh mục", en: "All categories" },
  { id: "lao-dong", vi: "Lao động", en: "Labour" },
  { id: "thue", vi: "Thuế & QTT", en: "Tax & returns" },
  { id: "hop-dong", vi: "Hợp đồng", en: "Contracts" },
  { id: "ke-toan", vi: "Kế toán", en: "Accounting" },
  { id: "hanh-chinh", vi: "Hành chính DN", en: "Corporate admin" },
]

function countFor(cat: Category | "all") {
  if (cat === "all") return templates.length
  return templates.filter((t) => t.category === cat).length
}

export function Sidebar() {
  const { lang } = useLang()
  const { activeCat, setActiveCat, setActiveFilter } = useFilter()

  const recent = templates.filter((t) => t.updated === "Mới")

  return (
    <aside className="lg:sticky lg:top-16 lg:self-start">
      <div className="rounded-lg border border-black/10 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {lang === "vi" ? "Danh mục" : "Categories"}
        </p>
        <nav aria-label={lang === "vi" ? "Danh mục biểu mẫu" : "Template categories"}>
          <ul className="mt-3 space-y-1">
            {ROWS.map((row) => {
              const active = activeCat === row.id
              const n = countFor(row.id)
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCat(row.id)
                      setActiveFilter("all")
                    }}
                    className={`flex w-full items-center justify-between rounded border px-2 py-2 text-left text-sm transition-colors ${
                      active
                        ? "border-red/30 bg-red/5 text-ink"
                        : "border-transparent text-ink2 hover:bg-paper2"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{ICONS[row.id]}</span>
                      <span className="font-medium">
                        {lang === "vi" ? row.vi : row.en}
                      </span>
                    </span>
                    <span className="rounded-full border border-black/10 bg-paper px-2 py-0.5 text-[10px] font-bold text-muted">
                      {n}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="mt-4 rounded-lg border border-black/10 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink2">
            {lang === "vi" ? "Mới cập nhật" : "Recently updated"}
          </p>
          <span className="rounded border border-green/30 bg-green/10 px-2 py-0.5 text-[10px] font-bold uppercase text-green">
            Mới
          </span>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-ink2">
          {recent.length === 0 ? (
            <li className="text-muted">
              {lang === "vi" ? "Đang cập nhật…" : "Updating soon…"}
            </li>
          ) : (
            recent.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="w-full rounded border border-transparent px-1 py-1 text-left hover:border-black/10 hover:bg-paper2"
                  onClick={() => {
                    setActiveCat("all")
                    setActiveFilter("moi")
                  }}
                >
                  <span className="mr-1">{t.icon}</span>
                  {t.name[lang]}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <p
        id="legal"
        className="mt-4 rounded-lg border border-black/10 bg-paper2 p-3 text-[11px] leading-relaxed text-muted"
      >
        {lang === "vi"
          ? "VietDoc cung cấp khung văn bản tham khảo theo văn bản pháp luật hiện hành. Trước khi ký, nên rà soát với luật sư hoặc kế toán viên."
          : "VietDoc provides reference layouts aligned with current legal forms. Have counsel or your accountant review before signing."}
      </p>
      <p
        id="contact"
        className="mt-2 text-center text-[11px] text-hint"
      >
        contact@vietdoc.app
      </p>
    </aside>
  )
}
