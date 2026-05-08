import { supabase } from '@/lib/supabase'

export const revalidate = 0

function whatsappLink(produto: { nome: string; tamanho: string; condicao: string; preco: number }) {
  const preco = Number(produto.preco).toFixed(2).replace('.', ',')
  const condicao = produto.condicao === 'NOVO' ? 'Novo' : 'Semi-novo'
  const msg = `Oi! Vi no catalogo da Fiveoout e tenho interesse na peca: ${produto.nome} - Tamanho ${produto.tamanho} - ${condicao} - R$ ${preco}`
  return `https://wa.me/5511960137983?text=${encodeURIComponent(msg)}`
}

export default async function Catalogo() {
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('status', 'DISPONIVEL')
    .order('criado_em', { ascending: false })

  if (error) {
    console.error(error)
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
        <p>erro ao carregar o catalogo.</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Background watermark logo */}
      <img
        src="/fivhand.png"
        aria-hidden
        style={{ position: 'fixed', top: '-30%', left: '-15%', width: '60vw', maxWidth: '1000px', opacity: 0.06, pointerEvents: 'none', zIndex: 0, filter: 'invert(1)' }}
      />

      {/* Radial gradient overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Sticky header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.3em', fontSize: '18px', color: '#fff', margin: 0 }}>
            FIVEOOUT
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555', marginTop: '3px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '3px 0 0' }}>
            catalogo oficial
          </p>
        </div>
        <a
          href="https://instagram.com/fiveoout"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'monospace', fontSize: '11px', color: '#666', textDecoration: 'none', letterSpacing: '0.05em' }}
        >
          @fiveoout
        </a>
      </header>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 16px', maxWidth: '900px', margin: '0 auto' }}>
        {!produtos || produtos.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '120px', gap: '16px', color: '#444' }}>
            <span style={{ fontSize: '48px' }}>✋</span>
            <p style={{ fontFamily: 'monospace', fontSize: '13px', margin: 0 }}>nenhuma peca disponivel no momento.</p>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#333', margin: 0 }}>acompanhe o instagram para novidades.</p>
          </div>
        ) : (
          <>
            <style>{`
              .catalog-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
              }
              @media (min-width: 640px) {
                .catalog-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
              .product-card:hover {
                border-color: rgba(255,255,255,0.18) !important;
              }
              .interest-btn:hover {
                background: rgba(255,255,255,0.12) !important;
              }
            `}</style>

            <div className="catalog-grid">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="product-card"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* Shine line */}
                  <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)' }} />

                  {produto.foto_url ? (
                    <img
                      src={produto.foto_url}
                      alt={produto.nome}
                      style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      background: 'rgba(255,255,255,0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#333',
                    }}>
                      sem foto
                    </div>
                  )}

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <div>
                        <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
                          {produto.nome}
                        </p>
                        <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px', margin: '5px 0 0' }}>
                          {produto.tamanho} / {produto.condicao === 'NOVO' ? 'NOVO' : 'SEMI-NOVO'}
                        </p>
                      </div>
                      <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '18px', color: '#fff', whiteSpace: 'nowrap', margin: 0 }}>
                        R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    <a
                      href={whatsappLink(produto)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interest-btn"
                      style={{
                        width: '100%', padding: '14px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff', fontFamily: 'monospace', fontSize: '11px',
                        letterSpacing: '3px', textTransform: 'uppercase',
                        cursor: 'pointer', display: 'block', textAlign: 'center', textDecoration: 'none',
                        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
                        transition: 'background 0.2s',
                        boxSizing: 'border-box',
                        fontWeight: 'bold',
                        borderRadius: '6px',
                      }}
                    >
                      tenho interesse
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <footer style={{
        position: 'relative',
        zIndex: 1,
        padding: '32px',
        textAlign: 'center',
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#333',
        letterSpacing: '0.4em',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        FIVEOUT
      </footer>
    </div>
  )
}
