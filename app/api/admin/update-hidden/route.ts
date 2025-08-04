import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, is_hidden, source } = await req.json()

  // Modified: 통일된 error key 사용
  if (source !== 'face' && source !== 'lifting') {
    return NextResponse.json({ success: false, error: 'Invalid source' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient(source)

  // Modified: maybeSingle() 사용하여 0 rows 에러 방지
  const { data: existing, error: fetchError } = await supabase
    .from('consult_requests')
    .select('is_hidden')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) console.error('[update-hidden] 조회 에러:', fetchError)
  const previousValue = existing?.is_hidden ?? false  // Modified: 기존 값 없을 시 false 기본

  // 2. 변경되지 않았다면 종료
  if (previousValue === is_hidden) {
    return NextResponse.json({ success: true, message: '변경 없음' })
  }

  // Modified: select 단계 제거, 바로 update
  const { error: updateError } = await supabase
    .from('consult_requests')
    .update({ is_hidden })
    .eq('id', id)

  if (updateError) {
    console.error('[update-hidden] 업데이트 실패:', updateError)
    return NextResponse.json({ success: false }, { status: 500 })
  }

  // 4. 로그 저장
  const { error: logError } = await supabase
    .from('consult_logs')
    .insert({
      consult_request_id: id,
      changed_field: 'is_hidden',
      old_value: previousValue.toString(),
      new_value: is_hidden.toString(),
      changed_by: 'callteam@' + source + '.com',
    })

  if (logError) console.error('[update-hidden] 로그 저장 실패:', logError)
  return NextResponse.json({ success: true })
}
