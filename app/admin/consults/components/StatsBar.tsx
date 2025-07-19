// /app/admin/consults/components/StatsBar.tsx
'use client'

import { ConsultRequest } from '@/types/consult'

export default function StatsBar({ data }: { data: ConsultRequest[] }) {
  const total = data.length
  const memberCount = data.filter((item) => item.is_member).length
  const nonMemberCount = total - memberCount

  return (
    <div className="flex gap-6 items-center mb-4 text-sm text-gray-700 bg-gray-50 px-4 py-2 border rounded">
      <div>
        <strong>전체:</strong> {total.toLocaleString()}건
      </div>
      <div>
        <strong>회원:</strong> {memberCount.toLocaleString()}건
      </div>
      <div>
        <strong>비회원:</strong> {nonMemberCount.toLocaleString()}건
      </div>
    </div>
  )
}
