import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST(request: Request) {
const body = await request.json()

  const { email, password, brand } = body as {
    email: string
    password: string
    brand: 'lifting' | 'face'
  }

  // ✅ lifting 브랜드 기준 Supabase 클라이언트 생성
  const supabase = getSupabaseAdminClient(brand)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      role: 'callteam'
    },
    email_confirm: true
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ user: data.user }), { status: 200 });
}
