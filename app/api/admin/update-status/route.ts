// /app/api/admin/update-status/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, status, source = 'face' } = await req.json()
  const supabase = createClient(source) // 'face' or 'lifting'

  // 1. 기존 상태값 조회
  const { data: existing, error: fetchError } = await supabase
    .from('consult_requests')
    .select('status')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    console.error('기존 상태 조회 실패:', fetchError)
    return NextResponse.json({ success: false, error: '이전 상태 조회 실패' }, { status: 500 })
  }

  const previousStatus = existing.status

  // 2. 상태값이 변경되지 않았다면 종료
  if (previousStatus === status) {
    return NextResponse.json({ success: true, message: '변경 없음' })
  }

  // 3. 상태 업데이트
  const { error: updateError } = await supabase
    .from('consult_requests')
    .update({ status })
    .eq('id', id)

  if (updateError) {
    console.error(updateError)
    return NextResponse.json({ success: false }, { status: 500 })
  }

  // 4. 로그 저장
  const { error: logError } = await supabase
    .from('consult_logs')
    .insert({
      consult_request_id: id,
      changed_field: 'status',
      old_value: previousStatus,
      new_value: status,
      changed_by: 'callteam@' + source + '.com', // 추후 JWT 연동 시 교체
    })

  if (logError) {
    console.error('로그 저장 실패:', logError)
    return NextResponse.json({ success: true, warning: '로그 저장 실패' })
  }

  return NextResponse.json({ success: true })
}
