'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function EditarProduto() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [produto, setProduto] = useState<any>(null)

  useEffect(() => {
    async function fetchProduto() {
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single()
      setProduto(data)
    }
    fetchProduto()
  }, [id])

  const handleStatus = async (novoStatus: string) => {
    setLoading(true)
    await supabase
      .from('produtos')
      .update({ status: novoStatus })
      .eq('id', id)
    router.push('/produtos')
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que quer deletar essa peca?')) return
    setLoading(true)
    await supabase.from('produtos').delete().eq('id', id)
    router.push('/produtos')
    setLoading(false)
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-black text-zinc-600 flex items-center justify-center font-mono">
        <p>carregando...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-lg mx-auto">
      <button
        onClick={() => router.push('/produtos')}
        className="font-mono text-xs text-zinc-500 hover:text-white transition-colors mb-8 uppercase tracking-wider"
      >
        voltar
      </button>

      {produto.foto_url && (
        <img
          src={produto.foto_url}
          alt={produto.nome}
          className="w-full aspect-square object-cover mb-6 border border-zinc-800"
        />
      )}

      <h1 className="font-mono font-bold text-xl uppercase tracking-wide leading-tight">
        {produto.nome}
      </h1>
      <p className="font-mono text-xs text-zinc-500 mt-1 uppercase tracking-wider">
        {produto.tamanho} / {produto.condicao === 'NOVO' ? 'NOVO' : 'SEMI-NOVO'}
      </p>
      <p className="font-mono font-bold text-white text-2xl mt-2 mb-6">
        R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
      </p>

      <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-3">
        alterar status
      </p>

      <div className="flex flex-col gap-3">
        {produto.status !== 'DISPONIVEL' && (
          <button
            onClick={() => handleStatus('DISPONIVEL')}
            disabled={loading}
            className="font-mono text-xs font-bold uppercase tracking-widest w-full py-3 bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-40"
          >
            marcar como disponivel
          </button>
        )}
        {produto.status !== 'RESERVADO' && (
          <button
            onClick={() => handleStatus('RESERVADO')}
            disabled={loading}
            className="font-mono text-xs font-bold uppercase tracking-widest w-full py-3 bg-zinc-600 text-white hover:bg-zinc-500 transition-colors disabled:opacity-40"
          >
            marcar como reservado
          </button>
        )}
        {produto.status !== 'VENDIDO' && (
          <button
            onClick={() => handleStatus('VENDIDO')}
            disabled={loading}
            className="font-mono text-xs font-bold uppercase tracking-widest w-full py-3 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors disabled:opacity-40"
          >
            marcar como vendido
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="font-mono text-xs font-bold uppercase tracking-widest w-full py-3 border border-red-800 text-red-700 hover:border-red-600 hover:text-red-500 transition-colors disabled:opacity-40 mt-4"
        >
          deletar peca
        </button>
      </div>
    </main>
  )
}
