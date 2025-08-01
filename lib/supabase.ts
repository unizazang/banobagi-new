import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL_FACE!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_FACE!
  )
}