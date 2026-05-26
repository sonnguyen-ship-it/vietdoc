import { openMailtoDraft, signupInbox } from "@/lib/signupMailto"
import {
  postSignup,
  type CompanySignupPayload,
  type IndividualSignupPayload,
} from "@/lib/submitSignup"

export type SignupDeliveryMode = "supabase" | "mailto" | "none"

/** Saves to Supabase when configured; otherwise opens mailto when inbox env is set. */
export async function deliverSignup(
  payload: IndividualSignupPayload | CompanySignupPayload,
  mailto: { subject: string; body: string }
): Promise<{ mode: SignupDeliveryMode; error?: string }> {
  const r = await postSignup(payload)
  if (r.status === "saved") return { mode: "supabase" }

  const inbox = signupInbox()
  if (inbox) {
    openMailtoDraft(inbox, mailto.subject, mailto.body)
    return { mode: "mailto" }
  }

  if (r.status === "error") return { mode: "none", error: r.message }
  return { mode: "none" }
}
