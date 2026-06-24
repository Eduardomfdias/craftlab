# Painel de Gestão — Redesign Spec

**Data:** 2026-06-24
**Projecto:** CraftLab.ed

---

## Objectivo

Redesenhar o painel de administração (`/painel`) com visual coerente com a marca, suporte a múltiplas fotos, edição de stock inline, filtros, e uma experiência mobile-first. Substituir o modal de edição por páginas dedicadas.

---

## Contexto

O painel actual (`src/app/(admin)/painel/page.tsx`) é um único ficheiro de ~382 linhas com:
- Lista de produtos
- Modal de criar/editar
- Upload de uma foto
- Tudo com estilos inline

**Problemas:** difícil de manter, mau no mobile, não suporta múltiplas fotos, sem filtros.

---

## Paleta e Tipografia

Usar as cores e fontes já definidas no projecto:

```
primary:  #2E6B9E
earth:    #0D253F
muted:    #5E8DAA
sand:     #A8CBE0
dark:     #0A1E32
bg:       #EEF5FB
linen:    #E0EDF7
warm:     #F0F7FD
red:      #c0392b
green:    #27ae60

serif: 'Cormorant Garamond', Georgia, serif
sans:  'Jost', system-ui, sans-serif
```

---

## Estrutura de Páginas

### `/painel` — Lista de produtos

**Header fixo:**
- Logo + nome "Painel de Gestão" (esquerda)
- Botão "Sair" (direita)

**Dashboard strip (3 números):**
- Total de produtos
- Em stock (stock > 0)
- Esgotados (stock === 0)

**Toolbar:**
- Input de pesquisa por nome
- Dropdown filtro por categoria (Todos / Anilhas / Porta-chaves / Combos)
- Toggle disponível/esgotado
- Botão "+ Novo produto" (leva para `/painel/produto/novo`)

**Lista de produtos:**
- Cards com: foto thumbnail (52×52), nome, preço, categoria, badge de stock
- Badge de stock clicável — abre um input inline para editar o stock sem sair da lista
- Botão "Editar" — navega para `/painel/produto/[slug]`
- Confirmação de apagar inline (dois cliques: "Apagar" → "Confirmar")

**Empty state:** mensagem quando não há produtos ou filtro não tem resultados.

---

### `/painel/produto/novo` — Criar produto

Página full com formulário completo:

**Campos:**
- Nome (text, obrigatório)
- Descrição curta (text, obrigatório)
- Descrição detalhada (textarea)
- Preço € (number)
- Stock (number, com cor por nível)
- Categoria (select: Anilhas / Porta-chaves / Combos)
- Etiqueta (select: Nenhuma / Best Seller / Novo / Oferta)
- Disponível (checkbox)
- Em destaque (checkbox)

**Fotos (múltiplas):**
- Grid de miniaturas das fotos já carregadas
- Cada foto tem botão de remover (×)
- Botão "Adicionar foto" — upload para Cloudinary (igual ao actual)
- Máximo de 6 fotos
- A primeira foto é a principal (exibida na loja)

**Acções:**
- Botão "Cancelar" → volta para `/painel`
- Botão "Criar produto" → POST `/api/admin/produtos` → redireciona para `/painel`

---

### `/painel/produto/[slug]` — Editar produto

Igual ao formulário de criar, mas:
- Pré-preenchido com os dados do produto
- Botão "Guardar alterações" → PUT `/api/admin/produtos/[slug]`
- Botão "Apagar produto" (com confirmação) → DELETE → redireciona para `/painel`
- Botão "Cancelar" → volta para `/painel`

---

## Edição de Stock Inline

Na lista, clicar no badge de stock:
1. Badge transforma-se num `<input type="number">` com o valor actual
2. Ao pressionar Enter ou perder foco → faz PUT `/api/admin/produtos/[slug]` com apenas o stock actualizado
3. Badge volta ao estado normal com o novo valor
4. Se falhar → mostra flash de erro, reverte o valor

---

## Filtros e Pesquisa

- Estado local (`useState`) — sem URL params, sem server state
- Filtro aplicado sobre a lista já carregada (client-side)
- Pesquisa: `nome.toLowerCase().includes(query.toLowerCase())`
- Categoria: filtra por valor exacto ou "todos"
- Disponibilidade: mostra todos / só disponíveis / só esgotados

---

## Upload de Múltiplas Fotos

- Reutiliza o endpoint `/api/admin/upload` (Cloudinary) — sem alterações no backend
- Upload sequencial (um ficheiro de cada vez)
- Mostra spinner por foto durante o upload
- Fotos guardadas como array de URLs em `fotos[]` no Supabase

---

## Flash Messages

- Toast flutuante no canto superior direito (não bloqueia conteúdo)
- Verde para sucesso, vermelho para erro
- Desaparece após 4 segundos

---

## Ficheiros

| Ficheiro | Acção |
|---|---|
| `src/app/(admin)/painel/page.tsx` | Reescrever — lista + dashboard + filtros |
| `src/app/(admin)/painel/produto/novo/page.tsx` | Criar — formulário de criação |
| `src/app/(admin)/painel/produto/[slug]/page.tsx` | Criar — formulário de edição |

O middleware (`src/middleware.ts`) já protege `/painel/:path*` — sem alterações necessárias.

---

## Não incluído

- Drag-and-drop para reordenação de fotos (YAGNI — adicionado depois se necessário)
- Analytics / gráficos de vendas
- Gestão de encomendas
- Múltiplos utilizadores / roles
