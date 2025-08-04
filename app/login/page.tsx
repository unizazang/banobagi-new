'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError('로그인에 실패했습니다.')
      return
    }

    // 로그인 후 이메일로 callteam_roles에서 직접 role 확인
    const { data: roleData, error: roleError } = await supabase
      .from('callteam_roles')
      .select('role')
      .eq('email', email.toLowerCase().trim()) // 이메일 소문자, 공백 제거 필수
      .single()

    if (roleError || roleData?.role !== 'callteam') {
      setError('콜팀 계정이 아닙니다.')
      await supabase.auth.signOut()
      return
    }

    router.replace('/admin/consults')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleLogin} className="bg-white border p-6 rounded max-w-sm w-full shadow">
        <h1 className="text-xl font-bold mb-4">콜팀 로그인</h1>
        <input
          type="email"
          placeholder="이메일"
          className="border px-3 py-2 rounded w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="border px-3 py-2 rounded w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          로그인
        </button>
      </form>
    </main>
  )
}
