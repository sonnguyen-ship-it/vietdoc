import type { WorkfeedAuthor } from "@/lib/workflow/workfeed/types"

type WorkflowAuthorRowProps = {
  author: WorkfeedAuthor
  tagRow?: string
}

export function WorkflowAuthorRow({ author, tagRow }: WorkflowAuthorRowProps) {
  const textMain = author.lightText ? "text-white" : "text-[#1a1208]"
  const textSub = author.lightText ? "text-white/60" : "text-[#1a1208]/65"

  return (
    <div className={`min-w-0 flex-1 ${textMain}`}>
      <div className="mb-1 flex items-center gap-2">
        <span
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
          style={{ backgroundColor: author.avatarBg }}
        >
          {author.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">{author.name}</p>
          <p className={`truncate text-xs font-medium ${textSub}`}>{author.sub}</p>
        </div>
      </div>
      {tagRow ? (
        <p className={`text-xs font-bold ${author.lightText ? "text-white/75" : "text-[#1a1208]/70"}`}>
          {tagRow}
        </p>
      ) : null}
    </div>
  )
}
