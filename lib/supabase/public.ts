import { createClient } from "@supabase/supabase-js"
import { getSupabasePublicKey } from "@/lib/supabase/env"

/** Server or client: public key + RLS (e.g. Workflow feed read). */
export function createSupabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = getSupabasePublicKey()
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
