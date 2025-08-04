'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

const SUPABASE_URL = process.env.SUPABASE_URL_FACE!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_FACE! // ✅ anon key 사용
// 또는 서비스 키를 직접 넣고 싶으면 아래 주석을 풀어주세요
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY_FACE!

export default async function AdminConsultsLayout({
  children,
}: {
  children: ReactNode
}) {
  // ✅ cookies()를 await 해서 타입 오류 방지
  const cookieStore = await cookies()

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookies: {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    set() {},
    remove() {},
  },
})


  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!user?.email) {
    console.error('❌ 사용자 인증 실패', userError)
    redirect('/login')
  }

  const { data: roleData, error: roleError } = await supabase
    .from('callteam_roles')
    .select('role')
    .ilike('email', user.email.toLowerCase().trim()) // 소문자, 공백 제거 후 비교
    .single()

  const role = roleData?.role ?? null

  if (role !== 'callteam') {
    console.warn('❌ 접근 차단: 콜팀이 아님. 현재 role:', role)
    
    redirect('/login')
  }

  return <>{children}</>
}
