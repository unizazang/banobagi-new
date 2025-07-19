'use client'

import { useEffect, useState } from 'react'
import { ConsultRequest } from '@/types/consult'
import { getConsultLogs } from '@/lib/getConsultLogs'

function normalizeSource(value: string): 'face' | 'lifting' {
  if (value === 'face' || value === 'lifting') return value
  if (value === 'B') return 'lifting'
  if (value === 'C') return 'face'
  return 'face'
}

export default function Modal({
  data,
  onClose,
  onUpdate,
}: {
  data: ConsultRequest
  onClose: () => void
  onUpdate: (id: number, fields: Partial<ConsultRequest>) => void
}) {
  const [status, setStatus] = useState(data.status ?? '대기')
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState(data.note ?? '')
  const [isImportant, setIsImportant] = useState(data.is_important ?? false)
  const [isHidden, setIsHidden] = useState(data.is_hidden ?? false)

  const [logs, setLogs] = useState<any[]>([])
  const [filteredLogs, setFilteredLogs] = useState<any[]>([])
  const [logUser, setLogUser] = useState<string>('')
  const [logStart, setLogStart] = useState<string>('')
  const [logEnd, setLogEnd] = useState<string>('')

  useEffect(() => {
    const fetchLogs = async () => {
      const result = await getConsultLogs(data.id, normalizeSource(data.page_source))
      setLogs(result)
      setFilteredLogs(result)
    }
    fetchLogs()
  }, [data.id, data.page_source])

  useEffect(() => {
    let filtered = [...logs]
    if (logUser) {
      filtered = filtered.filter((log) => log.changed_by === logUser)
    }
    if (logStart) {
      filtered = filtered.filter((log) => new Date(log.changed_at) >= new Date(logStart))
    }
    if (logEnd) {
      filtered = filtered.filter((log) => new Date(log.changed_at) <= new Date(logEnd))
    }
    setFilteredLogs(filtered)
  }, [logUser, logStart, logEnd, logs])

  const handleToggleHidden = async () => {
    const res = await fetch('/api/admin/update-hidden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: data.id,
        is_hidden: !isHidden,
        page_source: normalizeSource(data.page_source), // ✅ 수정
      }),
    })
    const result = await res.json()
    if (result.success) {
      setIsHidden(!isHidden)
      onUpdate(data.id, { is_hidden: !isHidden })
      alert(`신청서가 ${!isHidden ? '숨김 처리' : '복구'}되었습니다.`)
      onClose()
    } else {
      alert('처리에 실패했습니다.')
    }
  }

  const handleSaveNote = async () => {
    const res = await fetch('/api/admin/update-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: data.id,
        note,
        page_source: normalizeSource(data.page_source), // ✅ 수정
      }),
    })
    const result = await res.json()
    if (result.success) {
      onUpdate(data.id, { note })
      alert('메모가 저장되었습니다.')
      onClose()
    } else {
      alert('저장 실패')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    const source = normalizeSource(data.page_source)
    console.log('Sending status update:', {
      id: data.id,
      status,
      source,
    })

    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.id,
          status,
          source,
        }),
      })
      const result = await res.json()
      if (result.success) {
        onUpdate(data.id, { status })
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

  const handleToggleImportant = async () => {
    const res = await fetch('/api/admin/update-important', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: data.id,
        is_important: !isImportant,
        page_source: normalizeSource(data.page_source), // ✅ 수정
      }),
    })
    const result = await res.json()
    if (result.success) {
      setIsImportant(!isImportant)
      onUpdate(data.id, { is_important: !isImportant })
      alert('중요 표시가 변경되었습니다.')
    } else {
      alert('업데이트 실패')
    }
  }

  const userOptions = Array.from(new Set(logs.map((log) => log.changed_by)))

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

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleToggleImportant}
            className={isImportant ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}
          >
            ★
          </button>
          <button
            onClick={handleToggleHidden}
            className="border px-2 py-1 rounded text-sm"
          >
            {isHidden ? '숨김 해제' : '회원 숨김'}
          </button>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="대기">대기</option>
            <option value="진행중">진행중</option>
            <option value="완료">완료</option>
            <option value="취소">취소</option>
          </select>
          <button
            onClick={handleSave}
            disabled={loading}
            className="border px-2 py-1 rounded text-sm"
          >
            상태 변경
          </button>
        </div>

        <div className="mb-6">
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            onClick={handleSaveNote}
            className="mt-2 border px-2 py-1 rounded text-sm"
          >
            메모 저장
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">변경 로그</h3>
          <div className="flex gap-2 items-center mb-2">
            <select value={logUser} onChange={(e) => setLogUser(e.target.value)} className="border px-2 py-1 rounded text-sm">
              <option value="">전체 작성자</option>
              {userOptions.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input type="date" value={logStart} onChange={(e) => setLogStart(e.target.value)} className="border px-2 py-1 rounded text-sm" />
            <input type="date" value={logEnd} onChange={(e) => setLogEnd(e.target.value)} className="border px-2 py-1 rounded text-sm" />
          </div>
          {filteredLogs.length === 0 ? (
            <p className="text-sm text-gray-500">로그 없음</p>
          ) : (
            <ul className="text-xs border rounded p-2 bg-gray-50 space-y-1 max-h-48 overflow-y-auto">
              {filteredLogs.map((log, idx) => (
                <li key={idx}>
                  <strong>{log.changed_field}</strong> 변경: "{log.old_value}" → "{log.new_value}" (
                  <span className="text-gray-500">{log.changed_by}</span>,{' '}
                  {new Date(log.changed_at).toLocaleString()})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
