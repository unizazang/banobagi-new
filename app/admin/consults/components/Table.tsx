'use client'

type ConsultRequest = {
  id: number
  customer_name: string
  gender: string
  phone: string
  page_source: string
  page_url: string
  surgery_title: string | null
  created_at: string
  status?: string // ← 추가
}

export default function Table({
  data,
  onView,
}: {
  data: ConsultRequest[]
  onView: (item: ConsultRequest) => void
}) {
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
            <th className="px-4 py-2">상태</th> {/* ✅ 새 열 추가 */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 cursor-pointer"
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
              <td className="px-4 py-2">{item.status ?? '대기'}</td> {/* ✅ 값 표시 */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
