// /types/consult.ts

export type ConsultRequest = {
  id: number
  customer_name: string
  gender: string
  phone: string
  page_source: string
  page_url: string
  surgery_title: string | null
  created_at: string
  status?: string
  is_member?: boolean
  note?: string
  is_important?: boolean
}

export type FilterValues = {
  name: string
  phone: string
  gender: string
  startDate: string
  endDate: string
  sort: 'asc' | 'desc'
}