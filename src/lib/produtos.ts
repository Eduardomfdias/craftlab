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

function restHeaders() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase não configurado");
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}` } };
}

export async function getProdutos(): Promise<Produto[]> {
  try {
    const { url, headers } = restHeaders();
    const res = await fetch(
      `${url}/rest/v1/produtos?select=*&disponivel=eq.true&order=nome`,
      { headers, cache: "no-store" }
    );
    if (!res.ok) return [];
    const rows: Row[] = await res.json();
    return rows.map(toproduto);
  } catch {
    return [];
  }
}

export async function getProdutosDestaque(): Promise<Produto[]> {
  try {
    const { url, headers } = restHeaders();
    const res = await fetch(
      `${url}/rest/v1/produtos?select=*&disponivel=eq.true&destaque=eq.true&order=nome&limit=4`,
      { headers, cache: "no-store" }
    );
    if (!res.ok) return [];
    const rows: Row[] = await res.json();
    return rows.map(toproduto);
  } catch {
    return [];
  }
}

export async function getProduto(slug: string): Promise<Produto | null> {
  try {
    const { url, headers } = restHeaders();
    const res = await fetch(
      `${url}/rest/v1/produtos?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      { headers, cache: "no-store" }
    );
    if (!res.ok) return null;
    const rows: Row[] = await res.json();
    return rows[0] ? toproduto(rows[0]) : null;
  } catch {
    return null;
  }
}
