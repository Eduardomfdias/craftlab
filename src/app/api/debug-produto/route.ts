import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase.from("produtos").select("slug, nome, fotos").order("nome");
  return NextResponse.json({ error: error?.message ?? null, produtos: data });
}
