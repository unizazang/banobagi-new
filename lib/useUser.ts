// lib/useUser.ts

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function useUser() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [supabase])

  return user
}
