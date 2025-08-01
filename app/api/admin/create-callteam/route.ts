// /app/api/admin/create-callteam/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: '이메일과 비밀번호가 필요합니다.' }, { status: 400 })
  }

  const supabase = createClient('face')

  // ✅ 1. 콜팀 계정 생성
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      role: 'callteam',
    },
  })
console.log('LOGIN ERROR:', createError)
console.log('LOGIN DATA:', userData)
  if (createError || !userData?.user?.id) {
    return NextResponse.json({ error: '계정 생성 실패', detail: createError?.message }, { status: 500 })
  }

  const userId = userData.user.id

  // ✅ 2. 이메일 인증 강제 완료
  const { error: confirmError } = await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  })

  if (confirmError) {
    return NextResponse.json({ error: '이메일 인증 처리 실패', detail: confirmError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: '콜팀 계정 생성 및 이메일 인증 완료',
    user_id: userId,
  })
}
