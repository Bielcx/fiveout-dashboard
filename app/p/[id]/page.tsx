import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import RedirectClient from './RedirectClient'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  if (!product || product.status !== 'DISPONIVEL') {
    return { title: 'Fiveoout' }
  }

  const price = `R$ ${Number(product.preco).toFixed(2).replace('.', ',')}`

  return {
    title: `${product.nome} — Fiveoout`,
    description: `${product.tamanho} · ${product.condicao} · ${price}`,
    openGraph: {
      title: `${product.nome} — Fiveoout`,
      description: `${price} · ${product.tamanho}`,
      images: product.foto_url ? [{ url: product.foto_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.nome} — Fiveoout`,
      images: product.foto_url ? [product.foto_url] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('produtos')
    .select('id, status')
    .eq('id', id)
    .single()

  if (!product || product.status !== 'DISPONIVEL') {
    redirect('/catalogo')
  }

  return <RedirectClient id={id} />
}
