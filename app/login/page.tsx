'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
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
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-widest">FIVEOUT</h1>
          <p className="text-zinc-500 text-sm mt-1">painel admin</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-lg placeholder:text-zinc-600 focus:outline-none focus:border-white"
          />
          <input
            type="password"
            placeholder="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-lg placeholder:text-zinc-600 focus:outline-none focus:border-white"
          />

          {erro && (
            <p className="text-red-400 text-sm text-center">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? 'entrando...' : 'entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}