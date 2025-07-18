import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, is_important, page_source } = await req.json()

  if (page_source !== 'face' && page_source !== 'lifting') {
    return NextResponse.json({ success: false, error: 'Invalid page_source' }, { status: 400 })
  }

  const supabase = createClient(page_source)

  // 1. 기존 값 조회
  const { data: existing, error: fetchError } = await supabase
    .from('consult_requests')
    .select('is_important')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    console.error('기존 중요 표시 조회 실패:', fetchError)
    return NextResponse.json({ success: false, error: '기존 값 조회 실패' }, { status: 500 })
  }

  const previousValue = existing.is_important ?? false

  // 2. 변경되지 않았다면 종료
  if (previousValue === is_important) {
    return NextResponse.json({ success: true, message: '변경 없음' })
  }

  // 3. 업데이트
  const { error: updateError } = await supabase
    .from('consult_requests')
    .update({ is_important })
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
      changed_field: 'is_important',
      old_value: previousValue.toString(),
      new_value: is_important.toString(),
      changed_by: 'callteam@' + page_source + '.com',
    })

  if (logError) {
    console.error('로그 저장 실패:', logError)
    return NextResponse.json({ success: true, warning: '로그 저장 실패' })
  }

  return NextResponse.json({ success: true })
}
