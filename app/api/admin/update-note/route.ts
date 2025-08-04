import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  // ✅ userEmail을 추가로 받음
  const { id, note, source, userEmail } = await req.json()

  if (source !== 'face' && source !== 'lifting') {
    return NextResponse.json({ success: false, error: 'Invalid source' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient(source)

  const { data: existingData, error: fetchError } = await supabase
    .from('consult_requests')
    .select('note')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('consult_requests')
    .update({ note })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
  }

  // ✅ userEmail을 그대로 로그에 기록
  const { error: logError } = await supabase.from('consult_logs').insert({
    consult_request_id: id,
    changed_field: 'note',
    old_value: existingData.note || '',
    new_value: note,
    changed_by: userEmail,
    source,
  })

  if (logError) {
    return NextResponse.json({ success: false, error: logError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
