import type { Metadata } from "next"
import { Nav } from "@/components/Nav"
import { DungThuTryClient } from "@/components/dung-thu/DungThuTryClient"
import { SITE_URL } from "@/lib/siteUrl"

export const metadata: Metadata = {
  title: "Dùng thử",
  description:
    "Soạn thử VietDoc trên trình duyệt — bản dùng thử gọn, có hoàn tác. Biểu mẫu pháp lý đầy đủ tại trang chủ.",
  alternates: { canonical: `${SITE_URL}/dung-thu` },
}

type DungThuPageProps = {
  searchParams: { template?: string | string[] }
}

export default function DungThuPage({ searchParams }: DungThuPageProps) {
  const raw = searchParams.template
  const initialTemplateId = typeof raw === "string" ? raw : undefined

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-paper">
      <Nav />
      <div className="min-h-0 flex-1">
        <DungThuTryClient initialTemplateId={initialTemplateId} />
      </div>
    </div>
  )
}
