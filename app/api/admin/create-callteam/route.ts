// /app/api/admin/create-callteam/route.ts

import { supabaseLifting, supabaseFace } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

// ✅ POST 요청으로 콜팀 계정 생성
export async function POST(req: Request) {
  const body = await req.json()

  const { email, password, brand } = body as {
    email: string
    password: string
    brand: 'lifting' | 'face'
  }

  if (!email || !password || !brand) {
    return NextResponse.json({ error: '이메일, 비밀번호, 브랜드는 필수입니다.' }, { status: 400 })
  }

  // ✅ 브랜드에 따라 Supabase 인스턴스 선택
  const supabase = brand === 'lifting' ? supabaseLifting : supabaseFace

  // ✅ Supabase auth를 통해 계정 생성
  const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { role: 'callteam' },
  })

  if (signUpError) {
    console.error('❌ 사용자 생성 실패:', signUpError)
    return NextResponse.json({ error: '콜팀 계정 생성 실패', details: signUpError.message }, { status: 500 })
  }

  // ✅ users 테이블에도 삽입
  const { error: userInsertError } = await supabase.from('users').insert({
    email,
    role: 'callteam',
  })

  if (userInsertError) {
    console.error('❌ users 테이블 삽입 실패:', userInsertError)
    return NextResponse.json({ error: 'users 테이블 추가 실패', details: userInsertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, userId: signUpData.user?.id })
}
