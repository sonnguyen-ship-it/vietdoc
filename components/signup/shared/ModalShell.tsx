"use client"

import { useId, type ReactNode } from "react"

type ModalShellProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle: string
  badge?: string
  children: ReactNode
}

export function ModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
}: ModalShellProps) {
  const titleId = useId()

  return (
    <div
      className={`fixed inset-0 z-[600] flex items-end justify-center sm:items-center ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      } transition-opacity duration-200`}
      aria-hidden={!isOpen}
    >
      <div
        className="absolute inset-0 bg-[rgba(26,18,8,0.55)]"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 flex max-h-[90vh] w-full max-w-[460px] flex-col overflow-hidden rounded-lg border border-black/18 bg-white shadow-[0_8px_32px_rgba(26,18,8,0.12)] sm:m-4 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        } transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 bg-[#C8102E] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id={titleId}
                  className="text-sm font-semibold text-white"
                >
                  {title}
                </h2>
                {badge ? (
                  <span className="rounded bg-[#F5A623] px-2 py-0.5 text-[10px] font-semibold text-[#1A1208]">
                    {badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-white/75">{subtitle}</p>
            </div>
            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border border-white/30 text-white transition-opacity hover:opacity-90"
            >
              ×
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
