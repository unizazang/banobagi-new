import { supabaseLifting } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  const body = await request.json()

  const email = body.email ?? 'callteam@lifting.com'
  const password = body.password ?? 'LiftingPass123!'

  const { data, error } = await supabaseLifting.auth.admin.createUser({
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
