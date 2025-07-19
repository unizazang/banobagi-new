// /lib/getUserRole.ts
import { createClient } from './supabase-admin'

export async function getUserRole(email: string, source: 'face' | 'lifting') {
  const supabase = createClient(source)
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
