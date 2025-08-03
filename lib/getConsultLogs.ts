// /lib/getConsultLogs.ts
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function getConsultLogs(id: number, source: 'face' | 'lifting') {
  const supabase = getSupabaseAdminClient(source)

  const { data, error } = await supabase
    .from('consult_logs')
    .select('*')
    .eq('consult_request_id', id)
    .order('changed_at', { ascending: false }) // ✅ 수정됨

  if (error) {
    console.error('로그 가져오기 실패:', error)
    return []
  }

  return data
}
