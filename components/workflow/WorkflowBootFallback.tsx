/** Visible until Workflow client JS mounts — avoids a blank black screen when chunks fail to load. */
export function WorkflowBootFallback() {
  return (
    <div
      id="workflow-boot-fallback"
      className="flex h-[100dvh] w-full flex-col items-center justify-center bg-[#f8fafc] px-6 text-center text-[#1a1208]"
    >
      <p className="font-display text-lg font-semibold tracking-tight">
        <span className="not-italic">Viet</span>
        <em className="ml-0.5 italic text-red">Doc</em>
        <span className="ml-2 not-italic text-[#1a1208]/55">Workflow</span>
      </p>
      <p className="mt-3 text-sm font-medium text-[#1a1208]/70">Loading workflow…</p>
      <p className="mt-6 max-w-sm text-xs leading-relaxed text-[#1a1208]/45">
        If this screen does not go away, hard-refresh the page or restart the dev server:{" "}
        <code className="rounded bg-[#1a1208]/6 px-1 py-0.5 font-mono text-[10px]">
          rm -rf .next && npm run dev
        </code>
      </p>
    </div>
  )
}
