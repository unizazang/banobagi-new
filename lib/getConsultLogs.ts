// /lib/getConsultLogs.ts
import { supabaseFace, supabaseLifting } from './supabase-admin'

export async function getConsultLogs(id: number, source: 'face' | 'lifting') {
  const supabase = source === 'face' ? supabaseFace : supabaseLifting

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
