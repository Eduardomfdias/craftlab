import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return NextResponse.json({});

  const res = await fetch(`${url}/rest/v1/configuracoes?select=chave,valor`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return NextResponse.json({});

  const rows: { chave: string; valor: string }[] = await res.json();
  const config: Record<string, string> = {};
  for (const row of rows) config[row.chave] = row.valor;
  return NextResponse.json(config);
}
