"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ArrowRight, ShoppingBag, CheckCircle, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

const P = {
  primary:   "#2E6B9E",
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

const inputStyle = {
  width: "100%",
  padding: "0.875rem 1rem",
  background: P.warmWhite,
  border: `1px solid ${P.sand}90`,
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
  fontSize: "0.55rem",
  letterSpacing: "0.25em",
  textTransform: "uppercase" as const,
  color: P.muted,
  marginBottom: "0.5rem",
};

export default function EncomendaPage() {
  const { items, total, count, clear } = useCart();
  const [enviado, setEnviado] = useState<"whatsapp" | "email" | null>(null);
  const [enviando, setEnviando] = useState<"whatsapp" | "email" | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", morada: "", notas: "" });

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  /* ─── WhatsApp ───────────────────────────────────── */
  const enviarWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando("whatsapp");
    try {
      const res = await fetch("/api/encomenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          itens: items.map(i => ({ nome: i.nome, qty: i.qty, preco: i.preco })),
        }),
      });
      const { url } = await res.json();
      clear();
      setEnviado("whatsapp");
      window.open(url, "_blank");
    } finally {
      setEnviando(null);
    }
  };

  /* ─── Email (Formspree) ──────────────────────────── */
  const enviarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formspreeId || formspreeId === "COLOCA_AQUI") return;
    setEnviando("email");
    const linhas = items.map(i => `• ${i.nome} x${i.qty} — ${(i.preco * i.qty).toFixed(2).replace(".", ",")} €`).join("\n");
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Nova encomenda de ${form.nome} — CraftLab.ed`,
          ...form,
          encomenda: linhas,
          total: `${total.toFixed(2).replace(".", ",")} €`,
        }),
      });
      if (res.ok) { clear(); setEnviado("email"); }
    } finally {
      setEnviando(null);
    }
  };

  /* ─── Carrinho vazio ─────────────────────────────── */
  if (count === 0 && !enviado) {
    return (
      <div style={{ minHeight: "100svh", paddingTop: 96, background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <ShoppingBag size={56} color={P.sand} style={{ margin: "0 auto 1.5rem" }} />
          <h1 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "2.5rem", fontWeight: 400, color: P.earth, marginBottom: "0.75rem" }}>O carrinho está vazio.</h1>
          <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.9rem", color: P.muted, marginBottom: "2rem" }}>Adiciona produtos antes de fazer a encomenda.</p>
          <Link href="/loja" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: P.primary, color: "#fff", padding: "0.9rem 2rem", fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
            Ver Loja <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Sucesso ────────────────────────────────────── */
  if (enviado) {
    return (
      <div style={{ minHeight: "100svh", paddingTop: 96, background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 480 }}>
          <CheckCircle size={56} color={P.primary} style={{ margin: "0 auto 1.5rem" }} />
          <h1 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "2.8rem", fontWeight: 400, color: P.earth, marginBottom: "0.75rem", lineHeight: 1.2 }}>Encomenda enviada!</h1>
          <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.92rem", color: P.muted, marginBottom: "0.5rem", lineHeight: 1.8 }}>
            {enviado === "whatsapp"
              ? "O WhatsApp abriu com a tua encomenda. Envia a mensagem e aguarda confirmação."
              : "Recebemos a tua encomenda por email. Respondemos em menos de 24 horas."}
          </p>
          <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.82rem", color: P.rope, marginBottom: "2.5rem", fontStyle: "italic" }}>Não cobraremos nada sem confirmação prévia.</p>
          <Link href="/loja" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: P.primary, color: "#fff", padding: "0.9rem 2rem", fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
            Continuar a comprar <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Formulário ─────────────────────────────────── */
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>

      {/* Header */}
      <section style={{ paddingTop: 96, background: P.dark, minHeight: 220, display: "flex", alignItems: "center", position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1920&auto=format&fit=crop"
          alt="Encomenda"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.12) saturate(0.4)" }}
        />
        <div style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
          <div className="ornament-line" style={{ color: `rgba(127,173,200,0.6)`, marginBottom: "1.25rem", maxWidth: 180 }}>Finalizar</div>
          <h1 style={{ fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2.5rem,5vw,4rem)", color: P.warmWhite, lineHeight: 1.1 }}>
            A tua encomenda.
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: P.linen, padding: "5rem 0 7rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "start" }}>

          {/* Resumo */}
          <div style={{ background: P.warmWhite, padding: "2.5rem" }}>
            <p style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: P.primary, marginBottom: "1.5rem" }}>Resumo</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <img src={item.foto} alt={item.nome} style={{ width: 60, height: 75, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: "0.85rem", color: P.earth }}>{item.nome}</p>
                    <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.75rem", color: P.muted, marginTop: "0.15rem" }}>Qtd: {item.qty}</p>
                  </div>
                  <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: "0.88rem", color: P.primary, flexShrink: 0 }}>
                    {(item.preco * item.qty).toFixed(2).replace(".", ",")} €
                  </p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${P.sand}60`, paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: T.sans, fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted }}>Subtotal</span>
                <span style={{ fontFamily: T.sans, fontWeight: 500, fontSize: "0.9rem", color: P.earth }}>{total.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: T.sans, fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: P.muted }}>Envio</span>
                <span style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.82rem", color: P.rope, fontStyle: "italic" }}>{total >= 25 ? "Grátis" : "A calcular"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: `1px solid ${P.sand}60`, paddingTop: "1rem" }}>
                <span style={{ fontFamily: T.sans, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: P.earth, fontWeight: 500 }}>Total</span>
                <span style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "2rem", color: P.earth }}>{total.toFixed(2).replace(".", ",")} €</span>
              </div>
            </div>
            {total >= 25 && (
              <div style={{ marginTop: "1.25rem", background: `${P.primary}12`, border: `1px solid ${P.primary}30`, padding: "0.875rem 1rem" }}>
                <p style={{ fontFamily: T.sans, fontSize: "0.68rem", color: P.primary, fontWeight: 500 }}>✦ Envio grátis incluído!</p>
              </div>
            )}
          </div>

          {/* Form */}
          <div>
            <p style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: P.primary, marginBottom: "2rem" }}>Os teus dados</p>

            <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Nome *</label>
                  <input required type="text" placeholder="O teu nome" value={form.nome}
                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input required type="email" placeholder="o.teu@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input type="tel" placeholder="+351 9XX XXX XXX" value={form.telefone}
                  onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Morada de entrega</label>
                <input type="text" placeholder="Rua, número, código postal, cidade" value={form.morada}
                  onChange={e => setForm(f => ({ ...f, morada: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Notas (cores, personalização, etc.)</label>
                <textarea rows={3} placeholder="Cores específicas? Personalização? Conta-nos aqui."
                  value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: `${P.primary}10`, padding: "1.25rem", borderLeft: `3px solid ${P.primary}` }}>
                  <p style={{ fontFamily: T.sans, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: P.primary, marginBottom: "0.5rem", fontWeight: 600 }}>Como funciona o pagamento?</p>
                  <p style={{ fontFamily: T.sans, fontSize: "0.8rem", fontWeight: 300, color: P.earth, lineHeight: 1.6 }}>
                    Como as nossas peças são artesanais, a tua encomenda é validada manualmente após o envio deste formulário. Quando o teu pedido estiver pronto para ser enviado, entraremos em contacto para acertar os detalhes do pagamento (MBWay ou Transferência). Não pagas nada agora!
                  </p>
                </div>

                <div style={{ background: `${P.primary}10`, padding: "1.25rem", borderLeft: `3px solid ${P.primary}` }}>
                  <p style={{ fontFamily: T.sans, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: P.primary, marginBottom: "0.5rem", fontWeight: 600 }}>Fazem pedidos personalizados?</p>
                  <p style={{ fontFamily: T.sans, fontSize: "0.8rem", fontWeight: 300, color: P.earth, lineHeight: 1.6 }}>
                    Sim! Mesmo que não tenhamos a cor ou a peça específica no catálogo atual, conseguimos fazer produtos totalmente personalizados para ti. Basta deixares as tuas ideias na caixa de notas. Pedimos apenas compreensão para com o tempo extra necessário para a sua confeção artesanal.
                  </p>
                </div>
              </div>

              {/* ─── Botões de envio ─── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>

                {/* WhatsApp */}
                <button
                  type="button"
                  disabled={!form.nome || !form.email || enviando !== null}
                  onClick={enviarWhatsApp}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    background: enviando === "whatsapp" ? "#128c7e" : "#25D366",
                    color: "#fff",
                    padding: "1rem",
                    fontFamily: T.sans, fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                    border: "none", cursor: enviando !== null || !form.nome || !form.email ? "not-allowed" : "pointer",
                    opacity: !form.nome || !form.email ? 0.5 : 1,
                    transition: "background 0.2s",
                  }}
                >
                  <MessageCircle size={20} />
                  {enviando === "whatsapp" ? "A abrir..." : "WhatsApp"}
                </button>

                {/* Email */}
                <button
                  type="button"
                  disabled={!form.nome || !form.email || enviando !== null || !formspreeId || formspreeId === "COLOCA_AQUI"}
                  onClick={enviarEmail}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    background: enviando === "email" ? P.muted : P.primary,
                    color: "#fff",
                    padding: "1rem",
                    fontFamily: T.sans, fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                    border: "none", cursor: enviando !== null || !form.nome || !form.email ? "not-allowed" : "pointer",
                    opacity: !form.nome || !form.email || !formspreeId || formspreeId === "COLOCA_AQUI" ? 0.5 : 1,
                    transition: "background 0.2s",
                  }}
                >
                  <Mail size={20} />
                  {enviando === "email" ? "A enviar..." : "Email"}
                </button>
              </div>

              {(!formspreeId || formspreeId === "COLOCA_AQUI") && (
                <p style={{ fontFamily: T.sans, fontSize: "0.65rem", color: P.muted, fontStyle: "italic" }}>
                  * Email desativado — adiciona o Formspree ID ao .env.local para ativar.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
