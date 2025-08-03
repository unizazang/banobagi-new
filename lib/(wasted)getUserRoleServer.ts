// /lib/getUserRoleServer.ts
import { getSSRClient } from './supabase-admin'

export async function getUserRoleFromSession(brand: 'lifting' | 'face') {
  const supabase = getSSRClient(brand)

  // ✅ 현재 로그인된 사용자 가져오기
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || !user.email) {
    console.error('❌ 사용자 인증 실패', userError)
    return null
  }

  // ✅ 해당 사용자 이메일 기반 role 조회
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('email', user.email)
    .single()

  if (error || !data) {
    console.error('❌ 권한 조회 실패', error)
    return null
  }

  return data.role as string
}
