import { supabase } from '@/lib/supabase'
import CatalogoClient from './CatalogoClient'

export default async function Catalogo({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const sp = await searchParams
  const initialId = sp.id ?? null

  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .eq('status', 'DISPONIVEL')
    .order('criado_em', { ascending: false })

  return <CatalogoClient produtos={produtos ?? []} initialId={initialId} />
}
