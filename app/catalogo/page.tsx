'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Toaster, toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import 'swiper/css'
import 'swiper/css/free-mode'

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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

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

  function handleInteresse() {
    if (!selected) return
    toast('Abrindo WhatsApp...', { icon: '💬' })
    setTimeout(() => window.open(whatsappLink(selected), '_blank'), 800)
  }

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh', position: 'relative' }}>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1a1410',
            color: '#f5f0e8',
            border: '1px solid rgba(180,140,90,0.3)',
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: '1px',
          },
        }}
      />

      {/* Background image */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(0.25) saturate(0.8)',
      }} />

      {/* Dark overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(180deg, rgba(10,8,6,0.5) 0%, rgba(10,8,6,0.3) 50%, rgba(10,8,6,0.7) 100%)',
      }} />

      {/* GO OUT MATE background text */}
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 'clamp(40px, 8vw, 120px)',
        fontWeight: '900',
        letterSpacing: '0.3em',
        color: 'rgba(180,140,90,0.06)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 0,
        fontFamily: 'monospace',
        textTransform: 'uppercase',
      }}>
        GO OUT MATE
      </div>

      {/* Sticky header */}
      <motion.header
        {...fadeUp(0)}
        style={{
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/fivhand.png" style={{ width: '28px', height: '28px', filter: 'invert(1) sepia(1) saturate(0.3)', opacity: 0.9 }} alt="Fiveoout" />
          <p style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.3em', fontSize: '15px', color: C.primary, margin: 0 }}>
            FIVEOOUT
          </p>
        </div>
        <a
          href="https://instagram.com/fiveoout"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'monospace', fontSize: '11px', color: C.muted, textDecoration: 'none', letterSpacing: '0.05em' }}
        >
          @fiveoout
        </a>
      </motion.header>

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
              <motion.div {...fadeUp(0.1)} style={{ marginBottom: '12px' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', maxHeight: '62vh', overflow: 'hidden', background: C.surface, borderRadius: '8px' }}>

                  {/* Animated image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selected.id + '-img'}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      style={{ position: 'absolute', inset: 0 }}
                    >
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
                    </motion.div>
                  </AnimatePresence>

                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #0a0806 20%, rgba(10,8,6,0.75) 42%, rgba(10,8,6,0.1) 65%, transparent 100%)',
                  }} />

                  {/* Animated product info */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 28px' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selected.id + '-info'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div style={{ width: '40px', height: '1px', background: C.accent, marginBottom: '10px', opacity: 0.7 }} />
                        <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 'clamp(20px, 5vw, 36px)', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.primary, margin: '0 0 8px', lineHeight: 1.1 }}>
                          {selected.nome}
                        </p>
                        <p style={{ fontFamily: 'monospace', fontSize: '10px', color: C.accent, margin: '0 0 12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          {selected.tamanho} / {selected.condicao === 'NOVO' ? 'NOVO' : 'SEMI-NOVO'}
                        </p>
                        <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '20px', color: C.accent, margin: '0 0 16px' }}>
                          R$ {Number(selected.preco).toFixed(2).replace('.', ',')}
                        </p>
                        <button
                          onClick={handleInteresse}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '13px',
                            border: `1px solid ${C.accent}`,
                            background: 'rgba(180,140,90,0.04)',
                            color: C.accent,
                            fontFamily: 'monospace',
                            fontSize: '10px',
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            borderRadius: '4px',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(180,140,90,0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(180,140,90,0.04)')}
                        >
                          TENHO INTERESSE
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Thumbnails — Swiper */}
            <motion.div {...fadeUp(0.2)} style={{ paddingBottom: '4px' }}>
              <Swiper
                modules={[FreeMode]}
                slidesPerView="auto"
                spaceBetween={8}
                freeMode={true}
                style={{ width: '100%' }}
              >
                {produtos.map((produto, i) => (
                  <SwiperSlide key={produto.id} style={{ width: '100px' }}>
                    <div onClick={() => setSelectedIndex(i)} style={{ cursor: 'pointer' }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        overflow: 'hidden',
                        border: i === selectedIndex ? `1px solid ${C.accent}` : '1px solid rgba(180,140,90,0.1)',
                        opacity: i === selectedIndex ? 1 : 0.6,
                        background: C.surface,
                        borderRadius: '6px',
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
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </>
        )}
      </div>

      {/* Footer */}
      <motion.footer
        {...fadeUp(0.3)}
        style={{
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
        }}
      >
        FIVEOOUT · GO OUT MATE
      </motion.footer>
    </div>
  )
}
