// /app/preview/page.tsx
import { supabaseFace } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PreviewPage({
  searchParams,
}: {
  searchParams?: Promise<{ slug?: string }>
}) {
  const params = await searchParams
  const slug = params?.slug

  if (!slug || typeof slug !== 'string') {
    return <p className="p-8 text-red-500">⛔️ 미리보기 오류: slug 파라미터가 필요합니다.</p>
  }

  const { data, error } = await supabaseFace
    .from('surgeries')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) {
    return <p className="p-8 text-red-500">⛔️ 미리보기 오류: 시술 정보를 찾을 수 없습니다.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      {data.hero_image_url && (
        <img
          src={data.hero_image_url}
          alt={data.title}
          className="w-full h-auto rounded mb-4"
        />
      )}
      <p className="mb-2 text-gray-600">{data.description}</p>
      <div className="text-sm text-gray-500">
        <p>
          <strong>SEO 제목:</strong> {data.seo_title}
        </p>
        <p>
          <strong>SEO 설명:</strong> {data.seo_description}
        </p>
      </div>
    </main>
  )
}
