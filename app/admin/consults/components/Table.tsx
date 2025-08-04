'use client'

import { ConsultRequest } from '@/types/consult'
import useUser from '@/lib/useUser'

function normalizeSource(value: string): 'face' | 'lifting' {
  if (value === 'face' || value === 'lifting') return value
  if (value === 'B') return 'lifting'
  if (value === 'C') return 'face'
  return 'face'
}

export default function Table({
  data,
  onView,
  onUpdate,
}: {
  data: ConsultRequest[]
  onView: (item: ConsultRequest) => void
  onUpdate: (id: number, fields: Partial<ConsultRequest>) => void
}) {

  const user = useUser()
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-2">이름</th>
            <th className="px-4 py-2">성별</th>
            <th className="px-4 py-2">전화번호</th>
            <th className="px-4 py-2">시술명</th>
            <th className="px-4 py-2">출처</th>
            <th className="px-4 py-2">페이지 URL</th>
            <th className="px-4 py-2">신청일</th>
            <th className="px-4 py-2">상태</th>
            <th className="px-4 py-2">회원 여부</th>
            <th className="px-4 py-2">★</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-50 cursor-pointer ${item.is_hidden ? 'opacity-50' : ''}`} // ✅ 흐리게 표시
              onClick={() => onView(item)}
            >
              <td className="px-4 py-2">{item.customer_name}</td>
              <td className="px-4 py-2">{item.gender}</td>
              <td className="px-4 py-2">{item.phone}</td>
              <td className="px-4 py-2">{item.surgery_title ?? '-'}</td>
              <td className="px-4 py-2">{item.page_source}</td>
              <td className="px-4 py-2 truncate max-w-xs">
                <a
                  href={item.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {item.page_url}
                </a>
              </td>
              <td className="px-4 py-2">
                {new Date(item.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {item.status ?? '대기'}
                {item.is_hidden && (
                  <span className="ml-1 text-xs text-red-500">(숨김)</span> // ✅ 숨김 표시 추가
                )}
              </td>
              <td className="px-4 py-2">{item.is_member ? '회원' : '비회원'}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    const res = await fetch('/api/admin/update-important', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: item.id,
                        is_important: !item.is_important,
                        source: normalizeSource(item.page_source),
                        userEmail: user?.email, // ← 추가!
                      }),
                    })
                    const result = await res.json()
                    if (result.success) {
                      onUpdate(item.id, { is_important: !item.is_important })
                    } else {
                      alert('업데이트 실패')
                    }
                  }}
                  className={item.is_important ? 'text-yellow-400 text-xl' : 'text-gray-300'}
                >
                  ★
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
