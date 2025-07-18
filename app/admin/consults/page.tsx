'use client'

import { useEffect, useState } from 'react'
import { getConsultRequests } from '@/lib/getConsultRequests'
import Table from './components/Table'
import FilterBar from './components/FilterBar'
import Modal from './components/Modal'
import ExportButton from './components/ExportButton'
import { ConsultRequest, FilterValues } from '@/types/consult'
import StatsBar from './components/StatsBar'

export default function ConsultsPage() {
  const [originalData, setOriginalData] = useState<ConsultRequest[]>([])
  const [filteredData, setFilteredData] = useState<ConsultRequest[]>([])
  const [selectedItem, setSelectedItem] = useState<ConsultRequest | null>(null)

  const handleUpdateItem = (id: number, fields: Partial<ConsultRequest>) => {
    setOriginalData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...fields } : item))
    )
    setFilteredData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...fields } : item))
    )
  }

  useEffect(() => {
    getConsultRequests('face').then((data) => {
      setOriginalData(data)
      setFilteredData(data)
    })
  }, [])

  const handleFilterChange = (filters: FilterValues) => {
    const filtered = originalData
      .filter((item) => {
        if (!filters.showHidden && item.is_hidden === true) return false // ✅ 수정됨

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

        const matchesMember =
          filters.isMember === ''
            ? true
            : filters.isMember === 'true'
              ? item.is_member === true
              : item.is_member === false

        return (
          matchesName &&
          matchesPhone &&
          matchesGender &&
          matchesDate &&
          matchesMember
        )
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
      <StatsBar data={filteredData} />
      <ExportButton data={filteredData} />
      <Table data={filteredData} onView={setSelectedItem} onUpdate={handleUpdateItem} />
      {selectedItem && (
        <Modal data={selectedItem} onClose={() => setSelectedItem(null)} onUpdate={handleUpdateItem} />
      )}
    </main>
  )
}
