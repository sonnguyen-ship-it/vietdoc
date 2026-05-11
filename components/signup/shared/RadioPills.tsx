"use client"

type RadioPillsProps = {
  options: string[]
  value: string
  onChange: (val: string) => void
}

export function RadioPills({ options, value, onChange }: RadioPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 [font-family:var(--font-be-vietnam),ui-sans-serif]">
      {options.map((opt) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              selected
                ? "border-[#C8102E] bg-[#C8102E] text-white"
                : "border-[rgba(26,18,8,0.18)] bg-[#FDFAF4] text-[#7A6E5A]"
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
