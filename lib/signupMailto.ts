/**
 * Set NEXT_PUBLIC_SIGNUP_EMAIL in Vercel (or .env.local) to your inbox.
 * Signup flows open a mail draft via mailto: — no server or external API.
 */
export function signupInbox(): string {
  return (process.env.NEXT_PUBLIC_SIGNUP_EMAIL ?? "").trim()
}

/** Opens the visitor's default mail app with a pre-filled draft. */
export function openMailtoDraft(to: string, subject: string, body: string): void {
  const url = new URL(`mailto:${to}`)
  url.searchParams.set("subject", subject)
  url.searchParams.set("body", body)
  const a = document.createElement("a")
  a.href = url.toString()
  a.rel = "noopener noreferrer"
  a.setAttribute("aria-hidden", "true")
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
