import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  // userEmail을 포함해서 파싱!
  const { id, is_hidden, source, userEmail } = await req.json()

  if (source !== 'face' && source !== 'lifting') {
    return NextResponse.json({ success: false, error: 'Invalid source' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient(source)

  const { data: existingData, error: fetchError } = await supabase
    .from('consult_requests')
    .select('is_hidden')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('consult_requests')
    .update({ is_hidden })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
  }

  // userEmail 사용, auth.getUser() 삭제
  const { error: logError } = await supabase.from('consult_logs').insert({
    consult_request_id: id,
    changed_field: 'is_hidden',
    old_value: existingData.is_hidden ? 'true' : 'false',
    new_value: is_hidden ? 'true' : 'false',
    changed_by: userEmail,
    source,
  })

  if (logError) {
    return NextResponse.json({ success: false, error: logError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
