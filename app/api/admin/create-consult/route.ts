// /app/api/admin/create-consult/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const body = await req.json()

  const {
    brand, // 'lifting' | 'face'
    page_source,
    page_url,
    customer_name,
    gender,
    phone,
    is_member = false,
  } = body

  let matchedSurgeryId: number | null = null
  let matchedSurgeryTitle: string | null = null


  if (!brand || (brand !== 'lifting' && brand !== 'face')) {
    return NextResponse.json({ success: false, error: '브랜드 값이 유효하지 않습니다.' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient(brand)
  
  // ✅ url_mappings 조회 시 title도 포함
  const { data: mappings, error: mappingError } = await supabase
    .from('url_mappings')
    .select('url_pattern, surgery_id, surgery_title')


  if (mappingError) {
    console.error('Failed to fetch url_mappings:', mappingError.message)
    return NextResponse.json({ success: false, error: 'URL 매핑 조회 실패' }, { status: 500 })
  }

  for (const mapping of mappings) {
    if (page_url.includes(mapping.url_pattern)) {
      matchedSurgeryId = mapping.surgery_id
      matchedSurgeryTitle = mapping.surgery_title
      break
    }
  }

  const { error: insertError } = await supabase
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
        surgery_title: matchedSurgeryTitle, // ✅ title까지 insert
      },
    ])

  if (insertError) {
    console.error('Failed to insert consult request:', insertError.message)
    return NextResponse.json({ success: false, error: '등록 실패' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
