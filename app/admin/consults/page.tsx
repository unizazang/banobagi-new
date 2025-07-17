// /app/admin/consults/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { getConsultRequests } from '@/lib/getConsultRequests'
import Table from './components/Table'
import FilterBar from './components/FilterBar'
import Modal from './components/Modal'
import ExportButton from './components/ExportButton'

type FilterValues = {
  name: string
  phone: string
  gender: string
  startDate: string
  endDate: string
  sort: 'asc' | 'desc'
}


type ConsultRequest = {
  id: number
  customer_name: string
  gender: string
  phone: string
  page_source: string
  page_url: string
  surgery_title: string | null
  created_at: string
}


export default function ConsultsPage() {
  const [originalData, setOriginalData] = useState<ConsultRequest[]>([])
  const [filteredData, setFilteredData] = useState<ConsultRequest[]>([])
  const [selectedItem, setSelectedItem] = useState<ConsultRequest | null>(null)

  useEffect(() => {
    // 초기에 face 데이터 불러오기
    getConsultRequests('face').then((data) => {
      setOriginalData(data)
      setFilteredData(data)
    })
  }, [])

  const handleFilterChange = (filters: FilterValues) => {
  const filtered = originalData
    .filter((item) => {
      const matchesName = item.customer_name
        .toLowerCase()
        .includes(filters.name.toLowerCase())
      const matchesPhone = item.phone.includes(filters.phone)
      const matchesGender =
        filters.gender === '' || item.gender === filters.gender

      const createdAt = new Date(item.created_at)
      const start = filters.startDate ? new Date(filters.startDate) : null
      const end = filters.endDate ? new Date(filters.endDate) : null

      const matchesDate =
        (!start || createdAt >= start) && (!end || createdAt <= end)

      return matchesName && matchesPhone && matchesGender && matchesDate
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return filters.sort === 'desc' ? dateB - dateA : dateA - dateB
    })

  setFilteredData(filtered)
}



   return (
    <main className="p-8 relative">
      <h1 className="text-2xl font-bold mb-4">콜팀 신청 내역 (윤곽)</h1>
      <FilterBar onFilterChange={handleFilterChange} />
      <ExportButton data={filteredData} />
      <Table data={filteredData} onView={setSelectedItem} />
      {selectedItem && (
        <Modal data={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </main>
  )
}
