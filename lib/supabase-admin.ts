// /lib/supabase-admin.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 환경에 따라 서비스 키가 공개 프리픽스 없이 설정될 수 있으므로
// 두 이름 중 정의된 값을 사용하도록 처리한다
const SUPABASE_URL_LIFTING =
  process.env.SUPABASE_URL_LIFTING ?? process.env.NEXT_PUBLIC_SUPABASE_URL_LIFTING!
const SUPABASE_SERVICE_ROLE_KEY_LIFTING =
  process.env.SUPABASE_SERVICE_ROLE_KEY_LIFTING ??
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY_LIFTING!

const SUPABASE_URL_FACE =
  process.env.SUPABASE_URL_FACE ?? process.env.NEXT_PUBLIC_SUPABASE_URL_FACE!
const SUPABASE_SERVICE_ROLE_KEY_FACE =
  process.env.SUPABASE_SERVICE_ROLE_KEY_FACE ??
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY_FACE!

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
