"use client"

import { useState } from "react"
import type { Template } from "@/lib/types"
import { DocModTryModal } from "@/components/dung-thu/DocModTryModal"
import { FilterRow } from "@/components/FilterRow"
import { Hero } from "@/components/Hero"
import { Nav } from "@/components/Nav"
import { SiteFooter } from "@/components/SiteFooter"
import { Sidebar } from "@/components/Sidebar"
import { TemplateGrid } from "@/components/TemplateGrid"
import { useLang } from "@/context/LangContext"

const FAQ_VI: { q: string; a: string }[] = [
  {
    q: "VietDoc khác Word ở điểm nào?",
    a: "Tập trung biểu mẫu pháp lý Việt Nam, gợi ý khối nội dung và căn chỉnh theo thông lệ văn bản hành chính — không phải soạn thảo tổng quát kiểu Word.",
  },
  {
    q: "Dữ liệu của tôi có được lưu riêng không?",
    a: "Luồng hiện tại phục vụ dùng thử và biểu mẫu; chính sách lưu trữ chi tiết sẽ được công bố khi mở đăng ký chính thức.",
  },
  {
    q: "Có hỗ trợ song ngữ Việt–Anh không?",
    a: "Giao diện và một số nội dung có thể chuyển Việt/Anh; biểu mẫu ưu tiên tiếng Việt theo thực tế công việc.",
  },
]

const FAQ_EN: { q: string; a: string }[] = [
  {
    q: "How is VietDoc different from Word?",
    a: "It focuses on Vietnamese legal templates, content blocks, and layout conventions for administrative documents — not general-purpose word processing.",
  },
  {
    q: "Is my data stored privately?",
    a: "The current flow supports trials and templates; a detailed retention policy will ship with general availability.",
  },
  {
    q: "Is there Vietnamese–English support?",
    a: "Some UI and copy can switch between Vietnamese and English; templates prioritize Vietnamese for day-to-day use.",
  },
]

function HomeFaqSection() {
  const { lang } = useLang()
  const items = lang === "vi" ? FAQ_VI : FAQ_EN
  const title = lang === "vi" ? "Câu hỏi thường gặp" : "Frequently asked questions"

  return (
    <section className="rounded-lg border border-black/10 bg-white/80 p-5 shadow-sm sm:p-6" aria-labelledby="home-faq-heading">
      <h2 id="home-faq-heading" className="font-display text-lg font-semibold text-ink">
        {title}
      </h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.q}>
            <p className="text-sm font-semibold text-ink">{item.q}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.a}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function AppShell() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Template | null>(null)

  const handleOpen = (t: Template) => {
    setActive(t)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <Hero />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-start">
        <div className="lg:w-64 lg:flex-shrink-0">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 space-y-6">
          <FilterRow />
          <TemplateGrid onOpen={handleOpen} />
          <HomeFaqSection />
        </main>
      </div>
      <SiteFooter />
      <DocModTryModal template={active} open={open} onClose={handleClose} />
    </div>
  )
}
