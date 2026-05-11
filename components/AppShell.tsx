"use client"

import { useState } from "react"
import type { Template } from "@/lib/types"
import { EditorModal } from "@/components/EditorModal"
import { FilterRow } from "@/components/FilterRow"
import { Hero } from "@/components/Hero"
import { Nav } from "@/components/Nav"
import { Sidebar } from "@/components/Sidebar"
import { TemplateGrid } from "@/components/TemplateGrid"

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
        </main>
      </div>
      <EditorModal template={active} open={open} onClose={handleClose} />
    </div>
  )
}
