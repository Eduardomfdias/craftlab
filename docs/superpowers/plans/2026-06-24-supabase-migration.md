# Migração para Supabase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o armazenamento de produtos (ficheiros JSON via GitHub API / filesystem) por uma tabela Supabase, e remover o Keystatic.

**Architecture:** Cliente Supabase server-side partilhado em `src/lib/supabase.ts`. As funções públicas de `src/lib/produtos.ts` e as funções admin de `src/lib/storage.ts` são reescritas para usar Supabase directamente. As API routes e o painel `/painel` não mudam.

**Tech Stack:** Next.js 14, TypeScript, Supabase (`@supabase/supabase-js` já instalado), Cloudinary (imagens — sem alterações).

## Global Constraints

- Next.js 14, TypeScript strict
- `@supabase/supabase-js` já está em `package.json` — não instalar novamente
- Não mudar nada no painel `/painel` nem nas API routes
- Não mudar nada no Cloudinary (upload de imagens)
- Não mudar nada na rota `/api/encomenda`
- Supabase cloud (não local) — usar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- Coluna `descricao_longa` em snake_case no Postgres; mapear para `descricaoLonga` no TypeScript
- Vercel: adicionar as env vars no dashboard da Vercel também

---

## File Map

| Ficheiro | Acção |
|---|---|
| `src/lib/supabase.ts` | **Criar** — cliente Supabase partilhado |
| `src/lib/storage.ts` | **Reescrever** — CRUD via Supabase |
| `src/lib/produtos.ts` | **Reescrever** — leituras públicas via Supabase |
| `src/middleware.ts` | **Modificar** — remover referências ao Keystatic |
| `src/keystatic.config.ts` | **Apagar** |
| `src/app/(admin)/keystatic/` | **Apagar** directório completo |
| `src/app/api/keystatic/` | **Apagar** directório completo |
| `package.json` | **Modificar** — remover `@keystatic/core` e `@keystatic/next` |
| `scripts/migrate-to-supabase.ts` | **Criar** — script one-time para migrar os JSON existentes |

---

## Task 1: Criar a tabela no Supabase

**Files:**
- (sem ficheiros de código — acção no dashboard Supabase)

**Interfaces:**
- Produces: tabela `produtos` com as colunas abaixo, pronta para receber dados

- [ ] **Step 1: Abrir o Supabase Dashboard**

  Vai a [https://supabase.com/dashboard](https://supabase.com/dashboard) → selecciona o teu projecto → **SQL Editor** → **New query**.

- [ ] **Step 2: Executar o SQL de criação da tabela**

  Cola e executa:

  ```sql
  create table if not exists produtos (
    slug            text primary key,
    nome            text not null,
    descricao       text not null,
    descricao_longa text,
    preco           numeric(10,2) not null,
    categoria       text not null check (categoria in ('anilhas','porta-chaves','combos')),
    tag             text,
    stock           integer not null default 0,
    destaque        boolean not null default false,
    disponivel      boolean not null default true,
    fotos           text[] not null default '{}'
  );
  ```

  Resultado esperado: `Success. No rows returned`

- [ ] **Step 3: Verificar a tabela**

  No painel esquerdo, clica em **Table Editor** → deves ver `produtos` na lista.

- [ ] **Step 4: Desactivar Row Level Security (RLS)**

  O acesso é feito exclusivamente pelo backend com a `service_role_key` (que ignora RLS). Confirma que RLS está desactivado na tabela:

  ```sql
  alter table produtos disable row level security;
  ```

  Resultado esperado: `Success. No rows returned`

---

## Task 2: Configurar variáveis de ambiente

**Files:**
- Modify: `.env.local` (cria se não existir)

**Interfaces:**
- Produces: `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` disponíveis no processo Node

- [ ] **Step 1: Obter as credenciais do Supabase**

  Dashboard Supabase → **Project Settings** → **API**:
  - Copia o **Project URL** (ex: `https://xxxxxxxxxxx.supabase.co`)
  - Copia a **service_role key** (a secreta, NÃO a anon key)

- [ ] **Step 2: Adicionar ao `.env.local`**

  Cria ou edita `/Users/edias/craftlab/.env.local` e adiciona:

  ```
  SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
  ```

  (mantém as vars existentes: `CLOUDINARY_*`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `WHATSAPP_NUMBER`)

- [ ] **Step 3: Adicionar as mesmas vars na Vercel**

  Dashboard Vercel → projecto **craftlab** → **Settings** → **Environment Variables**:
  - Adiciona `SUPABASE_URL`
  - Adiciona `SUPABASE_SERVICE_ROLE_KEY`
  - Podes remover `GITHUB_REPO`, `GITHUB_BRANCH`, `GITHUB_TOKEN` depois de confirmar que tudo funciona

- [ ] **Step 4: Confirmar que o servidor de dev consegue ler as vars**

  ```bash
  cd /Users/edias/craftlab
  node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.SUPABASE_URL ? 'OK' : 'MISSING')"
  ```

  Resultado esperado: `OK`

---

## Task 3: Criar o cliente Supabase

**Files:**
- Create: `src/lib/supabase.ts`

**Interfaces:**
- Produces: `supabase` — cliente Supabase com `service_role_key`, pronto para CRUD server-side

- [ ] **Step 1: Criar `src/lib/supabase.ts`**

  ```typescript
  import { createClient } from "@supabase/supabase-js";

  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  export const supabase = createClient(url, key);
  ```

- [ ] **Step 2: Verificar que TypeScript não dá erros**

  ```bash
  cd /Users/edias/craftlab
  npx tsc --noEmit
  ```

  Resultado esperado: sem erros relacionados com `supabase.ts`

---

## Task 4: Reescrever `src/lib/storage.ts`

**Files:**
- Modify: `src/lib/storage.ts`

**Interfaces:**
- Consumes: `supabase` de `@/lib/supabase`
- Produces (mesmas assinaturas de antes):
  - `listProdutos(): Promise<Produto[]>`
  - `getProdutoStorage(slug: string): Promise<Produto | null>`
  - `writeProduto(slug: string, data: Record<string, unknown>): Promise<void>`
  - `deleteProduto(slug: string): Promise<void>`
  - Nota: `sha` removido de `writeProduto` e `deleteProduto` — já não é necessário

- [ ] **Step 1: Substituir o conteúdo de `src/lib/storage.ts`**

  ```typescript
  import { supabase } from "@/lib/supabase";

  type Row = {
    slug: string;
    nome: string;
    descricao: string;
    descricao_longa: string | null;
    preco: number;
    categoria: string;
    tag: string | null;
    stock: number;
    destaque: boolean;
    disponivel: boolean;
    fotos: string[];
  };

  function toproduto(row: Row) {
    return {
      slug: row.slug,
      nome: row.nome,
      descricao: row.descricao,
      descricaoLonga: row.descricao_longa ?? undefined,
      preco: row.preco,
      categoria: row.categoria as "anilhas" | "porta-chaves" | "combos",
      tag: row.tag ?? undefined,
      stock: row.stock,
      destaque: row.destaque,
      disponivel: row.disponivel,
      fotos: row.fotos,
    };
  }

  export async function listProdutos() {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");
    if (error) throw new Error(error.message);
    return (data as Row[]).map(toproduto);
  }

  export async function getProdutoStorage(slug: string) {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) return null;
    return toproduto(data as Row);
  }

  export async function writeProduto(
    slug: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const row = {
      slug,
      nome: data.nome,
      descricao: data.descricao,
      descricao_longa: data.descricaoLonga ?? null,
      preco: data.preco,
      categoria: data.categoria,
      tag: data.tag ?? null,
      stock: data.stock,
      destaque: data.destaque,
      disponivel: data.disponivel,
      fotos: data.fotos,
    };
    const { error } = await supabase
      .from("produtos")
      .upsert(row, { onConflict: "slug" });
    if (error) throw new Error(error.message);
  }

  export async function deleteProduto(slug: string): Promise<void> {
    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("slug", slug);
    if (error) throw new Error(error.message);
  }
  ```

- [ ] **Step 2: Verificar TypeScript**

  ```bash
  cd /Users/edias/craftlab
  npx tsc --noEmit
  ```

  Resultado esperado: sem erros

---

## Task 5: Reescrever `src/lib/produtos.ts`

**Files:**
- Modify: `src/lib/produtos.ts`

**Interfaces:**
- Consumes: `supabase` de `@/lib/supabase`
- Produces (mesmas assinaturas de antes):
  - `getProdutos(): Promise<Produto[]>`
  - `getProdutosDestaque(): Promise<Produto[]>`
  - `getProduto(slug: string): Promise<Produto | null>`

- [ ] **Step 1: Substituir o conteúdo de `src/lib/produtos.ts`**

  ```typescript
  import { supabase } from "@/lib/supabase";

  export type Produto = {
    slug: string;
    nome: string;
    descricao: string;
    descricaoLonga?: string;
    preco: number;
    categoria: "anilhas" | "porta-chaves" | "combos";
    tag?: string;
    stock: number;
    destaque: boolean;
    disponivel: boolean;
    fotos: string[];
  };

  type Row = {
    slug: string;
    nome: string;
    descricao: string;
    descricao_longa: string | null;
    preco: number;
    categoria: string;
    tag: string | null;
    stock: number;
    destaque: boolean;
    disponivel: boolean;
    fotos: string[];
  };

  function toproduto(row: Row): Produto {
    return {
      slug: row.slug,
      nome: row.nome,
      descricao: row.descricao,
      descricaoLonga: row.descricao_longa ?? undefined,
      preco: row.preco,
      categoria: row.categoria as Produto["categoria"],
      tag: row.tag ?? undefined,
      stock: row.stock,
      destaque: row.destaque,
      disponivel: row.disponivel,
      fotos: row.fotos,
    };
  }

  export async function getProdutos(): Promise<Produto[]> {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("disponivel", true)
      .order("nome");
    if (error) return [];
    return (data as Row[]).map(toproduto);
  }

  export async function getProdutosDestaque(): Promise<Produto[]> {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("disponivel", true)
      .eq("destaque", true)
      .order("nome")
      .limit(4);
    if (error) return [];
    return (data as Row[]).map(toproduto);
  }

  export async function getProduto(slug: string): Promise<Produto | null> {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) return null;
    return toproduto(data as Row);
  }
  ```

- [ ] **Step 2: Verificar TypeScript**

  ```bash
  cd /Users/edias/craftlab
  npx tsc --noEmit
  ```

  Resultado esperado: sem erros

---

## Task 6: Actualizar as API routes (remover `sha`)

**Files:**
- Modify: `src/app/api/admin/produtos/[slug]/route.ts`

**Interfaces:**
- Consumes: `getProdutoStorage`, `writeProduto`, `deleteProduto` de `@/lib/storage` (sem `sha`)

- [ ] **Step 1: Substituir o conteúdo de `src/app/api/admin/produtos/[slug]/route.ts`**

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { getProdutoStorage, writeProduto, deleteProduto } from "@/lib/storage";

  export const dynamic = "force-dynamic";

  export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
    const produto = await getProdutoStorage(params.slug);
    if (!produto) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(produto);
  }

  export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
    const existing = await getProdutoStorage(params.slug);
    if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    const body = await req.json();
    try {
      await writeProduto(params.slug, body);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message ?? "Erro ao guardar" }, { status: 500 });
    }
    return NextResponse.json({ slug: params.slug, ...body });
  }

  export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
    const existing = await getProdutoStorage(params.slug);
    if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    await deleteProduto(params.slug);
    return NextResponse.json({ ok: true });
  }
  ```

- [ ] **Step 2: Verificar TypeScript**

  ```bash
  cd /Users/edias/craftlab
  npx tsc --noEmit
  ```

  Resultado esperado: sem erros

---

## Task 7: Migrar dados existentes para Supabase

**Files:**
- Create: `scripts/migrate-to-supabase.ts`

**Interfaces:**
- Consumes: ficheiros JSON em `content/produtos/*.json`
- Produces: linhas inseridas na tabela `produtos` do Supabase

- [ ] **Step 1: Criar o script de migração**

  ```typescript
  // scripts/migrate-to-supabase.ts
  import fs from "fs";
  import path from "path";
  import { createClient } from "@supabase/supabase-js";

  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, key);

  const dir = path.join(process.cwd(), "content/produtos");

  async function main() {
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
      const row = {
        slug,
        nome: raw.nome,
        descricao: raw.descricao,
        descricao_longa: raw.descricaoLonga ?? null,
        preco: raw.preco,
        categoria: raw.categoria,
        tag: raw.tag ?? null,
        stock: raw.stock,
        destaque: raw.destaque,
        disponivel: raw.disponivel,
        fotos: raw.fotos,
      };
      const { error } = await supabase.from("produtos").upsert(row, { onConflict: "slug" });
      if (error) {
        console.error(`❌ ${slug}:`, error.message);
      } else {
        console.log(`✅ ${slug}`);
      }
    }
  }

  main().catch(console.error);
  ```

- [ ] **Step 2: Correr o script de migração**

  ```bash
  cd /Users/edias/craftlab
  npx tsx --env-file=.env.local scripts/migrate-to-supabase.ts
  ```

  Resultado esperado (um linha por produto):
  ```
  ✅ anilha-escutista-classica
  ✅ combo-escutista-completo
  ✅ porta-chaves-no-nautico
  ✅ test1
  ```

- [ ] **Step 3: Confirmar no Supabase Dashboard**

  Table Editor → `produtos` → deves ver as 4 linhas.

---

## Task 8: Remover o Keystatic

**Files:**
- Delete: `src/keystatic.config.ts`
- Delete: `src/app/(admin)/keystatic/` (directório completo)
- Delete: `src/app/api/keystatic/` (directório completo)
- Modify: `src/middleware.ts`
- Modify: `package.json`

- [ ] **Step 1: Apagar os ficheiros do Keystatic**

  ```bash
  rm /Users/edias/craftlab/src/keystatic.config.ts
  rm -rf /Users/edias/craftlab/src/app/\(admin\)/keystatic
  rm -rf /Users/edias/craftlab/src/app/api/keystatic
  ```

- [ ] **Step 2: Actualizar `src/middleware.ts`**

  Substituir o conteúdo por:

  ```typescript
  import { NextRequest, NextResponse } from "next/server";

  const COOKIE     = "craftlab_admin";
  const LOGIN_PATH = "/admin-login";

  async function makeToken(password: string, secret: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }

  export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isAdmin =
      pathname.startsWith("/painel") ||
      pathname.startsWith("/api/admin");

    if (!isAdmin) return NextResponse.next();

    const token    = req.cookies.get(COOKIE)?.value ?? "";
    const password = process.env.ADMIN_PASSWORD ?? "";
    const secret   = process.env.ADMIN_SECRET   ?? "";

    if (password && secret) {
      const expected = await makeToken(password, secret);
      if (safeEqual(token, expected)) return NextResponse.next();
    }

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  export const config = {
    matcher: ["/painel", "/painel/:path*", "/api/admin/:path*"],
  };
  ```

- [ ] **Step 3: Remover dependências do Keystatic**

  ```bash
  cd /Users/edias/craftlab
  npm uninstall @keystatic/core @keystatic/next
  ```

  Resultado esperado: `removed N packages`

- [ ] **Step 4: Verificar TypeScript**

  ```bash
  cd /Users/edias/craftlab
  npx tsc --noEmit
  ```

  Resultado esperado: sem erros

---

## Task 9: Teste final

- [ ] **Step 1: Arrancar o servidor de dev**

  ```bash
  cd /Users/edias/craftlab
  npm run dev
  ```

- [ ] **Step 2: Verificar a loja pública**

  Abre [http://localhost:3000/loja](http://localhost:3000/loja) — deves ver os produtos vindos do Supabase.

- [ ] **Step 3: Verificar o painel de admin**

  Abre [http://localhost:3000/painel](http://localhost:3000/painel) — faz login, cria um produto de teste, edita-o e apaga-o.

- [ ] **Step 4: Confirmar no Supabase Dashboard**

  Table Editor → `produtos` — confirma que as alterações do step 3 aparecem aqui.

- [ ] **Step 5: Commit final**

  ```bash
  cd /Users/edias/craftlab
  git add -A
  git commit -m "feat: migrate products storage to Supabase, remove Keystatic"
  ```

- [ ] **Step 6: Deploy na Vercel**

  Confirma que as env vars `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão no dashboard da Vercel, depois faz push:

  ```bash
  git push
  ```

  Abre o URL de produção e verifica que a loja e o painel funcionam.
