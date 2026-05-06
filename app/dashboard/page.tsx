import { supabase } from '@/lib/supabase'
import LogoutButton from '@/app/components/LogoutButton'

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function statusLabel(status: string) {
  if (status === 'DISPONIVEL') return 'DISPONÍVEL'
  if (status === 'RESERVADO') return 'RESERVADO'
  if (status === 'VENDIDO') return 'VENDIDO'
  return status
}

function statusColor(status: string) {
  if (status === 'DISPONIVEL') return { color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.06)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }
  if (status === 'RESERVADO') return { color: '#facc15', border: '1px solid rgba(250,204,21,0.3)', background: 'rgba(250,204,21,0.06)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }
  return { color: '#e4e4e7', border: '1px solid rgba(228,228,231,0.25)', background: 'rgba(228,228,231,0.05)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }
}

const glassCard = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '16px',
  overflow: 'hidden' as const,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
}

const shineLine = {
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
}

export default async function Dashboard() {
  const { data: todos, error } = await supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) {
    console.error(error)
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
        <p>erro ao carregar o dashboard.</p>
      </div>
    )
  }

  const produtos = todos ?? []

  const totalProdutos = produtos.length
  const disponiveis = produtos.filter(p => p.status === 'DISPONIVEL').length
  const reservados = produtos.filter(p => p.status === 'RESERVADO').length
  const vendidos = produtos.filter(p => p.status === 'VENDIDO').length
  const valorEstoque = produtos.filter(p => p.status === 'DISPONIVEL').reduce((sum, p) => sum + Number(p.preco), 0)
  const valorVendido = produtos.filter(p => p.status === 'VENDIDO').reduce((sum, p) => sum + Number(p.preco), 0)
  const recentes = produtos.slice(0, 5)

  const maxBar = Math.max(disponiveis, reservados, vendidos, 1)

  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        .dash-nav-link:hover { color: #fff !important; }
        .stat-card:hover { border-color: rgba(255,255,255,0.22) !important; }
        .recent-row:hover { background: rgba(255,255,255,0.04) !important; }
        .top-nav-link:hover { color: #fff !important; }
      `}</style>

      {/* Background logo */}
      <img
        src="/fivhand.png"
        aria-hidden
        style={{ position: 'fixed', top: '-30%', left: '-15%', width: '60vw', maxWidth: '1000px', opacity: 0.06, pointerEvents: 'none', zIndex: 0, filter: 'invert(1)' }}
      />

      {/* Radial gradient overlay */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.3em', fontSize: '18px', color: '#fff', margin: 0 }}>
            FIVEOUT
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '3px 0 0' }}>
            dashboard
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a
            href="/catalogo"
            className="dash-nav-link"
            style={{ fontFamily: 'monospace', fontSize: '11px', color: '#555', textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.2s' }}
          >
            catálogo
          </a>
          <a
            href="/produtos"
            className="dash-nav-link"
            style={{ fontFamily: 'monospace', fontSize: '11px', color: '#555', textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.2s' }}
          >
            gerenciar
          </a>
          <LogoutButton />
        </div>
      </header>

      {/* Top nav breadcrumb */}
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 24px 0', maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a
          href="/produtos"
          className="top-nav-link"
          style={{ fontFamily: 'monospace', fontSize: '11px', color: '#444', textDecoration: 'none', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
        >
          ← produtos
        </a>
        <span style={{ color: '#222', fontFamily: 'monospace', fontSize: '11px' }}>/</span>
        <a
          href="/catalogo"
          className="top-nav-link"
          style={{ fontFamily: 'monospace', fontSize: '11px', color: '#444', textDecoration: 'none', letterSpacing: '1px', transition: 'color 0.2s' }}
        >
          catálogo
        </a>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 16px', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Stats row — 4 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>

          {/* Total */}
          <div className="stat-card" style={{ ...glassCard, boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(255,255,255,0.04)', padding: '20px 24px 24px', transition: 'border-color 0.2s' }}>
            <div style={shineLine} />
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', margin: '16px 0 6px' }}>
              total de peças
            </p>
            <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '48px', color: '#fff', margin: 0, lineHeight: 1 }}>
              {totalProdutos}
            </p>
          </div>

          {/* Disponíveis */}
          <div className="stat-card" style={{ ...glassCard, boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(255,255,255,0.04)', padding: '20px 24px 24px', transition: 'border-color 0.2s' }}>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.5) 50%, transparent 100%)' }} />
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#4ade80', letterSpacing: '2px', textTransform: 'uppercase', margin: '16px 0 6px', opacity: 0.8 }}>
              disponíveis
            </p>
            <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '48px', color: '#4ade80', margin: 0, lineHeight: 1 }}>
              {disponiveis}
            </p>
          </div>

          {/* Reservadas */}
          <div className="stat-card" style={{ ...glassCard, boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(255,255,255,0.04)', padding: '20px 24px 24px', transition: 'border-color 0.2s' }}>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(250,204,21,0.5) 50%, transparent 100%)' }} />
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#facc15', letterSpacing: '2px', textTransform: 'uppercase', margin: '16px 0 6px', opacity: 0.8 }}>
              reservadas
            </p>
            <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '48px', color: '#facc15', margin: 0, lineHeight: 1 }}>
              {reservados}
            </p>
          </div>

          {/* Vendidas */}
          <div className="stat-card" style={{ ...glassCard, boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(255,255,255,0.04)', padding: '20px 24px 24px', transition: 'border-color 0.2s' }}>
            <div style={shineLine} />
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase', margin: '16px 0 6px' }}>
              vendidas
            </p>
            <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '48px', color: '#fff', margin: 0, lineHeight: 1 }}>
              {vendidos}
            </p>
          </div>
        </div>

        {/* Revenue row — 2 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>

          <div className="stat-card" style={{ ...glassCard, padding: '20px 24px 24px', transition: 'border-color 0.2s' }}>
            <div style={shineLine} />
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', margin: '16px 0 6px' }}>
              valor em estoque
            </p>
            <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '28px', color: '#4ade80', margin: 0, lineHeight: 1.1 }}>
              {formatBRL(valorEstoque)}
            </p>
          </div>

          <div className="stat-card" style={{ ...glassCard, padding: '20px 24px 24px', transition: 'border-color 0.2s' }}>
            <div style={shineLine} />
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', margin: '16px 0 6px' }}>
              total vendido
            </p>
            <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '28px', color: '#fff', margin: 0, lineHeight: 1.1 }}>
              {formatBRL(valorVendido)}
            </p>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ ...glassCard }}>
          <div style={shineLine} />
          <div style={{ padding: '24px 32px 28px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 28px' }}>
              status do estoque
            </p>

            {/* Chart area */}
            <div style={{ position: 'relative' }}>
              {/* Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '24px', height: '150px' }}>
                {[
                  { label: 'Disponível', value: disponiveis, color: '#4ade80' },
                  { label: 'Reservado',  value: reservados,  color: '#facc15' },
                  { label: 'Vendido',    value: vendidos,    color: '#e4e4e7' },
                ].map(({ label, value, color }) => {
                  const heightPct = Math.max((value / maxBar) * 100, value > 0 ? 5 : 0)
                  return (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '140px', height: '100%', justifyContent: 'flex-end' }}>
                      <p style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 900, color, margin: 0 }}>
                        {value}
                      </p>
                      <div style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        minHeight: value > 0 ? '6px' : '2px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 100%)',
                        borderRadius: '6px 6px 0 0',
                        border: `1px solid ${color}33`,
                        borderBottom: 'none',
                      }} />
                    </div>
                  )
                })}
              </div>

              {/* Baseline */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '12px' }} />

              {/* Labels */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                {[
                  { label: 'Disponível', color: '#4ade80' },
                  { label: 'Reservado',  color: '#facc15' },
                  { label: 'Vendido',    color: '#e4e4e7' },
                ].map(({ label, color }) => (
                  <div key={label} style={{ flex: 1, maxWidth: '140px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '9px', color, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0, opacity: 0.7 }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent products */}
        <div style={{ ...glassCard }}>
          <div style={shineLine} />
          <div style={{ padding: '20px 24px 12px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
              últimas peças adicionadas
            </p>
          </div>
          <div>
            {recentes.length === 0 ? (
              <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#333', padding: '12px 24px 20px', margin: 0 }}>nenhuma peça cadastrada.</p>
            ) : recentes.map((p) => {
              const badge = statusColor(p.status)
              return (
                <div
                  key={p.id}
                  className="recent-row"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.15s',
                    gap: '12px',
                  }}
                >
                  <p style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.nome}
                  </p>
                  <span style={{
                    fontFamily: 'monospace', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase',
                    padding: '4px 9px', borderRadius: '5px',
                    whiteSpace: 'nowrap',
                    ...badge,
                  }}>
                    {statusLabel(p.status)}
                  </span>
                  <p style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>
                    R$ {Number(p.preco).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              )
            })}
          </div>
          <div style={{ height: '4px' }} />
        </div>

        {/* Bottom nav links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', padding: '8px 0 16px' }}>
          <a
            href="/catalogo"
            className="dash-nav-link"
            style={{ fontFamily: 'monospace', fontSize: '11px', color: '#444', textDecoration: 'none', letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.2s' }}
          >
            ver catálogo
          </a>
          <a
            href="/produtos"
            className="dash-nav-link"
            style={{ fontFamily: 'monospace', fontSize: '11px', color: '#444', textDecoration: 'none', letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.2s' }}
          >
            gerenciar produtos
          </a>
        </div>
      </div>

      <footer style={{
        position: 'relative', zIndex: 1,
        padding: '32px', textAlign: 'center',
        fontFamily: 'monospace', fontSize: '11px', color: '#333',
        letterSpacing: '0.4em',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        FIVEOUT
      </footer>
    </div>
  )
}
