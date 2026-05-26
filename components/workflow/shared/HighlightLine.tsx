import type { WorkfeedTextPart } from "@/lib/workflow/workfeed/types"

export function HighlightLine({
  parts,
  className = "",
  darkMentions = false,
}: {
  parts: WorkfeedTextPart[]
  className?: string
  darkMentions?: boolean
}) {
  return (
    <p className={`font-black leading-tight ${className}`}>
      {parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <span key={i} className="text-[#1a1208]">
              {part.value}
            </span>
          )
        }
        return (
          <span
            key={i}
            className="mx-0.5 inline-block rounded-md px-1.5 py-0.5 align-middle"
            style={{
              backgroundColor: part.bg,
              color: part.color ?? "#1a1208",
              fontSize: part.large ? "2rem" : undefined,
              lineHeight: part.large ? 1.1 : undefined,
            }}
          >
            {part.value}
          </span>
        )
      })}
      {darkMentions ? null : null}
    </p>
  )
}

export function MentionPills({ mentions, onDark }: { mentions: string[]; onDark?: boolean }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {mentions.map((m) => (
        <span
          key={m}
          className="rounded-full px-3 py-1 text-sm font-bold"
          style={{
            backgroundColor: onDark ? "rgba(125, 211, 252, 0.2)" : "rgba(29, 78, 216, 0.12)",
            color: onDark ? "#7dd3fc" : "#1d4ed8",
          }}
        >
          {m}
        </span>
      ))}
    </div>
  )
}
