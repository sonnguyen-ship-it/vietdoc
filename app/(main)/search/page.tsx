import { redirect } from "next/navigation"

export default function SearchRedirectPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const raw = searchParams.q
  const q = typeof raw === "string" ? raw : ""
  const path = q ? `/?q=${encodeURIComponent(q)}` : "/"
  redirect(`${path}#templates`)
}
