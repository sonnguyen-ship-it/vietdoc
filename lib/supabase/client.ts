import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getSupabasePublicKey, isSupabasePublicConfigured } from "@/lib/supabase/env"

let browserClient: SupabaseClient | null = null

/** Browser Supabase client (anon / publishable key). Returns null if env is not configured. */
export function createSupabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = getSupabasePublicKey()
  if (!url || !anonKey) return null

  if (typeof window === "undefined") {
    return createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return browserClient
}

export function isSupabaseBrowserConfigured(): boolean {
  return isSupabasePublicConfigured()
}
