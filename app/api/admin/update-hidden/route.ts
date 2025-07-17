import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, is_hidden, page_source } = await req.json()

  if (page_source !== 'face' && page_source !== 'lifting') {
    return NextResponse.json({ success: false, error: 'Invalid page_source' }, { status: 400 })
  }

  const supabase = createClient(page_source)

  const { error } = await supabase
    .from('consult_requests')
    .update({ is_hidden })
    .eq('id', id)

  if (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
