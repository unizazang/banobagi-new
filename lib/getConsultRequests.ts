// /lib/getConsultRequests.ts
import { getSupabaseAdminClient } from './supabase-admin'

type Source = 'lifting' | 'face'

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
  is_member?: boolean
  is_important?: boolean
  is_hidden?: boolean
  note?: string
}


export async function getConsultRequests(
  source: 'lifting' | 'face'
): Promise<ConsultRequest[]> {
  const supabase = getSupabaseAdminClient(source)

  const { data: requests, error: requestError } = await supabase
    .from('consult_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (requestError || !requests) {
    throw new Error(`❌ consult_requests 로딩 실패 (${source}): ${requestError?.message}`)
  }


  // 2. url_mappings 조회
  const { data: mappings, error: mappingError } = await supabase
    .from('url_mappings')
    .select('url_pattern, surgery_title')

  if (mappingError || !mappings) {
    throw new Error(`Failed to fetch url_mappings: ${mappingError?.message}`)
  }

  // 3. 매핑 적용
  const result = requests.map((req) => {
    const matched = mappings.find((m) => m.url_pattern === req.page_url)
    return {
      ...req,
      surgery_title: matched?.surgery_title ?? req.surgery_title ?? null,
    }
  })

  return result
}
