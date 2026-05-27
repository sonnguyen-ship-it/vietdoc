import type { WorkfeedTextPart } from "@/lib/workflow/workfeed/types"

export function HighlightLine({
  parts,
  className = "",
  darkMentions = false,
  variant = "default",
}: {
  parts: WorkfeedTextPart[]
  className?: string
  darkMentions?: boolean
  /** Boss announcement on dark post window */
  variant?: "default" | "boss-desktop"
}) {
  const isBossDesktop = variant === "boss-desktop"

  return (
    <p
      className={`font-extrabold leading-[1.15] tracking-[-0.04em] ${
        isBossDesktop ? "text-[26px] text-white" : "font-black leading-tight"
      } ${className}`}
    >
      {parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <span
              key={i}
              className={isBossDesktop ? "text-white/95" : "text-[#1a1208]"}
            >
              {part.value}
            </span>
          )
        }
        return (
          <span
            key={i}
            className={`wf-word-chip mx-0.5 ${part.large ? "text-[2rem]" : ""}`}
            style={{
              backgroundColor: part.bg,
              color: part.color ?? "#1a1208",
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
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            onDark
              ? "border border-[rgba(200,255,0,0.35)] bg-[rgba(200,255,0,0.12)] text-[#d4ff66]"
              : "wf-neon-pill-violet"
          }`}
        >
          {m}
        </span>
      ))}
    </div>
  )
}
