import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import LogoutButton from '@/app/components/LogoutButton'
import { redirect } from 'next/navigation'

const statusStyle: Record<string, string> = {
  DISPONIVEL: 'border-zinc-400 text-zinc-400',
  RESERVADO: 'border-zinc-600 text-zinc-600',
  VENDIDO: 'border-zinc-700 text-zinc-700',
}

export default async function Produtos() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) {
    console.error(error)
    return (
      <div className="min-h-screen bg-black text-zinc-500 flex items-center justify-center font-mono">
        <p>erro ao carregar produtos.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono font-bold text-xl tracking-widest uppercase">FIVEOUT</h1>
          <p className="font-mono text-xs text-zinc-500 mt-0.5">admin / produtos</p>
        </div>
        <div className="flex items-center gap-4">
          <LogoutButton />
          <Link
            href="/dashboard"
            className="font-mono text-xs text-zinc-500 tracking-widest uppercase hover:text-white transition-colors"
          >
            dashboard
          </Link>
          <Link
            href="/produtos/novo"
            className="font-mono text-xs font-bold tracking-widest uppercase bg-white text-black px-4 py-2 hover:bg-zinc-200 transition-colors"
          >
            + Nova Peca
          </Link>
        </div>
      </div>

      {produtos.length === 0 ? (
        <p className="font-mono text-sm text-zinc-600">nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {produtos.map((produto) => (
            <Link href={`/produtos/${produto.id}`} key={produto.id}>
              <div className="border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer">
                {produto.foto_url ? (
                  <img
                    src={produto.foto_url}
                    alt={produto.nome}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-zinc-900 flex items-center justify-center font-mono text-zinc-700 text-xs">
                    sem foto
                  </div>
                )}
                <div className="p-3 bg-zinc-950">
                  <p className="font-mono font-bold text-xs uppercase tracking-wide leading-tight text-white">
                    {produto.nome}
                  </p>
                  <p className="font-mono text-xs text-zinc-500 mt-1 uppercase">
                    {produto.tamanho} / {produto.condicao}
                  </p>
                  <p className="font-mono font-bold text-white text-sm mt-1">
                    R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                  </p>
                  <span className={`font-mono text-xs border px-2 py-0.5 mt-2 inline-block uppercase tracking-wider ${statusStyle[produto.status] ?? 'border-zinc-700 text-zinc-700'}`}>
                    {produto.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}