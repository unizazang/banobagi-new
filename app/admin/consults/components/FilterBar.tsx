// /app/admin/consults/components/FilterBar.tsx
'use client'

import { useState, useEffect } from 'react'
import { FilterValues } from '@/types/consult'


export default function FilterBar({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterValues) => void
}) {

  // 초기값 설정
const [filters, setFilters] = useState<FilterValues>({
  name: '',
  phone: '',
  gender: '',
  startDate: '',
  endDate: '',
  sort: 'desc', // 최신순 기본값
})


  useEffect(() => {
    onFilterChange(filters)
  }, [filters])

  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
  {/* 이름 검색 */}
  <input
    type="text"
    placeholder="이름"
    className="border px-3 py-2 rounded"
    value={filters.name}
    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
  />

  {/* 전화번호 검색 */}
  <input
    type="text"
    placeholder="전화번호"
    className="border px-3 py-2 rounded"
    value={filters.phone}
    onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
  />

  {/* 성별 필터 → 기존 그대로 유지 */}
  <select
    className="border px-3 py-2 rounded"
    value={filters.gender}
    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
  >
    <option value="">전체 성별</option>
    <option value="여성">여성</option>
    <option value="남성">남성</option>
  </select>

  {/* 날짜 필터 */}
  <input
    type="date"
    className="border px-3 py-2 rounded"
    value={filters.startDate}
    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
  />
  <input
    type="date"
    className="border px-3 py-2 rounded"
    value={filters.endDate}
    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
  />

  {/* ✅ 정렬 옵션 추가 */}
  <select
    className="border px-3 py-2 rounded"
    value={filters.sort}
    onChange={(e) =>
      setFilters({ ...filters, sort: e.target.value as 'asc' | 'desc' })
    }
  >
    <option value="desc">최신순</option>
    <option value="asc">오래된순</option>
  </select>
</div>

  )
}
