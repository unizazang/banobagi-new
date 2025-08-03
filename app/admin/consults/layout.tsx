// /app/admin/consults/layout.tsx

import { getUserRoleFromSession } from '@/lib/getUserRoleServer'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

// ✅ 이 페이지가 어떤 브랜드에 해당하는지 명시 (face or lifting)
const BRAND = 'face' as const

export default async function AdminConsultsLayout({
  children,
}: {
  children: ReactNode
}) {
  const role = await getUserRoleFromSession(BRAND)

  if (role !== 'callteam') {
    console.warn('❌ 접근 차단: 콜팀이 아님. 현재 role:', role)
    redirect('/login')
  }

  return <>{children}</>
}
