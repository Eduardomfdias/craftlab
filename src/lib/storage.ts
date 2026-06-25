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
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase não configurado");

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

  const res = await fetch(`${url}/rest/v1/produtos?on_conflict=slug`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
}

export async function deleteProduto(slug: string): Promise<void> {
  const { error } = await supabase
    .from("produtos")
    .delete()
    .eq("slug", slug);
  if (error) throw new Error(error.message);
}
