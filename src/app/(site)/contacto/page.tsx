"use client";

import { useState } from "react";
import { Mail, MapPin, ArrowRight, Send } from "lucide-react";

function IgIcon({ size = 15, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none"/>
    </svg>
  );
}

const P = {
  primary:   "#2E6B9E",
  primaryH:  "#1E5480",
  bg:        "#EEF5FB",
  linen:     "#E0EDF7",
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
};

const faqs = [
  { q: "Quanto tempo demora uma encomenda personalizada?", a: "Normalmente entre 3 a 7 dias úteis, dependendo da complexidade e das cores escolhidas." },
  { q: "Fazem envios para fora de Portugal?", a: "Ainda não, mas estamos a trabalhar nisso! Por enquanto enviamos apenas para Portugal continental e ilhas." },
  { q: "Posso escolher as cores da minha anilha?", a: "Sim! Temos uma vasta gama de cores de corda. Fala connosco e mostramos as opções disponíveis." },
  { q: "Fazem peças para grupos de escuteiros?", a: "Com muito gosto! Para encomendas de grupo temos preços especiais. Entra em contacto para um orçamento." },
];

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", assunto: "Encomenda", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    background: P.bg,
    border: `1px solid ${P.sand}80`,
    color: P.earth,
    outline: "none",
    fontFamily: T.sans,
    fontSize: "0.88rem",
    fontWeight: 300,
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontFamily: T.sans,
    fontSize: "0.58rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
    color: P.muted,
    marginBottom: "0.5rem",
  };

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ paddingTop: 96, background: P.dark, minHeight: 360, display: "flex", alignItems: "center", position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1920&auto=format&fit=crop"
          alt="Contacto"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.15) saturate(0.4)" }}
        />
        <div style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "5rem 1.5rem" }}>
          <div className="ornament-line" style={{ color: `${P.rope}70`, marginBottom: "2rem", maxWidth: 200 }}>
            Fala connosco
          </div>
          <h1 style={{ fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(3rem,6vw,5rem)", color: P.warmWhite, lineHeight: 1.1, maxWidth: 580 }}>
            Conta-nos a tua história.
          </h1>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <section style={{ background: P.linen, padding: "7rem 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem" }}>

          {/* Contact Info */}
          <div>
            <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: P.primary, marginBottom: "0.75rem" }}>Informações</p>
            <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2rem,3vw,2.8rem)", color: P.earth, lineHeight: 1.1, marginBottom: "2rem" }}>
              Estamos cá para ti.
            </h2>
            <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.92rem", color: P.muted, lineHeight: 1.85, marginBottom: "2.5rem" }}>
              Tens alguma dúvida, queres fazer uma encomenda personalizada ou simplesmente queres saber mais sobre o que fazemos? Fala connosco — respondemos em menos de 24 horas.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem" }}>
              <a href="mailto:craftlab.ed@gmail.com" style={{ display: "flex", alignItems: "center", gap: "0.875rem", textDecoration: "none" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${P.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={20} style={{ color: P.primary }} />
                </div>
                <div>
                  <p style={{ fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: "0.2rem" }}>E-mail</p>
                  <p style={{ fontFamily: T.sans, fontSize: "0.88rem", color: P.earth }}>craftlab.ed@gmail.com</p>
                </div>
              </a>

              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 40, height: 40, background: P.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={15} color="#fff" />
                </div>
                <div>
                  <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: "0.15rem" }}>Localização</p>
                  <p style={{ fontFamily: T.sans, fontSize: "0.88rem", color: P.earth }}>Portugal · Envio nacional</p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/craftlab.ed"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "0.875rem", textDecoration: "none" }}
              >
                <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IgIcon size={15} color="#fff" />
                </div>
                <div>
                  <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: "0.15rem" }}>Instagram</p>
                  <p style={{ fontFamily: T.sans, fontSize: "0.88rem", color: P.earth }}>@craftlab.ed</p>
                </div>
              </a>
            </div>

            {/* Social CTA */}
            <div style={{ borderTop: `1px solid ${P.sand}60`, paddingTop: "2rem" }}>
              <p style={{ fontFamily: T.sans, fontSize: "0.7rem", fontWeight: 300, color: P.muted, marginBottom: "1rem" }}>
                Segue-nos no Instagram para ver os últimos trabalhos e novidades.
              </p>
              <a
                href="https://www.instagram.com/craftlab.ed"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: T.sans, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: P.earth, textDecoration: "none", borderBottom: `1px solid ${P.earth}30`, paddingBottom: "0.2rem" }}
              >
                <IgIcon size={13} /> @craftlab.ed <ArrowRight size={12} />
              </a>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: P.warmWhite, padding: "3rem 2.5rem" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <span style={{ fontFamily: T.serif, fontSize: "3.5rem", color: P.primary, lineHeight: 1, display: "block", marginBottom: "1rem" }}>✦</span>
                <h3 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "2rem", fontWeight: 400, color: P.earth, marginBottom: "0.75rem" }}>Mensagem enviada!</h3>
                <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.88rem", color: P.muted, lineHeight: 1.75 }}>
                  Obrigado por entrares em contacto. Respondemos em menos de 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: P.primary, marginBottom: "1.25rem" }}>Envia-nos uma mensagem</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Nome</label>
                    <input
                      type="text"
                      required
                      placeholder="O teu nome"
                      value={form.nome}
                      onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="o.teu@email.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Assunto</label>
                  <select
                    value={form.assunto}
                    onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  >
                    <option>Encomenda</option>
                    <option>Personalização</option>
                    <option>Encomenda de Grupo</option>
                    <option>Dúvida Geral</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Mensagem</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Conta-nos o que precisas..."
                    value={form.mensagem}
                    onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", background: P.primary, color: "#fff", padding: "1rem 2rem", fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
                >
                  Enviar Mensagem <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section style={{ background: P.bg, padding: "6rem 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: P.primary, marginBottom: "0.75rem" }}>Dúvidas frequentes</p>
            <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 400, color: P.earth, lineHeight: 1 }}>Perguntas & Respostas</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderTop: `1px solid ${P.sand}60`, padding: "2rem 0" }}>
                <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: "0.9rem", color: P.earth, marginBottom: "0.75rem" }}>{faq.q}</p>
                <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.875rem", color: P.muted, lineHeight: 1.8 }}>{faq.a}</p>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${P.sand}60` }} />
          </div>
        </div>
      </section>

    </div>
  );
}
