// /lib/supabase-admin.ts
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    console.warn(`⚠️ 환경변수 ${key} 가 없습니다. 빈 문자열 반환됨`)
    return ''
  }
  return value
}

// ✅ 서비스 키 기반 Supabase 클라이언트 (지연 실행 함수)
export function getSupabaseAdminClient(brand: 'lifting' | 'face'): SupabaseClient {
  const url = getEnv(
    brand === 'lifting' ? 'SUPABASE_URL_LIFTING' : 'SUPABASE_URL_FACE'
  )
  const key = getEnv(
    brand === 'lifting'
      ? 'SUPABASE_SERVICE_ROLE_KEY_LIFTING'
      : 'SUPABASE_SERVICE_ROLE_KEY_FACE'
  )

  return createServerClient(url, key, {
    cookies: {
      get() {
        return ''
      },
      set() {},
      remove() {},
    },
  })
}
