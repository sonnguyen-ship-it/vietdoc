import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/siteUrl"

export const metadata: Metadata = {
  title: "Thông Báo Cập Nhật Biểu Mẫu Pháp Lý | VietDoc",
  description:
    "Nhật ký cập nhật thông tư và biểu mẫu: TT 99/2025/TT-BTC, TT 94/2025, mức lương tối thiểu vùng 2025 và ảnh hưởng tới hợp đồng lao động, tờ khai thuế.",
  keywords: [
    "thông tư mới nhất 2025",
    "biểu mẫu nào còn hiệu lực 2025",
    "cập nhật thuế tncn 2025",
    "thông tư 99 2025 kế toán",
  ],
  alternates: { canonical: `${SITE_URL}/cap-nhat-mau` },
}

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cập Nhật Biểu Mẫu và Quy Định Pháp Lý 2025",
  datePublished: "2025-10-27",
  dateModified: "2025-10-27",
  author: { "@type": "Organization", name: "VietDoc", url: SITE_URL },
  inLanguage: "vi-VN",
}

const updates = [
  {
    date: "2025-10-27",
    title: "Thông tư 99/2025/TT-BTC — chế độ kế toán doanh nghiệp",
    body: "Thông tư 99/2025/TT-BTC quy định chế độ kế toán doanh nghiệp, thay thế TT 200/2014/TT-BTC, có hiệu lực từ 01/01/2026. Doanh nghiệp cần rà soát mẫu sổ chứng từ và hướng dẫn nội bộ để đồng bộ với khung mới trước ngày hiệu lực.",
    href: "/mau/to-khai-thue-tncn",
    label: "Tờ khai thuế TNCN",
  },
  {
    date: "2025-07-01",
    title: "TT 94/2025/TT-BTC — sửa đổi TT 80/2021 về hồ sơ khai thuế",
    body: "Các thay đổi ảnh hưởng tới biểu mẫu 02/QTT-TNCN và các chỉ tiêu kèm theo hồ sơ quyết toán thuế TNCN. VietDoc cập nhật phần hướng dẫn điền chỉ tiêu để phản ánh hiệu lực từ 01/07/2025.",
    href: "/mau/to-khai-thue-tncn",
    label: "Mẫu 02/QTT-TNCN",
  },
  {
    date: "2025-01-01",
    title: "Mức lương tối thiểu vùng 2025 (NĐ 74/2024/NĐ-CP)",
    body: "Mức lương tối thiểu vùng áp dụng từ 01/01/2025 ảnh hưởng tới điều khoản lương, phụ cấp và thử việc trong hợp đồng lao động. Doanh nghiệp nên rà soát hợp đồng mẫu và phụ lục điều chỉnh lương.",
    href: "/mau/hop-dong-lao-dong",
    label: "Hợp đồng lao động",
  },
]

export default function CapNhatMauPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <nav className="text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          <span className="text-ink2">Cập nhật mẫu</span>
        </nav>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
          Cập Nhật Biểu Mẫu và Quy Định Pháp Lý 2025
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Trang này ghi lại các thay đổi quan trọng ảnh hưởng tới biểu mẫu trong VietDoc. Luôn kiểm tra văn bản gốc trên Cổng thông tin điện tử của cơ quan ban hành trước khi ký hợp đồng hoặc nộp hồ sơ thuế.
        </p>

        <ol className="mt-8 space-y-6">
          {updates.map((u) => (
            <li
              key={u.date + u.title}
              className="rounded-lg border border-black/10 bg-white p-4 sm:p-5"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-red">{u.date}</p>
              <h2 className="mt-2 font-display text-lg font-semibold text-ink">{u.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{u.body}</p>
              <p className="mt-3 text-sm">
                <span className="text-muted">Biểu mẫu liên quan: </span>
                <Link href={u.href} className="font-semibold text-red hover:underline">
                  {u.label}
                </Link>
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-sm">
          <Link href="/" className="font-semibold text-red hover:underline">
            ← Về trang chủ
          </Link>
        </p>
      </article>
    </>
  )
}
