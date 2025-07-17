// /app/api/admin/create-consult/route.ts
import { NextResponse } from 'next/server'
import { supabaseFace } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const body = await req.json()

  const {
    page_source,
    page_url,
    customer_name,
    gender,
    phone,
    is_member = false,
  } = body

  // 1. URL 패턴 조회하여 surgery_id 자동 매핑
  let matchedSurgeryId: number | null = null

  const { data: mappings, error: mappingError } = await supabaseFace
    .from('url_mappings')
    .select('url_pattern, surgery_id')

  if (mappingError) {
    console.error('Failed to fetch url_mappings:', mappingError.message)
    return NextResponse.json({ success: false, error: 'URL 매핑 조회 실패' }, { status: 500 })
  }

  for (const mapping of mappings) {
    if (page_url.includes(mapping.url_pattern)) {
      matchedSurgeryId = mapping.surgery_id
      break
    }
  }

  // 2. 신청서 insert
  const { error: insertError } = await supabaseFace
    .from('consult_requests')
    .insert([
      {
        page_source,
        page_url,
        customer_name,
        gender,
        phone,
        is_member,
        surgery_id: matchedSurgeryId,
      },
    ])

  if (insertError) {
    console.error('Failed to insert consult request:', insertError.message)
    return NextResponse.json({ success: false, error: '등록 실패' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
