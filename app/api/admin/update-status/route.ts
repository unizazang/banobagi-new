// /app/api/admin/update-status/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { id, status } = await req.json()

  const supabase = createClient('face') // or 'lifting' if you're using that

  const { error } = await supabase
    .from('consult_requests')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
