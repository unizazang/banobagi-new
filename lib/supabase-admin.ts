// lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseLifting = createClient(
  process.env.SUPABASE_URL_LIFTING!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_LIFTING!
)

export const supabaseFace = createClient(
  process.env.SUPABASE_URL_FACE!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_FACE!
)
