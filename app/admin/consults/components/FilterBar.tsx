'use client'

import { useState, useEffect } from 'react'
import { FilterValues } from '@/types/consult'

export default function FilterBar({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterValues) => void
}) {
  const [filters, setFilters] = useState<FilterValues>({
    name: '',
    phone: '',
    gender: '',
    startDate: '',
    endDate: '',
    sort: 'desc', // 최신순 기본값
    showHidden: false,
    isMember: '', // ✅ 초기값 추가
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

      {/* 성별 필터 */}
      <select
        className="border px-3 py-2 rounded"
        value={filters.gender}
        onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
      >
        <option value="">전체 성별</option>
        <option value="여성">여성</option>
        <option value="남성">남성</option>
      </select>

      {/* 회원 여부 필터 - ✅ 수정된 값 */}
      <select
        className="border px-3 py-2 rounded"
        value={filters.isMember}
        onChange={(e) =>
          setFilters({ ...filters, isMember: e.target.value as '' | 'true' | 'false' })
        }
      >
        <option value="">전체 회원여부</option>
        <option value="true">회원</option>
        <option value="false">비회원</option>
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

      {/* 정렬 옵션 */}
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

      {/* 숨김 포함 */}
      <label className="text-sm flex items-center gap-1">
        <input
          type="checkbox"
          checked={filters.showHidden}
          onChange={(e) =>
            setFilters({ ...filters, showHidden: e.target.checked })
          }
        />
        숨김 포함
      </label>
    </div>
  )
}
