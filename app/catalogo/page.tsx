'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Produto = {
  id: string
  nome: string
  tamanho: string
  condicao: string
  preco: number
  foto_url: string | null
  status: string
}

const C = {
  bg: '#0a0806',
  surface: '#120f0a',
  border: 'rgba(180, 140, 90, 0.15)',
  accent: '#c4a882',
  primary: '#f5f0e8',
  muted: '#6b5d4f',
}

function whatsappLink(produto: Produto) {
  const preco = Number(produto.preco).toFixed(2).replace('.', ',')
  const condicao = produto.condicao === 'NOVO' ? 'Novo' : 'Semi-novo'
  const msg = `Oi! Vi no catalogo da Fiveoout e tenho interesse na peca: ${produto.nome} - Tamanho ${produto.tamanho} - ${condicao} - R$ ${preco}`
  return `https://wa.me/5511960137983?text=${encodeURIComponent(msg)}`
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    supabase
      .from('produtos')
      .select('*')
      .eq('status', 'DISPONIVEL')
      .order('criado_em', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProdutos(data)
        setLoading(false)
      })
  }, [])

  const selected = produtos[selectedIndex] ?? null

  return (
    <div style={{ background: C.bg, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Scrollbar hide */}
      <style>{`
        .thumb-row { scrollbar-width: none; }
        .thumb-row::-webkit-scrollbar { display: none; }
        .interest-btn:hover { background: rgba(196,168,130,0.08) !important; }
      `}</style>

      {/* Hand logo watermark */}
      <img
        src="/fivhand.png"
        aria-hidden
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'invert(1) sepia(1) saturate(0.3)',
        }}
      />

      {/* GO OUT MATE background text */}
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 'clamp(40px, 8vw, 120px)',
        fontWeight: '900',
        letterSpacing: '0.3em',
        color: 'rgba(180,140,90,0.04)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 0,
        fontFamily: 'monospace',
        textTransform: 'uppercase',
      }}>
        GO OUT MATE
      </div>

      {/* Sticky header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(10,8,6,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(180,140,90,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/fivhand.png"
            aria-hidden
            style={{ width: '22px', filter: 'invert(1) sepia(1) saturate(0.3)', opacity: 0.85 }}
          />
          <div>
            <p style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.3em', fontSize: '15px', color: C.primary, margin: 0 }}>
              FIVEOOUT
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '9px', color: C.accent, margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              GO OUT MATE
            </p>
          </div>
        </div>
        <a
          href="https://instagram.com/fiveoout"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'monospace', fontSize: '11px', color: C.muted, textDecoration: 'none', letterSpacing: '0.05em' }}
        >
          @fiveoout
        </a>
      </header>

      {/* Page content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 16px 0', maxWidth: '600px', margin: '0 auto' }}>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '120px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: C.muted, letterSpacing: '0.2em' }}>carregando...</p>
          </div>
        ) : !produtos.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '120px', gap: '12px' }}>
            <span style={{ fontSize: '40px' }}>✋</span>
            <p style={{ fontFamily: 'monospace', fontSize: '13px', color: C.accent, margin: 0 }}>nenhuma peça disponível</p>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: C.muted, margin: 0 }}>acompanhe o instagram</p>
          </div>
        ) : (
          <>
            {/* Hero */}
            {selected && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: C.surface }}>
                  {selected.foto_url ? (
                    <img
                      src={selected.foto_url}
                      alt={selected.nome}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '11px', color: C.muted }}>
                      sem foto
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10,8,6,0.95) 0%, transparent 50%)',
                  }} />

                  {/* Product info overlaid at bottom */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 20px' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '52px', fontWeight: '100', color: C.accent, margin: '0 0 2px', lineHeight: 1, opacity: 0.6 }}>
                      {String(selectedIndex + 1).padStart(2, '0')}
                    </p>
                    <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '20px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, margin: '0 0 6px', lineHeight: 1.15 }}>
                      {selected.nome}
                    </p>
                    <p style={{ fontFamily: 'monospace', fontSize: '10px', color: C.accent, margin: '0 0 10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      {selected.tamanho} / {selected.condicao === 'NOVO' ? 'NOVO' : 'SEMI-NOVO'}
                    </p>
                    <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '18px', color: C.primary, margin: '0 0 14px' }}>
                      R$ {Number(selected.preco).toFixed(2).replace('.', ',')}
                    </p>
                    <a
                      href={whatsappLink(selected)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interest-btn"
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '13px',
                        border: `1px solid ${C.accent}`,
                        background: 'transparent',
                        color: C.accent,
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        boxSizing: 'border-box',
                        transition: 'background 0.2s',
                      }}
                    >
                      TENHO INTERESSE
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnails row */}
            <div
              className="thumb-row"
              style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}
            >
              {produtos.map((produto, i) => (
                <div
                  key={produto.id}
                  onClick={() => setSelectedIndex(i)}
                  style={{ flexShrink: 0, cursor: 'pointer' }}
                >
                  <div style={{
                    width: '100px',
                    height: '100px',
                    overflow: 'hidden',
                    border: i === selectedIndex ? `1px solid ${C.accent}` : '1px solid rgba(180,140,90,0.1)',
                    opacity: i === selectedIndex ? 1 : 0.6,
                    background: C.surface,
                    transition: 'border 0.2s, opacity 0.2s',
                  }}>
                    {produto.foto_url ? (
                      <img
                        src={produto.foto_url}
                        alt={produto.nome}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '9px', color: C.muted }}>
                        sem foto
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: 'monospace', fontSize: '9px', color: i === selectedIndex ? C.accent : C.muted, margin: '5px 0 0', textAlign: 'center', letterSpacing: '0.1em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 1,
        padding: '40px 32px 32px',
        textAlign: 'center',
        fontFamily: 'monospace',
        fontSize: '11px',
        color: C.accent,
        letterSpacing: '0.3em',
        borderTop: '1px solid rgba(180,140,90,0.08)',
        marginTop: '40px',
      }}>
        FIVEOOUT · GO OUT MATE
      </footer>
    </div>
  )
}
