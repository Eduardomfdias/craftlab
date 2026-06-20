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
    await writeProduto(params.slug, body, existing.sha as string | undefined);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? "Erro ao guardar" }, { status: 500 });
  }
  return NextResponse.json({ slug: params.slug, ...body });
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  const existing = await getProdutoStorage(params.slug);
  if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  await deleteProduto(params.slug, existing.sha as string ?? "");
  return NextResponse.json({ ok: true });
}
