const PILL_BASE =
  "inline-block rounded-[20px] border px-2 py-0.5 text-center text-[10px] font-semibold leading-tight whitespace-nowrap"

const STATUS_STYLES: Record<string, string> = {
  Live: `${PILL_BASE} border-[rgba(34,197,94,0.30)] bg-[rgba(34,197,94,0.15)] text-[#14532d]`,
  Active: `${PILL_BASE} border-[rgba(34,197,94,0.30)] bg-[rgba(34,197,94,0.15)] text-[#14532d]`,
  "In progress": `${PILL_BASE} border-[rgba(179,136,255,0.30)] bg-[rgba(179,136,255,0.15)] text-[#3c1f7a]`,
  Planned: `${PILL_BASE} border-[rgba(200,255,0,0.30)] bg-[rgba(200,255,0,0.15)] text-[#3a4f00]`,
  Scheduled: `${PILL_BASE} border-[rgba(255,107,107,0.30)] bg-[rgba(255,107,107,0.12)] text-[#6b1010]`,
  "On track": `${PILL_BASE} border-[rgba(0,229,255,0.30)] bg-[rgba(0,229,255,0.12)] text-[#004d55]`,
  Done: `${PILL_BASE} border-[rgba(0,0,0,0.10)] bg-[rgba(0,0,0,0.07)] text-[rgba(26,18,8,0.50)]`,
}

export function planStatusPillClass(status: string): string | null {
  const trimmed = status.trim()
  if (!trimmed || trimmed === "—") return null
  return STATUS_STYLES[trimmed] ?? null
}

export function isPlanStatusColumn(colName: string): boolean {
  return colName === "Status"
}

export function isPlanRoasColumn(colName: string): boolean {
  return colName === "ROAS"
}
