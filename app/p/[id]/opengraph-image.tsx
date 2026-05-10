import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const accent = '#c4a882'
const bg = '#0a0806'
const surface = '#120f0a'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: product } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

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

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: bg, display: 'flex', border: `1px solid ${accent}` }}>

        {/* Left — product photo */}
        {product.foto_url ? (
          <img
            src={product.foto_url}
            alt={product.nome}
            style={{ width: 600, height: 630, objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: 600, height: 630, background: surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#6b5d4f', fontSize: 24 }}>sem foto</span>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
