"use client"

import { useCallback, useRef, useState } from "react"
import { PLAN_HIGHLIGHT_COLUMN, WORKFEED_PLAN_SHEETS } from "@/lib/workflow/workfeed/planData"

function week3BracketClasses(ci: number, highlightCol: number, rowIndex: number, rowCount: number, isHeader: boolean) {
  if (ci !== highlightCol) return ""
  const parts = [
    "bg-[#fff7ed]",
    "border-[#fdba74]",
    "border-l-[3px]",
    "border-r-[3px]",
    "shadow-[inset_0_0_0_1px_rgba(251,146,60,0.15)]",
  ]
  if (isHeader) {
    parts.push("border-t-[3px]", "rounded-t-lg", "text-[#c2410c]", "font-black")
  } else if (rowIndex === rowCount - 1) {
    parts.push("border-b-[3px]", "rounded-b-lg")
  }
  return parts.join(" ")
}

const COL_W = 92
const ROW_W_FULL = 112
const ROW_W_MIN = 48
const HEADER_H = 44
const ROW_H = 40

export function WorkflowPlan() {
  const sheet = WORKFEED_PLAN_SHEETS[0]
  const highlightCol = sheet.columns.indexOf(PLAN_HIGHLIGHT_COLUMN)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolledX, setScrolledX] = useState(false)
  const rowHeaderW = scrolledX ? ROW_W_MIN : ROW_W_FULL

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setScrolledX(el.scrollLeft > 6)
  }, [])

  const cornerClass = `sticky left-0 top-0 z-30 border-b border-r border-[#1a1208]/12 bg-[#e8edf4] px-2 text-left text-[10px] font-extrabold uppercase tracking-wide text-[#1a1208]/70 shadow-[2px_2px_6px_rgba(26,18,8,0.06)] transition-[width,min-width] duration-200`
  const headerClass = `sticky top-0 z-20 border-b border-[#1a1208]/10 bg-[#e8edf4] px-2 py-2 text-left text-[10px] font-extrabold uppercase tracking-wide text-[#1a1208]/75 shadow-[0_2px_6px_rgba(26,18,8,0.05)]`
  const rowHeadClass = `sticky left-0 z-20 border-b border-r border-[#1a1208]/8 bg-[#f1f5f9] px-2 py-2 text-left text-xs font-extrabold text-blue shadow-[2px_0_6px_rgba(26,18,8,0.04)] transition-[width,min-width] duration-200`
  const cellClass = `border-b border-r border-[#1a1208]/6 bg-white px-2 py-2 text-left text-[11px] font-medium text-[#1a1208]/85 whitespace-nowrap`

  return (
    <div className="flex h-full flex-col bg-[#f8fafc] text-[#1a1208]">
      <div className="shrink-0 border-b border-[#1a1208]/10 bg-white px-4 pb-3 pt-14">
        <h1 className="text-lg font-black">Plan</h1>
        <p className="mt-0.5 text-xs font-semibold text-[#1a1208]/55">{sheet.title}</p>
        <p className="text-[10px] font-medium text-[#1a1208]/45">{sheet.subtitle}</p>
        <p className="mt-2 text-[10px] font-bold text-blue">
          Swipe ↔ columns · ↕ rows · frozen headers
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
      >
        <table className="border-separate border-spacing-0" style={{ minWidth: "max-content" }}>
          <thead>
            <tr style={{ height: HEADER_H }}>
              {sheet.columns.map((col, ci) => (
                <th
                  key={col}
                  scope="col"
                  title={col}
                  className={`${ci === 0 ? cornerClass : headerClass} ${week3BracketClasses(ci, highlightCol, 0, sheet.rows.length, true)}`}
                  style={{
                    left: ci === 0 ? 0 : undefined,
                    top: 0,
                    minWidth: ci === 0 ? rowHeaderW : COL_W,
                    width: ci === 0 ? rowHeaderW : COL_W,
                    maxWidth: ci === 0 ? rowHeaderW : COL_W,
                  }}
                >
                  <span className={ci === 0 && scrolledX ? "sr-only" : ""}>{col}</span>
                  {ci === 0 && scrolledX ? (
                    <span className="text-[9px] font-black text-[#1a1208]/60">KOC</span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, ri) => (
              <tr key={ri} style={{ height: ROW_H }}>
                {row.map((cell, ci) => {
                  const isRowLabel = ci === 0
                  const isTotal = row[0] === "TOTAL"
                  return (
                    <td
                      key={`${ri}-${ci}`}
                      title={cell}
                      className={`${isRowLabel ? rowHeadClass : cellClass} ${
                        isTotal && ci !== highlightCol ? "bg-[#fef9c3] font-bold" : ""
                      } ${isTotal ? "font-bold" : ""} ${week3BracketClasses(ci, highlightCol, ri, sheet.rows.length, false)}`}
                      style={{
                        left: isRowLabel ? 0 : undefined,
                        minWidth: isRowLabel ? rowHeaderW : COL_W,
                        width: isRowLabel ? rowHeaderW : COL_W,
                        maxWidth: isRowLabel ? rowHeaderW : COL_W,
                      }}
                    >
                      <span
                        className={`block truncate ${
                          isRowLabel && scrolledX ? "text-[10px]" : ""
                        }`}
                      >
                        {isRowLabel && scrolledX
                          ? cell.replace("@", "").slice(0, 6)
                          : cell}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
