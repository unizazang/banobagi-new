// /app/admin/consults/components/ExportButton.tsx
'use client'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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

export default function ExportButton({ data }: { data: ConsultRequest[] }) {
  const handleDownload = () => {
    if (typeof window === 'undefined') return // SSR 방지

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        이름: item.customer_name,
        성별: item.gender,
        전화번호: item.phone,
        시술명: item.surgery_title ?? '',
        출처: item.page_source,
        페이지URL: item.page_url,
        신청일: new Date(item.created_at).toLocaleString(),
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '신청내역')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    saveAs(blob, `콜팀_신청내역_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
    >
      Excel 다운로드
    </button>
  )
}
