// /lib/getUserRoleServer.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getUserRoleFromSession() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL_FACE!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_FACE!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('email', user.email)
    .single()

  if (error || !data) {
    console.error('권한 조회 실패', error)
    return null
  }

  return data.role as string
} 