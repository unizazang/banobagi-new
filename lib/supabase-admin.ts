// /lib/supabase-admin.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL_LIFTING = process.env.NEXT_PUBLIC_SUPABASE_URL_LIFTING!
const SUPABASE_SERVICE_ROLE_KEY_LIFTING = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY_LIFTING!

const SUPABASE_URL_FACE = process.env.NEXT_PUBLIC_SUPABASE_URL_FACE!
const SUPABASE_SERVICE_ROLE_KEY_FACE = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY_FACE!

// 각각의 클라이언트 (기존 사용 방식도 그대로 지원)
export const supabaseLifting = createSupabaseClient(
  SUPABASE_URL_LIFTING,
  SUPABASE_SERVICE_ROLE_KEY_LIFTING
)

export const supabaseFace = createSupabaseClient(
  SUPABASE_URL_FACE,
  SUPABASE_SERVICE_ROLE_KEY_FACE
)

// ✅ 분기형 클라이언트 생성 함수
export function createClient(target: 'face' | 'lifting') {
  if (target === 'face') {
    return createSupabaseClient(SUPABASE_URL_FACE, SUPABASE_SERVICE_ROLE_KEY_FACE)
  } else {
    return createSupabaseClient(SUPABASE_URL_LIFTING, SUPABASE_SERVICE_ROLE_KEY_LIFTING)
  }
}
