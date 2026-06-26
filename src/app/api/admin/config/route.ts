import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CHAVES = ["categoria_img_anilhas", "categoria_img_porta-chaves", "categoria_img_combos", "historia_img_principal", "historia_img_secundaria", "loja_img_capa"] as const;

export async function GET() {
  const { data } = await supabase
    .from("configuracoes")
    .select("chave, valor")
    .in("chave", CHAVES);

  const config: Record<string, string> = {};
  for (const row of data ?? []) config[row.chave] = row.valor;
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const body = await req.json() as Record<string, string>;

  const rows = CHAVES
    .filter(k => body[k] !== undefined)
    .map(k => ({ chave: k, valor: body[k] }));

  if (rows.length === 0) return NextResponse.json({ ok: true });

  const { error } = await supabase
    .from("configuracoes")
    .upsert(rows, { onConflict: "chave" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
