import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, is_important, source } = await req.json()

  if (source !== 'face' && source !== 'lifting') {
    return NextResponse.json({ success: false, error: 'Invalid source' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient(source)

  // Modified: maybeSingle() 사용하여 0 rows 에러 방지
  const { data: existing, error: fetchError } = await supabase
    .from('consult_requests')
    .select('is_important')
    .eq('id', id)
    .maybeSingle()
  if (fetchError) console.error('[update-important] 조회 에러:', fetchError)

  const previousValue = existing?.is_important ?? false
  if (previousValue === is_important) {
    return NextResponse.json({ success: true, message: '변경 없음' })
  }

  // Modified: 직접 update 수행
  const { error } = await supabase
    .from('consult_requests')
    .update({ is_important })
    .eq('id', id)

  if (error) {
    console.error('[update-important] 업데이트 실패:', error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
