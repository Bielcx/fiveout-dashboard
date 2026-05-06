'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NovoProduto() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    tamanho: '',
    condicao: 'NOVO',
  })

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFoto(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let foto_url = null

    if (foto) {
      const ext = foto.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(fileName, foto)

      if (uploadError) {
        alert('Erro ao fazer upload da foto')
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from('produtos')
        .getPublicUrl(fileName)

      foto_url = data.publicUrl
    }

    const { error } = await supabase.from('produtos').insert({
      nome: form.nome,
      descricao: form.descricao,
      preco: parseFloat(form.preco),
      tamanho: form.tamanho,
      condicao: form.condicao,
      foto_url,
    })

    if (error) {
      alert('Erro ao cadastrar produto')
      console.error(error)
    } else {
      router.push('/produtos')
    }

    setLoading(false)
  }

  const inputClass =
    'font-mono text-sm text-white bg-zinc-800 border border-zinc-600 px-3 py-2.5 w-full placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors'

  const labelClass = 'font-mono text-xs uppercase tracking-widest text-zinc-500'

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-lg mx-auto">
      <button
        onClick={() => router.push('/produtos')}
        className="font-mono text-xs text-zinc-500 hover:text-white transition-colors mb-8 uppercase tracking-wider"
      >
        voltar
      </button>

      <h1 className="font-mono font-bold text-xl uppercase tracking-widest mb-8">Nova Peca</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>foto da peca</label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full aspect-square object-cover border border-zinc-800"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className="font-mono text-xs text-zinc-400 bg-zinc-900 border border-zinc-700 px-3 py-2 w-full file:mr-3 file:bg-zinc-700 file:border-0 file:text-white file:text-xs file:font-mono file:px-3 file:py-1 file:cursor-pointer hover:file:bg-zinc-600 cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>nome da peca</label>
          <input
            placeholder="ex: Camiseta Supreme"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>descricao</label>
          <input
            placeholder="opcional"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>preco</label>
          <input
            placeholder="ex: 49.90"
            type="number"
            step="0.01"
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>tamanho</label>
          <input
            placeholder="P, M, G, GG..."
            value={form.tamanho}
            onChange={(e) => setForm({ ...form, tamanho: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>condicao</label>
          <select
            value={form.condicao}
            onChange={(e) => setForm({ ...form, condicao: e.target.value })}
            className={inputClass}
          >
            <option value="NOVO">Novo</option>
            <option value="SEMI_NOVO">Semi-novo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="font-mono text-xs font-bold uppercase tracking-widest bg-white text-black py-3 w-full hover:bg-zinc-200 transition-colors disabled:opacity-40 mt-2"
        >
          {loading ? 'cadastrando...' : 'cadastrar peca'}
        </button>
      </form>
    </main>
  )
}
