import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, status, source } = await req.json()

  // Modified: error key 통일
  if (source !== 'face' && source !== 'lifting') {
    return NextResponse.json({ success: false, error: 'Invalid source' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient(source)

  // Modified: 직접 update만 수행
  const { error } = await supabase
    .from('consult_requests')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('[update-status] 업데이트 실패:', error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}