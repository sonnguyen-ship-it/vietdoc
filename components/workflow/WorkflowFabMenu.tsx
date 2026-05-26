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
    <div className="pointer-events-none absolute inset-x-0 bottom-[max(0.35rem,env(safe-area-inset-bottom))] flex justify-center">
      <div className="relative h-14 w-14">
        {actions.map((action, i) => (
          <button
            key={action.id}
            type="button"
            onClick={() => {
              action.onClick()
              if (action.id !== "highlight" && action.id !== "note") onToggle()
            }}
            className={`absolute left-1/2 top-1/2 flex h-11 w-11 flex-col items-center justify-center rounded-full bg-white text-[#1a1208] shadow-lg ring-1 ring-black/10 transition-all duration-300 ease-out ${
              open ? "pointer-events-auto" : "pointer-events-none"
            }`}
            style={{
              transform: open
                ? `translate(calc(-50% + ${action.offsetX}px), calc(-50% + ${action.offsetY}px)) scale(1)`
                : "translate(-50%, -50%) scale(0)",
              opacity: open ? 1 : 0,
              visibility: open ? "visible" : "hidden",
              transitionDelay: open ? `${i * 45}ms` : "0ms",
            }}
            aria-label={action.label}
            aria-hidden={!open}
            tabIndex={open ? 0 : -1}
          >
            <span className="text-base leading-none">{action.icon}</span>
            <span className="mt-0.5 text-[8px] font-extrabold">{action.label}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={onToggle}
          className={`pointer-events-auto absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full bg-red text-2xl font-light text-white shadow-lg transition-transform duration-300 ${
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
