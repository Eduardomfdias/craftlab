import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CHAVES = ["categoria_img_anilhas", "categoria_img_porta-chaves", "categoria_img_combos"];

export async function GET() {
  const { data } = await supabase
    .from("configuracoes")
    .select("chave, valor")
    .in("chave", CHAVES);

  const config: Record<string, string> = {};
  for (const row of data ?? []) config[row.chave] = row.valor;
  return NextResponse.json(config);
}
