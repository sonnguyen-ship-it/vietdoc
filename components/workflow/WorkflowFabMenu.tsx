"use client"

type FabAction = {
  id: string
  label: string
  icon: string
  offsetX: number
  offsetY: number
  onClick: () => void
}

type WorkflowFabMenuProps = {
  open: boolean
  onToggle: () => void
  onHighlight: () => void
  onNote: () => void
}

const SPIN_ACTIONS: Omit<FabAction, "onClick">[] = [
  { id: "post", label: "Post", icon: "↑", offsetX: -56, offsetY: -52 },
  { id: "highlight", label: "Highlight", icon: "◎", offsetX: 0, offsetY: -72 },
  { id: "note", label: "Note", icon: "✎", offsetX: 56, offsetY: -52 },
]

export function WorkflowFabMenu({ open, onToggle, onHighlight, onNote }: WorkflowFabMenuProps) {
  const actions: FabAction[] = SPIN_ACTIONS.map((a) => ({
    ...a,
    onClick:
      a.id === "highlight" ? onHighlight : a.id === "note" ? onNote : onToggle,
  }))

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(0.35rem,env(safe-area-inset-bottom))]">
      {open ? (
        <button
          type="button"
          className="pointer-events-auto fixed inset-0 z-40 bg-black/25"
          aria-label="Close menu"
          onClick={onToggle}
        />
      ) : null}

      <div className="relative z-50 h-14 w-14">
        {actions.map((action, i) => (
          <button
            key={action.id}
            type="button"
            onClick={() => {
              action.onClick()
              if (action.id !== "highlight" && action.id !== "note") onToggle()
            }}
            className="pointer-events-auto absolute left-1/2 top-1/2 flex h-11 w-11 flex-col items-center justify-center rounded-full bg-white text-[#1a1208] shadow-lg ring-1 ring-black/10 transition-all duration-300 ease-out"
            style={{
              transform: open
                ? `translate(calc(-50% + ${action.offsetX}px), calc(-50% + ${action.offsetY}px)) scale(1)`
                : "translate(-50%, -50%) scale(0)",
              opacity: open ? 1 : 0,
              transitionDelay: open ? `${i * 45}ms` : "0ms",
            }}
            aria-label={action.label}
          >
            <span className="text-base leading-none">{action.icon}</span>
            <span className="mt-0.5 text-[8px] font-extrabold">{action.label}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={onToggle}
          className={`pointer-events-auto absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red text-2xl font-light text-white shadow-lg transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-label={open ? "Close create menu" : "Create"}
          aria-expanded={open}
        >
          ＋
        </button>
      </div>
    </div>
  )
}
