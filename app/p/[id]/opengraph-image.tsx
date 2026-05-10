import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const accent = '#c4a882'
const bg = '#0a0806'
const surface = '#120f0a'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Use vanilla supabase-js — createBrowserClient can fail in OG image context
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: product, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  console.log('[OG] id:', id, '| foto_url:', product?.foto_url, '| error:', error?.message)

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ width: 1200, height: 630, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${accent}` }}>
          <span style={{ color: accent, fontSize: 64, letterSpacing: '0.3em' }}>FIVEOOUT</span>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const price = `R$ ${Number(product.preco).toFixed(2).replace('.', ',')}`
  const condicao = product.condicao === 'NOVO' ? 'NOVO' : 'SEMI-NOVO'

  // Fetch product image as base64 so Satori can render it
  let imgSrc: string | null = null
  if (product.foto_url) {
    try {
      const res = await fetch(product.foto_url, { cache: 'no-store' })
      console.log('[OG] photo fetch status:', res.status)
      if (res.ok) {
        const buffer = await res.arrayBuffer()
        const ct = res.headers.get('content-type') || 'image/jpeg'
        imgSrc = `data:${ct};base64,${Buffer.from(buffer).toString('base64')}`
        console.log('[OG] photo loaded, bytes:', buffer.byteLength)
      }
    } catch (e) {
      console.error('[OG] photo fetch failed:', e)
    }
  }

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: bg, display: 'flex', border: `1px solid ${accent}` }}>

        {/* Left — product photo or dark placeholder */}
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.nome}
            style={{ width: 600, height: 630, objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: 600, height: 630, background: surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: accent, fontSize: 18, letterSpacing: '0.2em' }}>FIVEOOUT</span>
          </div>
        )}

        {/* Right — dark panel */}
        <div style={{
          width: 600,
          height: 630,
          background: surface,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '52px 56px',
          borderLeft: `1px solid rgba(180,140,90,0.25)`,
        }}>
          <span style={{ color: accent, fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            FIVEOOUT
          </span>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#f5f0e8', fontSize: 54, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 18 }}>
              {product.nome}
            </span>
            <span style={{ color: accent, fontSize: 17, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 28 }}>
              {product.tamanho} · {condicao}
            </span>
            <span style={{ color: '#f5f0e8', fontSize: 42, fontWeight: 700 }}>
              {price}
            </span>
          </div>

          <span style={{ color: accent, fontSize: 13, letterSpacing: '0.1em', opacity: 0.65 }}>
            fiveoout.com.br
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
