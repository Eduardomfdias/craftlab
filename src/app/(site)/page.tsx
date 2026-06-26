"use client";

import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Produto } from "@/lib/produtos";

const P = {
  primary: "#2E6B9E",
  primaryH: "#1E5480",
  primaryL: "#5B96BF",
  bg: "#EEF5FB",
  linen: "#E0EDF7",
  cream: "#D0E5F5",
  earth: "#0D253F",
  muted: "#5E8DAA",
  rope: "#7FADC8",
  sand: "#A8CBE0",
  dark: "#0A1E32",
  warmWhite: "#F0F7FD",
};

const T = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Jost', system-ui, sans-serif",
};


const categories = [
  { chave: "categoria_img_anilhas",      label: "Anilhas Escutistas", sub: "Nós de poliéster perfeitos",      href: "/loja?categoria=anilhas" },
  { chave: "categoria_img_porta-chaves", label: "Porta-chaves",       sub: "Nós náuticos e decorativos",      href: "/loja?categoria=porta-chaves" },
  { chave: "categoria_img_combos",       label: "Combos & Packs",     sub: "Conjuntos com desconto especial", href: "/loja?categoria=combos" },
];

const perks = [
  { icon: "✦", text: "100% Feito à Mão" },
  { icon: "✦", text: "Personalização Disponível" },
  { icon: "✦", text: "Envio Nacional Grátis acima de 30€" },
  { icon: "✦", text: "Cores à Escolha" },
];

const DEFAULT_CAT_IMGS: Record<string, string> = {
  "categoria_img_anilhas":      "/produtos/scout_anilha.png",
  "categoria_img_porta-chaves": "/produtos/scout_keychain.png",
  "categoria_img_combos":       "/produtos/scout_hero.png",
};

export default function Home() {
  const [featured, setFeatured] = useState<Produto[]>([]);
  const [catImgs, setCatImgs] = useState<Record<string, string>>(DEFAULT_CAT_IMGS);

  useEffect(() => {
    fetch("/api/produtos?destaque=true")
      .then(r => r.json())
      .then((data: Produto[]) => setFeatured(data))
      .catch(() => {});
    fetch("/api/config")
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        setCatImgs(prev => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, []);

  return (

    <div style={{ width: "100%", overflowX: "hidden" }}>

      {/* ═══ HERO ═══════════════════════════════════════ */}
      <section style={{ height: "100svh", minHeight: 640, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img
          src="/produtos/scout_hero.png"
          alt="Feito à mão. Feito para ti"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "brightness(0.28) saturate(0.6)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, rgba(10,30,50,0.3) 0%, rgba(13,37,63,0.65) 100%)` }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem", maxWidth: 880, margin: "0 auto" }}>
          <div className="ornament-line hero-divider" style={{ color: `${P.rope}88`, marginBottom: "2.5rem" }}>
            Feito à mão, feito para ti
          </div>

          <h1 className="hero-title" style={{ fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(3rem, 7.5vw, 6.2rem)", lineHeight: 1.05, color: P.warmWhite, letterSpacing: "-0.01em", marginBottom: "1.5rem" }}>
            Cada Nó tem<br />uma história.
          </h1>

          <p className="hero-sub" style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "1.05rem", color: `${P.warmWhite}b8`, letterSpacing: "0.05em", maxWidth: 500, margin: "0 auto 2.75rem", lineHeight: 1.75 }}>
            Acessórios em corda, com qualidade, rigor e dedicação.
          </p>

          <div className="hero-cta" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/loja" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: P.primary, color: "#fff", padding: "1.1rem 2.2rem", fontFamily: T.sans, fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.3s" }} onMouseEnter={e => (e.currentTarget.style.background = P.primaryH)} onMouseLeave={e => (e.currentTarget.style.background = P.primary)}>
              Ver Coleção <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${P.warmWhite}40` }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${P.warmWhite}40, transparent)` }} />
        </div>
      </section>

      {/* ═══ TRUST STRIP ════════════════════════════════ */}
      <div style={{ background: P.linen, borderTop: `1px solid ${P.sand}`, borderBottom: `1px solid ${P.sand}`, padding: "1.25rem 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem 3.5rem" }}>
          {perks.map(({ icon, text }) => (
            <span key={text} style={{ fontFamily: T.sans, fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: P.muted }}>
              {icon}  {text}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ FEATURED PRODUCTS ══════════════════════════ */}
      {featured.length > 0 && <section style={{ background: P.bg, padding: "7rem 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "4rem", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: P.primary, marginBottom: "0.75rem" }}>Os Nossos Produtos</p>
              <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "clamp(2.8rem,5vw,4rem)", fontWeight: 400, color: P.earth, lineHeight: 1 }}>Em Destaque</h2>
            </div>
            <Link href="/loja" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: T.sans, fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, textDecoration: "none" }}>
              Ver todos <MoveRight size={15} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.75rem" }}>
            {featured.map((p) => (
              <Link key={p.slug} href={`/produto/${p.slug}`} className="product-card" style={{ display: "block", textDecoration: "none" }}>
                <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: P.cream, marginBottom: "1.1rem" }}>
                  <img src={p.fotos[0]} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {p.tag && (
                    <span style={{ position: "absolute", top: 12, left: 12, background: P.primary, color: "#fff", fontFamily: T.sans, fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.3rem 0.75rem" }}>
                      {p.tag}
                    </span>
                  )}
                  <div className="card-overlay" style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: `${P.earth}ee`, padding: "0.9rem", textAlign: "center" }}>
                    <span style={{ fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: P.warmWhite }}>Ver Produto</span>
                  </div>
                </div>
                <p style={{ fontFamily: T.sans, fontSize: "0.85rem", fontWeight: 500, color: P.earth }}>{p.nome}</p>
                <p style={{ fontFamily: T.sans, fontSize: "0.75rem", color: P.rope, marginTop: "0.2rem", fontWeight: 300, fontStyle: "italic" }}>{p.descricao}</p>
                <p style={{ fontFamily: T.sans, fontSize: "0.85rem", color: P.primary, marginTop: "0.4rem", fontWeight: 500 }}>{p.preco.toFixed(2).replace(".", ",")} €</p>
              </Link>
            ))}
          </div>
        </div>
      </section>}

      {/* ═══ PERSONALIZAÇÃO BANNER ══════════════════════ */}
      <section style={{ background: P.primary, padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
          <div>
            <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${P.warmWhite}66`, marginBottom: "0.75rem" }}>Exclusivo</p>
            <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: P.warmWhite, lineHeight: 1.15 }}>
              Queres personalizar um artigo?
            </h2>
            <p style={{ fontFamily: T.sans, fontWeight: 300, color: `${P.warmWhite}80`, fontSize: "0.88rem", marginTop: "0.75rem" }}>
              Podemos fazê-lo em várias cores e estilos.
            </p>
          </div>
          <Link
            href="/contacto"
            style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "0.5rem", background: P.warmWhite, color: P.primary, padding: "0.9rem 2rem", fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}
          >
            Falar Connosco <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ═══ CATEGORIES ═════════════════════════════════ */}
      <section style={{ background: P.cream, padding: "6rem 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: P.primary, marginBottom: "0.75rem" }}>Categorias</p>
            <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "clamp(2.8rem,5vw,4rem)", fontWeight: 400, color: P.earth, lineHeight: 1 }}>Explora a Loja</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {categories.map((c) => (
              <Link key={c.label} href={c.href} className="group" style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", display: "block", textDecoration: "none" }}>
                <img src={catImgs[c.chave]} alt={c.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease", filter: "saturate(0.75)" }} className="group-hover:scale-105" />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.dark}e0 0%, ${P.dark}10 55%, transparent 100%)` }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.75rem" }}>
                  <p style={{ fontFamily: T.serif, fontStyle: "italic", color: P.warmWhite, fontSize: "1.9rem", lineHeight: 1, marginBottom: "0.35rem" }}>{c.label}</p>
                  <p style={{ fontFamily: T.sans, fontSize: "0.7rem", color: `${P.sand}99`, fontWeight: 300, marginBottom: "0.75rem" }}>{c.sub}</p>
                  <span style={{ fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: `${P.sand}77`, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    Ver tudo <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BRAND STORY ════════════════════════════════ */}
      <section style={{ background: P.bg, padding: "7rem 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "4rem", alignItems: "center" }}>
          {/* Image collage */}
          <div style={{ position: "relative", height: 520 }}>
            <img
              src={catImgs["historia_img_principal"] || "/produtos/scout_process.png"}
              alt="Processo artesanal"
              style={{ position: "absolute", top: 0, left: 0, width: "68%", height: "68%", objectFit: "cover", filter: "saturate(0.7)" }}
            />
            <img
              src={catImgs["historia_img_secundaria"] || "/produtos/scout_anilha.png"}
              alt="Anilha de corda"
              style={{ position: "absolute", bottom: 0, right: 0, width: "54%", height: "54%", objectFit: "cover", border: `4px solid ${P.bg}`, filter: "saturate(0.7)" }}
            />
            <div style={{ position: "absolute", bottom: "5.5rem", left: "0.5rem", background: P.primary, color: "#fff", padding: "1.25rem 1.5rem", maxWidth: 195 }}>
              <p style={{ fontFamily: T.serif, fontSize: "1.25rem", fontStyle: "italic", lineHeight: 1.35 }}>&quot;Cada Nó tem uma história.&quot;</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="ornament-line" style={{ marginBottom: "2rem" }}>A Nossa História</div>
            <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2.5rem,4vw,3.5rem)", color: P.earth, lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Feito à mão,<br />para ti!
            </h2>
            <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.95rem", color: P.muted, lineHeight: 1.8, marginBottom: "2rem" }}>
              A paixão pelo artesanato nasceu de forma natural, ao criar os primeiros artigos em corda para uso próprio. O que começou como um passatempo para consumo pessoal, rapidamente despertou o interesse de amigos, até evoluir para a criação do CraftLab.ed.
            </p>
            <p style={{ fontFamily: T.sans, fontWeight: 300, color: P.muted, lineHeight: 1.85, fontSize: "0.95rem", marginBottom: "2.5rem" }}>
              Cada peça é criada com rigor e dedicação. Usamos corda de qualidade superior para que o nó fique perfeito e resista ao dia a dia. Podemos personalizar cores e tamanhos.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem", marginBottom: "2.5rem" }}>
              {[["200+", "Artigos vendidos"], ["100%", "Feito à mão"], ["∞", "Cores disponíveis"]].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "2.5rem", color: P.primary, lineHeight: 1 }}>{n}</p>
                  <p style={{ fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.rope, marginTop: "0.3rem" }}>{l}</p>
                </div>
              ))}
            </div>

            <Link
              href="/sobre"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: T.sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.earth, textDecoration: "none", borderBottom: `1px solid ${P.earth}40`, paddingBottom: "0.25rem" }}
            >
              Conhecer a história <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ REDES SOCIAIS ═════════════════════════════════ */}
      <section style={{ background: P.dark, paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "0 1.5rem" }}>
          <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${P.warmWhite}45`, marginBottom: "1.25rem" }}>
            Redes Sociais
          </p>
          <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: P.warmWhite, marginBottom: "0.75rem", lineHeight: 1.2 }}>
            Segue-nos no Instagram<br />e Facebook
          </h2>
          <p style={{ fontFamily: T.sans, fontWeight: 300, color: `${P.warmWhite}70`, fontSize: "0.9rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Para ficares a par mais rapidamente de todas as novidades!
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a href="https://www.instagram.com/craftlab.ed" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "1rem 2rem", background: P.primary, color: P.warmWhite, fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.3s" }} onMouseEnter={e => (e.currentTarget.style.background = P.primaryH)} onMouseLeave={e => (e.currentTarget.style.background = P.primary)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/profile.php?id=61588184506129" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "1rem 2rem", background: "transparent", border: `1px solid ${P.primary}`, color: P.warmWhite, fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.3s" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(46,107,158,0.15)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Facebook
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
