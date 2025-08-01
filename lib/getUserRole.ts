// /lib/getUserRole.ts
// 클라이언트에서 사용자 권한을 조회하기 위한 유틸
// 서비스 로드 키를 노출하지 않기 위해 브라우저 클라이언트를 사용합니다.
import { createClient } from './supabase'

export async function getUserRole(email: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('email', email)
    .single()

  if (error || !data) {
    console.error('권한 조회 실패', error)
    return null
  }

  return data.role as string
}
