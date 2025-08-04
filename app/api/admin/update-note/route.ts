import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, note, source } = await req.json()

  if (source !== 'face' && source !== 'lifting') {
    return NextResponse.json({ success: false, error: 'Invalid source' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient(source)

  // Modified: maybeSingle() 사용 (선택사항)
  const { data: existing, error: fetchError } = await supabase
    .from('consult_requests')
    .select('note')
    .eq('id', id)
    .maybeSingle()
  if (fetchError) console.error('[update-note] 조회 에러:', fetchError)

  // Modified: 바로 update
  const { error } = await supabase
    .from('consult_requests')
    .update({ note })
    .eq('id', id)

  if (error) {
    console.error('[update-note] 업데이트 실패:', error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
