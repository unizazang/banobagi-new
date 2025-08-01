import { getUserRoleFromSession } from '@/lib/getUserRoleServer'
import { redirect } from 'next/navigation'

export default async function ConsultLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRoleFromSession()

  if (role !== 'callteam') {
    redirect('/login') // ✅ 콜팀이 아닐 경우 접근 차단
  }

  return <>{children}</>
}
