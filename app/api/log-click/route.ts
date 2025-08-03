// /app/api/log-click/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'


export async function POST(req: Request) {
  const body = await req.json()
  const { from_page, to_page,brand } = body


  const supabase = getSupabaseAdminClient(brand)
  if (!from_page || !to_page) {
    return NextResponse.json(
      { success: false, error: 'from_page와 to_page는 필수입니다.' },
      { status: 400 }
    )
  }

  const { error } = await brand
    .from('click_logs')
    .insert([{ from_page, to_page }])

  if (error) {
    console.error('Click log 저장 실패:', error.message)
    return NextResponse.json({ success: false, error: '로그 저장 실패' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
