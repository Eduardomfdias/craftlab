import { NextRequest, NextResponse } from "next/server";
import { getProdutos, getProdutosDestaque } from "@/lib/produtos";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const destaque = req.nextUrl.searchParams.get("destaque");
  const produtos = destaque === "true" ? await getProdutosDestaque() : await getProdutos();
  return NextResponse.json(produtos);
}
