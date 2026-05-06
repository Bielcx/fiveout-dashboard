# ✋ Fiveout Dashboard

Painel de gestão da loja Fiveout — controle de estoque, catálogo público e integração com WhatsApp.

🛍️ **[Ver catálogo](https://fiveout-dashboard.vercel.app/catalogo)** · 🔐 **[Painel admin](https://fiveout-dashboard.vercel.app/login)**

---

## Sobre o projeto

A Fiveout é uma loja de roupas novas e semi-novas vendida pelo Instagram. O problema era que o estoque ficava desatualizado — peças vendidas continuavam aparecendo online.

Esse painel resolve isso: cadastre uma peça, ela aparece no catálogo público. Vendeu? Muda o status e some na hora.

---

## Funcionalidades

**Catálogo público** (`/catalogo`)
- Lista peças disponíveis com foto, preço e tamanho
- Botão "Tenho interesse" abre WhatsApp com mensagem pronta
- Mobile-first, identidade visual da marca

**Painel admin** (`/produtos`)
- Cadastro de peças com upload de foto
- Controle de status: Disponível / Reservado / Vendido
- Autenticação protegida — só o dono acessa

---

## Stack

| Tecnologia | Uso |
|---|---|
| Next.js 15 + TypeScript | Framework fullstack |
| Supabase | Banco PostgreSQL + Auth + Storage |
| Tailwind CSS | Estilização |
| Vercel | Deploy |

---

## Como rodar

```bash
git clone https://github.com/Bielcx/fiveout-dashboard.git
cd fiveout-dashboard
npm install
```

Cria um arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

```bash
npm run dev
```

Acessa `http://localhost:3000`

---

## Melhorias futuras

- [ ] Dashboard com métricas de vendas e faturamento
- [ ] Registrar venda com nome do comprador e preço
- [ ] Filtro por tamanho e condição no catálogo
- [ ] Notificação no WhatsApp quando alguém demonstrar interesse
- [ ] Domínio personalizado

---

## Decisões técnicas

**Supabase SSR** — autenticação via cookies para funcionar corretamente com o App Router do Next.js, sem problemas de hidratação.

**Storage do Supabase** — fotos das peças armazenadas diretamente no Supabase Storage com URL pública, sem necessidade de CDN externo.

**Catálogo como página pública** — separação clara entre rotas públicas (`/catalogo`) e rotas protegidas (`/produtos`, `/dashboard`), com proxy de autenticação bloqueando acesso não autorizado.