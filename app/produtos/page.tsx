import { supabase } from '@/lib/supabase'

export default async function Produtos() {
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) {
    console.error(error)
    return <p>Erro ao carregar produtos</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>{produto.nome}</li>
          ))}
        </ul>
      )}
    </main>
  )
}