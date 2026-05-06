import { supabase } from '@/lib/supabase'

function whatsappLink(produto: { nome: string; tamanho: string; condicao: string; preco: number }) {
  const preco = Number(produto.preco).toFixed(2).replace('.', ',')
  const condicao = produto.condicao === 'NOVO' ? 'Novo' : 'Semi-novo'
  const msg = `Oi! Vi no catalogo da Fiveout e tenho interesse na peca: ${produto.nome} - Tamanho ${produto.tamanho} - ${condicao} - R$ ${preco}`
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
      <div className="min-h-screen bg-black text-zinc-500 flex items-center justify-center font-mono">
        <p>erro ao carregar o catalogo.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-black border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-mono font-bold tracking-widest text-lg leading-none">FIVEOUT</p>
          <p className="font-mono text-xs text-zinc-500 mt-0.5">catalogo oficial</p>
        </div>
        <a
          href="https://instagram.com/fiveoout"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-zinc-400 hover:text-white transition-colors"
        >
          @fiveoout
        </a>
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {!produtos || produtos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-36 gap-4 text-zinc-600">
            <span className="text-5xl">✋</span>
            <p className="font-mono text-sm">nenhuma peca disponivel no momento.</p>
            <p className="font-mono text-xs text-zinc-700">acompanhe o instagram para novidades.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="border border-zinc-800 overflow-hidden"
              >
                {produto.foto_url ? (
                  <img
                    src={produto.foto_url}
                    alt={produto.nome}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-zinc-900 flex items-center justify-center font-mono text-zinc-700 text-xs">
                    sem foto
                  </div>
                )}

                <div className="p-4 flex flex-col gap-3 bg-zinc-950">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono font-bold text-base leading-tight uppercase tracking-wide">
                        {produto.nome}
                      </p>
                      <p className="font-mono text-xs text-zinc-400 mt-1 uppercase tracking-wider">
                        {produto.tamanho} / {produto.condicao === 'NOVO' ? 'NOVO' : 'SEMI-NOVO'}
                      </p>
                    </div>
                    <p className="font-mono font-bold text-white whitespace-nowrap">
                      R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <a
                    href={whatsappLink(produto)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center w-full bg-white text-black py-3 hover:bg-zinc-200 transition-colors"
                  >
                    tenho interesse
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center font-mono text-zinc-700 text-xs tracking-widest">
        FIVEOUT
      </footer>
    </div>
  )
}
