# CraftLab.ed — Documentação

Loja online de artesanato escuteiro português. Vende anilhas, porta-chaves e combos feitos à mão, com carrinho de compras, encomendas via WhatsApp e painel de gestão de produtos.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Tech Stack](#tech-stack)
3. [Estrutura de Ficheiros](#estrutura-de-ficheiros)
4. [Páginas e Rotas](#páginas-e-rotas)
5. [API Endpoints](#api-endpoints)
6. [Modelo de Dados](#modelo-de-dados)
7. [Sistema de Storage](#sistema-de-storage)
8. [Painel de Administração](#painel-de-administração)
9. [Autenticação](#autenticação)
10. [Carrinho de Compras](#carrinho-de-compras)
11. [Variáveis de Ambiente](#variáveis-de-ambiente)
12. [Correr Localmente](#correr-localmente)
13. [Deploy no Vercel](#deploy-no-vercel)

---

## Visão Geral

O **CraftLab.ed** é uma plataforma de e-commerce artesanal com as seguintes funcionalidades:

- **Loja pública** com catálogo filtrável por categoria
- **Página de produto** com galeria, stock em tempo real e seleção de quantidade
- **Carrinho lateral** (drawer) com gestão de itens
- **Checkout via WhatsApp** — gera link `wa.me` com mensagem formatada
- **Painel admin** protegido por password para criar, editar e apagar produtos
- **Storage híbrido** — ficheiros locais em desenvolvimento, GitHub API em produção (Vercel)

---

## Tech Stack

| Categoria | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5 |
| UI | React 18, inline styles, Lucide React |
| Tipografia | Cormorant Garamond + Jost (Google Fonts) |
| CMS alternativo | Keystatic Core 0.5 |
| Storage local | Node.js `fs` |
| Storage produção | GitHub Contents API |
| Auth | Cookie httpOnly + HMAC-SHA256 (Web Crypto API) |
| Deploy | Vercel |

---

## Estrutura de Ficheiros

```
craftlab/
├── content/
│   └── produtos/                  ← dados dos produtos (JSON)
│       ├── anilha-escutista-classica.json
│       ├── combo-escutista-completo.json
│       └── porta-chaves-no-nautico.json
│
├── public/
│   ├── logo.png                   ← logo (PNG transparente branco, 2000×2000)
│   └── produtos/                  ← imagens locais dos produtos
│
└── src/
    ├── app/
    │   ├── (site)/                ← rotas públicas (com Navbar + Footer)
    │   │   ├── layout.tsx
    │   │   ├── page.tsx           ← homepage
    │   │   ├── loja/              ← catálogo
    │   │   ├── produto/[slug]/    ← página de produto
    │   │   ├── sobre/             ← "O Processo"
    │   │   ├── contacto/          ← formulário de contacto
    │   │   └── encomenda/         ← checkout
    │   │
    │   ├── (admin)/               ← rotas admin (sem Navbar pública)
    │   │   ├── painel/            ← painel de gestão de produtos
    │   │   └── keystatic/         ← CMS alternativo
    │   │
    │   ├── admin-login/           ← página de login
    │   │
    │   └── api/
    │       ├── auth/              ← POST login / DELETE logout
    │       ├── produtos/          ← GET lista e GET por slug (público)
    │       ├── admin/produtos/    ← CRUD completo (protegido)
    │       ├── encomenda/         ← gera link WhatsApp
    │       └── keystatic/         ← API interna Keystatic
    │
    ├── components/
    │   ├── layout/
    │   │   ├── navbar.tsx         ← navbar com efeito de scroll
    │   │   └── footer.tsx
    │   └── cart/
    │       └── CartDrawer.tsx     ← drawer lateral do carrinho
    │
    ├── context/
    │   └── CartContext.tsx        ← estado global do carrinho
    │
    ├── lib/
    │   ├── produtos.ts            ← leitura de produtos (servidor, filesystem)
    │   ├── storage.ts             ← abstração local/GitHub (read + write)
    │   └── utils.ts
    │
    ├── keystatic.config.ts        ← configuração do Keystatic CMS
    └── middleware.ts              ← proteção de rotas /painel e /api/admin
```

---

## Páginas e Rotas

### Públicas

| Rota | Ficheiro | Descrição |
|---|---|---|
| `/` | `(site)/page.tsx` | Homepage: hero, produtos em destaque, categorias, brand story, newsletter |
| `/loja` | `(site)/loja/page.tsx` | Catálogo com filtro por categoria |
| `/produto/[slug]` | `(site)/produto/[slug]/page.tsx` | Produto individual: galeria, stock, quantidade, carrinho |
| `/sobre` | `(site)/sobre/page.tsx` | Página "O Processo" |
| `/contacto` | `(site)/contacto/page.tsx` | Formulário de contacto / personalização |
| `/encomenda` | `(site)/encomenda/page.tsx` | Checkout via WhatsApp |

### Admin (protegidas por cookie)

| Rota | Descrição |
|---|---|
| `/admin-login` | Página de login (redireciona para `/painel` se autenticado) |
| `/painel` | Painel CRUD de produtos |
| `/keystatic` | CMS alternativo Keystatic |

---

## API Endpoints

### Produtos — público

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos` | Lista todos os produtos com `disponivel: true` |
| `GET` | `/api/produtos/[slug]` | Detalhes de um produto por slug |

### Produtos — admin (requer cookie `craftlab_admin`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/admin/produtos` | Lista todos os produtos (incluindo indisponíveis) |
| `POST` | `/api/admin/produtos` | Cria novo produto (slug gerado automaticamente) |
| `GET` | `/api/admin/produtos/[slug]` | Produto por slug (inclui `sha` para updates no GitHub) |
| `PUT` | `/api/admin/produtos/[slug]` | Atualiza produto |
| `DELETE` | `/api/admin/produtos/[slug]` | Apaga produto |

### Auth

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth` | Login — valida password e define cookie (8h) |
| `DELETE` | `/api/auth` | Logout — remove cookie |

### Encomenda

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/encomenda` | Recebe itens + dados do cliente → devolve link `wa.me` |

---

## Modelo de Dados

### Tipo `Produto`

```typescript
type Produto = {
  slug:            string;                               // identificador único (gerado do nome)
  nome:            string;
  descricao:       string;                               // descrição curta (usada nos cards)
  descricaoLonga?: string;                               // texto completo na página do produto
  preco:           number;                               // preço em euros
  categoria:       "anilhas" | "porta-chaves" | "combos";
  tag?:            "Best seller" | "Novo" | "Oferta";   // badge opcional no card
  stock:           number;                               // 0 = esgotado
  destaque:        boolean;                              // aparece na homepage
  disponivel:      boolean;                              // visível na loja pública
  fotos:           string[];                             // URLs ou caminhos /produtos/*.jpg
};
```

### Ficheiro JSON (`content/produtos/slug.json`)

O `slug` **não é guardado** dentro do ficheiro — é derivado do nome do ficheiro ao ler.

```json
{
  "nome": "Anilha Escutista Clássica",
  "descricao": "Em corda de algodão trançada à mão",
  "descricaoLonga": "Feita com corda de algodão 100% natural...",
  "preco": 4.5,
  "categoria": "anilhas",
  "tag": "Best seller",
  "stock": 8,
  "destaque": true,
  "disponivel": true,
  "fotos": ["https://images.unsplash.com/..."]
}
```

### Geração de slug

Gerado automaticamente ao criar um produto, a partir do nome:

```
"Anilha Escutista Clássica"  →  "anilha-escutista-classica"
"Porta-chaves Nó Náutico"   →  "porta-chaves-no-nautico"
```

Regras: minúsculas → remover acentos → espaços e caracteres especiais por `-`.

---

## Sistema de Storage

O ficheiro `src/lib/storage.ts` abstrai o acesso aos dados. O comportamento muda automaticamente consoante o ambiente, detetado pela variável `VERCEL=1` (definida automaticamente pelo Vercel).

### Local (`npm run dev`)

Lê e escreve diretamente em `content/produtos/*.json` via `fs` do Node.js. Não requer configuração adicional.

### Vercel (produção)

Usa a **GitHub Contents API** para ler e escrever ficheiros diretamente no repositório. Cada escrita cria um commit.

> **Nota:** A GitHub API exige o `sha` atual de um ficheiro para o atualizar (evita conflitos). O endpoint `PUT /api/admin/produtos/[slug]` faz sempre um `GET` primeiro para obter o `sha` antes de escrever.

```
Admin edita produto
       ↓
PUT /api/admin/produtos/[slug]
       ↓
GitHub Contents API → commit no repositório
       ↓
Vercel deteta push → redeploy automático
       ↓
Loja atualizada
```

---

## Painel de Administração

Acesso em `/painel` (requer login em `/admin-login`).

### Funcionalidades

| Ação | Descrição |
|---|---|
| Listar produtos | Tabela com foto, nome, preço e badge de stock colorido |
| Criar produto | Botão `+ Novo Produto` → modal com todos os campos |
| Editar produto | Botão `Editar` → mesmo modal preenchido com dados atuais |
| Apagar produto | Dentro do modal de edição → botão vermelho com confirmação obrigatória |

### Cores do stock

- 🟢 **Verde** — mais de 3 unidades
- 🟠 **Laranja** — 1 a 3 unidades ("últimas!")
- 🔴 **Vermelho** — 0 unidades (esgotado)

---

## Autenticação

Sistema simples de password única (painel pessoal, sem múltiplos utilizadores).

### Fluxo

1. Utilizador envia password para `POST /api/auth`
2. Servidor compara com `ADMIN_PASSWORD` via comparação em tempo constante (evita timing attacks)
3. Se correta: gera `HMAC-SHA256(password, ADMIN_SECRET)` e guarda em cookie `craftlab_admin`
4. Cookie: `httpOnly`, `Secure` em produção, `SameSite: lax`, duração **8 horas**
5. Em cada pedido protegido, o middleware valida o cookie
6. Logout: `DELETE /api/auth` apaga o cookie

### Rotas protegidas (`middleware.ts`)

```
/painel/:path*
/keystatic/:path*
/api/admin/:path*
/api/keystatic/:path*
```

---

## Carrinho de Compras

Estado gerido por **React Context** (`CartContext.tsx`). Não há persistência — o carrinho é limpo ao fechar o browser.

### API do contexto

```typescript
const { items, count, addItem, removeItem, updateQty, clear, open, setOpen } = useCart();
```

### Fluxo de encomenda

1. Cliente adiciona produtos → drawer abre automaticamente
2. Clica em "Encomendar" → vai para `/encomenda`
3. Preenche nome, email, telefone, morada e notas
4. Frontend envia `POST /api/encomenda` com itens + dados
5. API gera mensagem WhatsApp formatada e devolve link `wa.me`
6. Browser abre WhatsApp com mensagem pré-preenchida para o número configurado

---

## Variáveis de Ambiente

Ficheiro `.env.local` para desenvolvimento. No Vercel: **Settings → Environment Variables**.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ADMIN_PASSWORD` | ✅ | Password de acesso ao painel admin |
| `ADMIN_SECRET` | ✅ | Chave secreta para assinar o cookie. Gerar com: `openssl rand -hex 32` |
| `WHATSAPP_NUMBER` | ✅ | Número WhatsApp sem `+` (ex: `351911799876`) |
| `GITHUB_REPO` | Vercel | Repositório. Formato: `utilizador/repositorio` |
| `GITHUB_TOKEN` | Vercel | Personal Access Token com permissão `contents:write` |
| `GITHUB_BRANCH` | Vercel | Branch dos produtos. Default: `main` |

### Exemplo de `.env.local`

```env
ADMIN_PASSWORD=MinhaPasswordSegura123
ADMIN_SECRET=7f3a9b2e1c4d5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1
WHATSAPP_NUMBER=351911799876

# Só necessário no Vercel:
GITHUB_REPO=Eduardomfdias/craftlab
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_BRANCH=main
```

---

## Correr Localmente

```bash
# Clonar o repositório
git clone https://github.com/Eduardomfdias/craftlab.git
cd craftlab

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Criar .env.local com os valores acima

# Correr em desenvolvimento
npm run dev
# → http://localhost:3000

# Build de produção
npm run build
npm run start
```

### Criar o primeiro produto localmente

1. Ir para `http://localhost:3000/admin-login`
2. Introduzir a password configurada em `ADMIN_PASSWORD`
3. Em `/painel` clicar em `+ Novo Produto`
4. O ficheiro é guardado automaticamente em `content/produtos/slug.json`

---

## Deploy no Vercel

### Pré-requisitos

1. Repositório no GitHub com `content/produtos/*.json` commitado
2. Conta no Vercel ligada ao GitHub
3. Personal Access Token GitHub com permissão **Contents → Read & Write**

### Passos

1. Vercel → **New Project** → importar repositório GitHub
2. Framework Preset: **Next.js** (detetado automaticamente)
3. **Settings → Environment Variables** → adicionar todas as variáveis
4. **Deploy**

A partir daí, cada `git push` para `main` dispara um redeploy automático.

### Criar token GitHub para o Vercel

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Selecionar o repositório do CraftLab.ed
3. **Repository permissions → Contents → Read and write**
4. Copiar o token para `GITHUB_TOKEN` no Vercel

---

## Notas

### Navbar com efeito de scroll

- **Sem scroll:** fundo transparente, logo branco (visível sobre hero escuro)
- **Com scroll:** fundo `#EEF5FB` com blur, logo preto (`filter: brightness(0)`), links escuros

### Keystatic CMS (alternativo ao `/painel`)

O `/keystatic` é um CMS visual que usa a mesma pasta `content/produtos/`. Pode coexistir com o painel personalizado — ambos escrevem para os mesmos ficheiros JSON.

### Imagens dos produtos

O campo `fotos` aceita:
- URLs externas: `https://images.unsplash.com/...`
- Caminhos locais: `/produtos/nome.jpg` (ficheiro em `public/produtos/`)
