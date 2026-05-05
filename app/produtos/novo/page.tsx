'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NovoProduto() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    tamanho: '',
    condicao: 'NOVO',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('produtos').insert({
      nome: form.nome,
      descricao: form.descricao,
      preco: parseFloat(form.preco),
      tamanho: form.tamanho,
      condicao: form.condicao,
    })

    if (error) {
      alert('Erro ao cadastrar produto')
      console.error(error)
    } else {
      router.push('/produtos')
    }

    setLoading(false)
  }

  return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Peça</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Nome da peça"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Preço (ex: 49.90)"
          type="number"
          step="0.01"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          placeholder="Tamanho (P, M, G...)"
          value={form.tamanho}
          onChange={(e) => setForm({ ...form, tamanho: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <select
          value={form.condicao}
          onChange={(e) => setForm({ ...form, condicao: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="NOVO">Novo</option>
          <option value="SEMI_NOVO">Semi-novo</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Peça'}
        </button>
      </form>
    </main>
  )
}