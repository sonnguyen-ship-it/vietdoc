"use client"

export function WorkflowProfile() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white px-6 pt-14 pb-24 text-center text-[#1a1208]">
      <span
        className="flex h-20 w-20 items-center justify-center rounded-full text-xl font-extrabold text-white"
        style={{ backgroundColor: "#2563eb" }}
      >
        E2
      </span>
      <h1 className="mt-4 text-xl font-black">employee2</h1>
      <p className="mt-1 text-sm font-semibold text-[#1a1208]/55">Marketing · Team Campaign A</p>
      <p className="mt-6 max-w-xs text-sm font-medium text-[#1a1208]/65">
        Profile settings and posts will connect to Supabase in a later sprint.
      </p>
    </div>
  )
}
