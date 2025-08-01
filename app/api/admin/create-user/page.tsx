// /app/admin/create-user/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { getUserRole } from '@/lib/getUserRole'

export default function CreateUserPage() {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [target, setTarget] = useState<'face' | 'lifting'>('face')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      const userEmail = session.user.email!
      const role = await getUserRole(userEmail, 'face') // 기본 face에서 조회

      if (role === 'admin') {
        setAuthorized(true)
      } else {
        setAuthorized(false)
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const endpoint =
      target === 'face'
        ? '/api/admin/create-callteam'
        : '/api/admin/create-callteam-lifting'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const result = await res.json()
    if (result.success) {
      setMessage('✅ 계정이 성공적으로 생성되었습니다.')
      setEmail('')
      setPassword('')
    } else {
      setMessage(`❌ 오류: ${result.message}`)
    }
  }

  if (loading) return <p className="p-8">⏳ 확인 중...</p>
  if (!authorized) return <p className="p-8 text-red-500">접근 권한이 없습니다.</p>

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">콜팀 계정 생성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value as 'face' | 'lifting')}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="face">윤곽 (face)</option>
          <option value="lifting">동안 (lifting)</option>
        </select>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          계정 생성
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  )
}
