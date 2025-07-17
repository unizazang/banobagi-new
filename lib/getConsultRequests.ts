// /lib/getConsultRequests.ts
import { supabaseLifting, supabaseFace } from './supabase-admin'

type Source = 'lifting' | 'face'

export async function getConsultRequests(source: Source) {
  const supabase = source === 'lifting' ? supabaseLifting : supabaseFace

  const { data, error } = await supabase
    .from('consult_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch consult requests from ${source}: ${error.message}`)
  }

  return data
}
