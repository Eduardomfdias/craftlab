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
