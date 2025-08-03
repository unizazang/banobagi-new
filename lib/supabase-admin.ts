// /lib/supabase-admin.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { CookieMethods,   } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// ✅ 환경변수 유효성 검사
function ensure(value: string | undefined, name: string): string {
  if (!value) throw new Error(`❌ 환경변수 ${name}가 설정되지 않았습니다.`)
  return value
}

// ✅ 환경변수
const SUPABASE_URL_LIFTING = ensure(process.env.SUPABASE_URL_LIFTING, 'SUPABASE_URL_LIFTING')
const SUPABASE_SERVICE_ROLE_KEY_LIFTING = ensure(
  process.env.SUPABASE_SERVICE_ROLE_KEY_LIFTING,
  'SUPABASE_SERVICE_ROLE_KEY_LIFTING'
)
const SUPABASE_URL_FACE = ensure(process.env.SUPABASE_URL_FACE, 'SUPABASE_URL_FACE')
const SUPABASE_SERVICE_ROLE_KEY_FACE = ensure(
  process.env.SUPABASE_SERVICE_ROLE_KEY_FACE,
  'SUPABASE_SERVICE_ROLE_KEY_FACE'
)

// ✅ SSR 기반 Supabase 서버 클라이언트 생성 (brand 분기형)



// ✅ 서버에서 SSR 인증 포함 Supabase 클라이언트 생성
export function getSSRClient(brand: 'lifting' | 'face'): SupabaseClient {
    const cookieStore = cookies() as unknown as CookieMethods
  // ↑ 타입 단언으로 강제로 CookieMethods로 고정 (실제 내부 구현과 일치)
  const url =
    brand === 'lifting' ? SUPABASE_URL_LIFTING : SUPABASE_URL_FACE
  const key =
    brand === 'lifting'
      ? SUPABASE_SERVICE_ROLE_KEY_LIFTING
      : SUPABASE_SERVICE_ROLE_KEY_FACE

  return createServerClient(url, key, {
    cookies: cookieStore
  })
}

// ✅ 서비스 키 기반 정적 클라이언트 (API 용도)
export const supabaseLifting = createServerClient(
  SUPABASE_URL_LIFTING,
  SUPABASE_SERVICE_ROLE_KEY_LIFTING,{
    cookies: {
      get() {
        return ''
      },
      set() {},
      remove() {},
    },
  }
)

export const supabaseFace = createServerClient(
  SUPABASE_URL_FACE,
  SUPABASE_SERVICE_ROLE_KEY_FACE,{
    cookies: {
      get() {
        return ''
      },
      set() {},
      remove() {},
    },
  }
)