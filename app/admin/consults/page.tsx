// /app/admin/consults/page.tsx

import { getConsultRequests } from '@/lib/getConsultRequests'
import ConsultsClient from './components/ConsultsClient'

export default async function ConsultsPage() {
  const data = await getConsultRequests('face')

  return <ConsultsClient initialData={data} />
}
