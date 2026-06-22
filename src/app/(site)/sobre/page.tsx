"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const P = {
  primary:   "#2E6B9E",
  primaryH:  "#1E5480",
  bg:        "#EEF5FB",
  linen:     "#E0EDF7",
  cream:     "#D0E5F5",
  earth:     "#0D253F",
  muted:     "#5E8DAA",
  rope:      "#7FADC8",
  sand:      "#A8CBE0",
  dark:      "#0A1E32",
  warmWhite: "#F0F7FD",
};
const T = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'Jost', system-ui, sans-serif",
};const steps = [
  {
    n: "01",
    title: "O Material Certo",
    body: "Usamos corda 100% poliéster de qualidade. Com materiais fracos, os nós nunca ficam perfeitos e as peças acabam por ficar mal acabadas. A resistência é chave.",
    img: "/produtos/scout_process.png",
  },
  {
    n: "02",
    title: "O Nó",
    body: "Cada nó é dado à mão com extrema dedicação e rigor técnico. Esta precisão garante que a peça mantém a sua forma perfeita e nunca se desfaz com o tempo.",
    img: "/produtos/scout_hero.png",
  },
  {
    n: "03",
    title: "Personalização",
    body: "Cores, tamanhos ou símbolos específicos: tudo é possível. Trabalhamos contigo para criar algo único que conta a tua história.",
    img: "/produtos/scout_keychain.png",
  },
  {
    n: "04",
    title: "Embalagem e Envio",
    body: "Cada peça é devidamente acomodada e embalada com cuidado, acompanhada de uma nota escrita à mão. O envio é feito por correio para todo o país, ou entregue em mão mediante acordo.",
    img: "/produtos/scout_embalagem.png",
  },
];

const values = [
  { icon: "⌀", label: "Artesanato Real", desc: "Sem máquinas. Sem atalhos. Cada peça é feita do início ao fim pelas nossas mãos." },
  { icon: "✧", label: "Qualidade do Material", desc: "Poliéster de alta resistência para nós perfeitamente acabados e uma peça que dura." },
  { icon: "✦", label: "Identidade Escutista", desc: "Nascemos no escutismo e é isso que nos distingue. Os nós têm significado." },
];

export default function SobrePage() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ paddingTop: 96, position: "relative", background: P.dark, minHeight: 480, display: "flex", alignItems: "center" }}>
        <img
          src="/produtos/scout_process.png"
          alt="O Processo"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.18) saturate(0.5)" }}
        />
        <div style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "5rem 1.5rem" }}>
          <div className="ornament-line" style={{ color: `${P.rope}70`, marginBottom: "2rem", maxWidth: 280 }}>
            Como é feito
          </div>
          <h1 style={{ fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(3rem,6vw,5rem)", color: P.warmWhite, lineHeight: 1.1, maxWidth: 640, marginBottom: "1.5rem" }}>
            O Processo por trás de cada Nó.
          </h1>
          <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "1rem", color: `${P.warmWhite}80`, maxWidth: 480, lineHeight: 1.8 }}>
            Acreditamos que saber como algo é feito torna-o mais especial. Por isso partilhamos cada passo.
          </p>
        </div>
      </section>

      {/* ── INTRO QUOTE ─────────────────────────────── */}
      <div style={{ background: P.primary, padding: "3rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "clamp(1.6rem,3vw,2.2rem)", color: P.warmWhite, maxWidth: 640, margin: "0 auto", lineHeight: 1.4 }}>
          &ldquo;Cada Nó tem uma história — e nós queremos que a tua seja especial.&rdquo;
        </p>
      </div>

      {/* ── STEPS ───────────────────────────────────── */}
      <section style={{ background: P.bg, padding: "7rem 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "7rem" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center", direction: i % 2 === 1 ? "rtl" : "ltr" }}>
              <div style={{ direction: "ltr" }}>
                <span style={{ fontFamily: T.serif, fontSize: "5rem", fontStyle: "italic", color: `${P.primary}25`, lineHeight: 1 }}>{s.n}</span>
                <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2rem,3.5vw,2.8rem)", color: P.earth, lineHeight: 1.1, marginTop: "-1rem", marginBottom: "1.25rem" }}>
                  {s.title}
                </h2>
                <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.95rem", color: P.muted, lineHeight: 1.85 }}>
                  {s.body}
                </p>
              </div>
              <div style={{ direction: "ltr", aspectRatio: "4/3", overflow: "hidden" }}>
                <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.8)" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────── */}
      <section style={{ background: P.cream, padding: "6rem 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: P.primary, marginBottom: "0.75rem" }}>Os nossos valores</p>
            <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 400, color: P.earth, lineHeight: 1 }}>
              O que nos move.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            {values.map((v) => (
              <div key={v.label} style={{ background: P.bg, padding: "2.5rem 2rem", borderTop: `3px solid ${P.primary}` }}>
                <span style={{ fontFamily: T.serif, fontSize: "2.5rem", color: P.primary, lineHeight: 1, display: "block", marginBottom: "1rem" }}>{v.icon}</span>
                <p style={{ fontFamily: T.sans, fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", color: P.earth, marginBottom: "0.75rem" }}>{v.label}</p>
                <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.88rem", color: P.muted, lineHeight: 1.75 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section style={{ background: P.dark, padding: "6rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${P.warmWhite}40`, marginBottom: "1.25rem" }}>Pronto para começar?</p>
        <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: P.warmWhite, marginBottom: "2.5rem", lineHeight: 1.2 }}>
          A tua história começa aqui.
        </h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/loja" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: P.primary, color: "#fff", padding: "1rem 2.5rem", fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
            Ver Coleção <ArrowRight size={14} />
          </Link>
          <Link href="/contacto" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", border: "1px solid rgba(240,247,253,0.25)", color: "rgba(240,247,253,0.75)", padding: "1rem 2.5rem", fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
            Falar Connosco
          </Link>
        </div>
      </section>

    </div>
  );
}
