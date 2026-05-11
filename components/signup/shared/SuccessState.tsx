"use client"

import type { ReactNode } from "react"

type SuccessStateProps = {
  title: string
  subtitle: string
  children?: ReactNode
}

export function SuccessState({ title, subtitle, children }: SuccessStateProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#DCFCE7]">
        <i className="ti ti-check text-xl text-[#166534]" aria-hidden />
      </div>
      <h3 className="mb-1 font-display text-xl font-bold text-[#1A1208]">
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-[#7A6E5A]">{subtitle}</p>
      {children}
    </div>
  )
}
