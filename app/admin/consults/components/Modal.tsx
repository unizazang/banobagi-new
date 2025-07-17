import { useState } from 'react'

type ConsultRequest = {
  id: number
  customer_name: string
  gender: string
  phone: string
  page_source: string
  page_url: string
  surgery_title: string | null
  created_at: string
  status?: string
  is_member?: boolean // ← 추가
}


export default function Modal({ data, onClose }: { data: ConsultRequest; onClose: () => void }) {
  const [status, setStatus] = useState(data.status ?? '대기')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.id, status }),
      })
      const result = await res.json()
      if (result.success) {
        alert('상태가 업데이트되었습니다.')
        onClose()
      } else {
        alert('업데이트 실패')
      }
    } catch (err) {
      alert('오류 발생')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">신청 상세 정보</h2>
        <ul className="space-y-2 text-sm mb-4">
          <li><strong>이름:</strong> {data.customer_name}</li>
          <li><strong>성별:</strong> {data.gender}</li>
          <li><strong>전화번호:</strong> {data.phone}</li>
          <li><strong>시술명:</strong> {data.surgery_title ?? '-'}</li>
          <li><strong>신청일:</strong> {new Date(data.created_at).toLocaleString()}</li>
          <li><strong>페이지 출처:</strong> {data.page_source}</li>
          <li><strong>신청 URL:</strong> <a href={data.page_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.page_url}</a></li>
          <li><strong>회원 여부:</strong> {data.is_member ? '회원' : '비회원'}</li>
        </ul>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-semibold">상태:</label>
          <select className="border px-3 py-1 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="대기">대기</option>
            <option value="처리중">처리중</option>
            <option value="완료">완료</option>
          </select>
          <button onClick={handleSave} disabled={loading} className="ml-auto bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
