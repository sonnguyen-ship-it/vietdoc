"use client"

export type CheckPillOption = {
  id: string
  label: string
  warning?: string
}

type CheckPillsProps = {
  options: CheckPillOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  onWarning?: (id: string, checked: boolean) => void
}

export function CheckPills({
  options,
  selected,
  onChange,
  onWarning,
}: CheckPillsProps) {
  const toggle = (id: string) => {
    const checked = !selected.includes(id)
    const next = checked
      ? [...selected, id]
      : selected.filter((x) => x !== id)
    onChange(next)
    if (id === "crack") onWarning?.(id, checked)
  }

  return (
    <div className="flex flex-col gap-2 [font-family:var(--font-be-vietnam),ui-sans-serif]">
      {options.map((opt) => {
        const isOn = selected.includes(opt.id)
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-left text-xs font-medium transition-all ${
              isOn
                ? "border-[rgba(26,18,8,0.18)] bg-[#EDE7D5] text-[#1A1208]"
                : "border-[rgba(26,18,8,0.18)] bg-[#FDFAF4] text-[#7A6E5A]"
            }`}
          >
            <i
              className={`ti flex-shrink-0 text-sm ${isOn ? "ti-square-check" : "ti-square"}`}
              aria-hidden
            />
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
