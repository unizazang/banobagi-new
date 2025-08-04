import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, is_important, source } = await req.json()

  // 1) source 검증
  if (source !== 'face' && source !== 'lifting') {
    return NextResponse.json(
      { success: false, error: 'Invalid source' },
      { status: 400 }
    )
  }

  // 2) Admin 권한 클라이언트 (supabase-ssr에 서비스 역할 키 전달)
  const supabase = getSupabaseAdminClient(source)

  // ────────────────────────────────
  // ❌ 기존에 있던 .select('is_important') 조회 로직을 모두 제거했습니다.
  // ────────────────────────────────

  // 3) 바로 업데이트만 수행
  const { error } = await supabase
    .from('consult_requests')
    .update({ is_important })
    .eq('id', id)

    console.log({ id, is_important, source, type: typeof is_important })

  if (error) {
    console.error('[update-important] 업데이트 실패:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }

  // 4) 성공 응답
  return NextResponse.json({ success: true })
}
