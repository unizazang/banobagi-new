// /lib/supabase-admin.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ✅ .env.local에서 NEXT_PUBLIC_ prefix 제거된 변수를 사용하는 버전
const SUPABASE_URL_LIFTING = process.env.SUPABASE_URL_LIFTING!
const SUPABASE_SERVICE_ROLE_KEY_LIFTING = process.env.SUPABASE_SERVICE_ROLE_KEY_LIFTING!

const SUPABASE_URL_FACE = process.env.SUPABASE_URL_FACE!
const SUPABASE_SERVICE_ROLE_KEY_FACE = process.env.SUPABASE_SERVICE_ROLE_KEY_FACE!

// ✅ 각각의 supabase 클라이언트 (lifting, face)
export const supabaseLifting = createSupabaseClient(
  SUPABASE_URL_LIFTING,
  SUPABASE_SERVICE_ROLE_KEY_LIFTING
)

export const supabaseFace = createSupabaseClient(
  SUPABASE_URL_FACE,
  SUPABASE_SERVICE_ROLE_KEY_FACE
)

// ✅ 동적으로 분기하는 클라이언트 팩토리 함수
export function createClient(target: 'face' | 'lifting') {
  if (target === 'face') {
    return createSupabaseClient(SUPABASE_URL_FACE, SUPABASE_SERVICE_ROLE_KEY_FACE)
  } else {
    return createSupabaseClient(SUPABASE_URL_LIFTING, SUPABASE_SERVICE_ROLE_KEY_LIFTING)
  }
}
