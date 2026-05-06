'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    console.log('data:', data)
    console.log('error:', error)

    if (error) {
      setErro('Email ou senha incorretos')
      setLoading(false)
      return
    }

    window.location.href = '/produtos'
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #18181b 0%, #000000 70%)',
      }}
    >
      {/* Noise texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      {/* Subtle glow behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,80,255,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative w-full max-w-sm z-10">
        {/* Top shine line */}
        <div
          aria-hidden
          className="absolute top-0 left-8 right-8 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          }}
        />

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div className="mb-8 text-center">
            <h1 className="font-mono font-bold tracking-[0.3em] text-xl text-white">FIVEOUT</h1>
            <p className="font-mono text-[10px] text-zinc-500 mt-1.5 tracking-widest uppercase">
              painel admin
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-white px-4 py-3 rounded-lg font-mono text-sm placeholder:text-zinc-600 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
              }}
            />
            <input
              type="password"
              placeholder="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full text-white px-4 py-3 rounded-lg font-mono text-sm placeholder:text-zinc-600 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
              }}
            />

            {erro && (
              <p className="font-mono text-xs text-zinc-400 text-center">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-mono font-bold text-xs tracking-widest uppercase py-3 rounded-lg mt-1 hover:bg-zinc-100 active:bg-zinc-200 transition-colors disabled:opacity-40"
            >
              {loading ? 'entrando...' : 'entrar'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
