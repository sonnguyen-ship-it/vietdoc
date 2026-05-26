import type { Metadata } from "next"
import Link from "next/link"
import { templates } from "@/lib/templates"
import { SITE_URL } from "@/lib/siteUrl"
import { TEMPLATE_META, TEMPLATE_SLUG_BY_ID } from "@/lib/templateMeta"

export const metadata: Metadata = {
  title: "Biểu mẫu pháp lý",
  description:
    "Danh sách biểu mẫu pháp lý doanh nghiệp Việt Nam: hợp đồng lao động, tờ khai thuế TNCN, hợp đồng kinh tế, biên bản họp HĐQT và hơn thế nữa.",
  alternates: { canonical: `${SITE_URL}/mau` },
}

export default function MauIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Thư viện biểu mẫu pháp lý
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Mỗi trang có mô tả SEO, căn cứ pháp luật và liên kết mở trình soạn thảo VietDoc trực tiếp trên trình duyệt.
      </p>
      <ul className="mt-8 space-y-3">
        {templates.map((t) => {
          const slug = TEMPLATE_SLUG_BY_ID[t.id]
          const meta = slug ? TEMPLATE_META[slug] : undefined
          if (!slug || !meta) return null
          return (
            <li key={t.id}>
              <Link
                href={`/mau/${slug}`}
                className="block rounded-lg border border-black/10 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <span className="font-display text-lg font-semibold text-ink">
                  {meta.h1}
                </span>
                <p className="mt-1 text-xs text-muted">{meta.legalBasis}</p>
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="mt-8">
        <Link href="/" className="text-sm font-semibold text-red hover:underline">
          ← Về trang chủ
        </Link>
      </p>
    </div>
  )
}
