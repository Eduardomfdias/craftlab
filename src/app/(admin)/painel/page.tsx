"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const P = {
  primary: "#2E6B9E",
  earth:   "#0D253F",
  muted:   "#5E8DAA",
  sand:    "#A8CBE0",
  dark:    "#0A1E32",
  bg:      "#EEF5FB",
  linen:   "#E0EDF7",
  warm:    "#F0F7FD",
  red:     "#c0392b",
  green:   "#27ae60",
};
const T = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'Jost', system-ui, sans-serif",
};

type Produto = {
  slug: string;
  nome: string;
  descricao: string;
  descricaoLonga?: string;
  preco: number;
  categoria: string;
  tag?: string;
  stock: number;
  destaque: boolean;
  disponivel: boolean;
  fotos: string[];
};

const EMPTY: Omit<Produto, "slug"> = {
  nome: "", descricao: "", descricaoLonga: "",
  preco: 0, categoria: "anilhas", tag: "",
  stock: 10, destaque: false, disponivel: true, fotos: [],
};

export default function PainelPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState<Omit<Produto, "slug">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const carregar = () => {
    setLoading(true);
    fetch("/api/admin/produtos")
      .then(r => r.json())
      .then(d => { setProdutos(d); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const flash = (text: string) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const abrirEditar = (p: Produto) => {
    setEditando(p);
    setCriando(false);
    setForm({ nome: p.nome, descricao: p.descricao, descricaoLonga: p.descricaoLonga ?? "",
      preco: p.preco, categoria: p.categoria, tag: p.tag ?? "",
      stock: p.stock, destaque: p.destaque, disponivel: p.disponivel, fotos: p.fotos });
  };

  const abrirCriar = () => {
    setCriando(true);
    setEditando(null);
    setForm(EMPTY);
  };

  const fechar = () => { setEditando(null); setCriando(false); };

  const salvar = async () => {
    setSaving(true);
    if (editando) {
      const res = await fetch(`/api/admin/produtos/${editando.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); flash(d.error ?? "Erro ao guardar"); setSaving(false); return; }
      flash("Guardado!");
    } else {
      const res = await fetch("/api/admin/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); flash(d.error ?? "Erro"); setSaving(false); return; }
      flash("Produto criado!");
    }
    setSaving(false);
    fechar();
    carregar();
  };

  const apagar = async (slug: string) => {
    await fetch(`/api/admin/produtos/${slug}`, { method: "DELETE" });
    setConfirmDelete(null);
    flash("Apagado.");
    carregar();
  };

  const sair = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin-login");
  };

  const f = (field: keyof typeof form, val: unknown) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const stockColor = (s: number) =>
    s === 0 ? P.red : s <= 3 ? "#e67e22" : P.green;

  /* ── UI ─────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: "100svh", background: P.bg, fontFamily: T.sans }}>

      {/* header */}
      <div style={{ background: P.dark, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src="/logo.png" alt="CraftLab.ed" style={{ height: 36, width: 36, objectFit: "contain" }} />
          <span style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.1rem", color: "#fff" }}>Painel de Gestão</span>
        </div>
        <button onClick={sair}
          style={{ fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: `${P.sand}80`, background: "none", border: "none", cursor: "pointer" }}>
          Sair
        </button>
      </div>

      {/* flash msg */}
      {msg && (
        <div style={{ background: P.green, color: "#fff", padding: "0.75rem 1.25rem", fontFamily: T.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textAlign: "center" }}>
          {msg}
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* título + botão novo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <p style={{ fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: P.muted }}>
            {produtos.length} produto{produtos.length !== 1 ? "s" : ""}
          </p>
          <button onClick={abrirCriar}
            style={{ background: P.primary, color: "#fff", border: "none", padding: "0.6rem 1.25rem", fontFamily: T.sans, fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
            + Novo produto
          </button>
        </div>

        {/* lista */}
        {loading ? (
          <p style={{ textAlign: "center", color: P.muted, padding: "3rem 0", fontSize: "0.75rem" }}>A carregar...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {produtos.map(p => (
              <div key={p.slug} style={{ background: "#fff", border: `1px solid ${P.sand}50`, padding: "1rem 1.125rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>

                {/* foto thumb */}
                <div style={{ width: 52, height: 52, background: P.linen, flexShrink: 0, overflow: "hidden" }}>
                  {p.fotos?.[0] && <img src={p.fotos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>

                {/* info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: "0.88rem", color: P.earth, marginBottom: "0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.nome}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: P.muted }}>{p.preco.toFixed(2).replace(".", ",")} €</p>
                </div>

                {/* stock badge — clicável para editar rapidamente */}
                <button onClick={() => abrirEditar(p)}
                  style={{ flexShrink: 0, background: stockColor(p.stock) + "18", border: `1px solid ${stockColor(p.stock)}50`, color: stockColor(p.stock), borderRadius: 4, padding: "0.3rem 0.6rem", fontFamily: T.sans, fontSize: "0.65rem", fontWeight: 600, cursor: "pointer", minWidth: 52, textAlign: "center" }}>
                  {p.stock === 0 ? "Esgotado" : `Stock: ${p.stock}`}
                </button>

                {/* editar */}
                <button onClick={() => abrirEditar(p)}
                  style={{ flexShrink: 0, background: P.linen, border: `1px solid ${P.sand}60`, color: P.earth, padding: "0.45rem 0.875rem", fontFamily: T.sans, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL EDITAR / CRIAR ──────────────────────────── */}
      {(editando || criando) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,30,50,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) fechar(); }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 640, maxHeight: "92svh", overflowY: "auto", borderRadius: "12px 12px 0 0", padding: "1.5rem 1.25rem 2rem" }}>

            {/* handle bar */}
            <div style={{ width: 40, height: 4, background: P.sand, borderRadius: 2, margin: "0 auto 1.25rem" }} />

            <h2 style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.6rem", color: P.earth, marginBottom: "1.25rem" }}>
              {criando ? "Novo produto" : "Editar produto"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              <Field label="Nome do produto *">
                <input value={form.nome} onChange={e => f("nome", e.target.value)}
                  style={inputStyle} placeholder="Ex: Anilha Escutista Clássica" />
              </Field>

              <Field label="Descrição curta *">
                <input value={form.descricao} onChange={e => f("descricao", e.target.value)}
                  style={inputStyle} placeholder="Ex: Em corda de algodão trançada à mão" />
              </Field>

              <Field label="Descrição detalhada">
                <textarea value={form.descricaoLonga} onChange={e => f("descricaoLonga", e.target.value)}
                  rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Detalhes do produto..." />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Preço (€) *">
                  <input type="number" min={0} step={0.01} value={form.preco}
                    onChange={e => f("preco", parseFloat(e.target.value) || 0)}
                    style={inputStyle} />
                </Field>
                <Field label="Stock *">
                  <input type="number" min={0} step={1} value={form.stock}
                    onChange={e => f("stock", parseInt(e.target.value) || 0)}
                    style={{ ...inputStyle, color: stockColor(form.stock) }} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Categoria">
                  <select value={form.categoria} onChange={e => f("categoria", e.target.value)} style={inputStyle}>
                    <option value="anilhas">Anilhas</option>
                    <option value="porta-chaves">Porta-chaves</option>
                    <option value="combos">Combos & Packs</option>
                  </select>
                </Field>
                <Field label="Etiqueta">
                  <select value={form.tag} onChange={e => f("tag", e.target.value)} style={inputStyle}>
                    <option value="">Nenhuma</option>
                    <option value="Best seller">Best Seller</option>
                    <option value="Novo">Novo</option>
                    <option value="Oferta">Oferta</option>
                  </select>
                </Field>
              </div>

              <Field label="URL da foto (ou /produtos/nome.jpg)">
                <input value={form.fotos?.[0] ?? ""} onChange={e => f("fotos", e.target.value ? [e.target.value] : [])}
                  style={inputStyle} placeholder="https://... ou /produtos/imagem.jpg" />
              </Field>

              <div style={{ display: "flex", gap: "1.25rem", paddingTop: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.8rem", color: P.earth }}>
                  <input type="checkbox" checked={form.disponivel} onChange={e => f("disponivel", e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: P.primary }} />
                  Disponível para venda
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.8rem", color: P.earth }}>
                  <input type="checkbox" checked={form.destaque} onChange={e => f("destaque", e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: P.primary }} />
                  Em destaque
                </label>
              </div>

              {/* botões */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button onClick={fechar}
                  style={{ flex: 1, padding: "0.9rem", background: P.linen, border: `1px solid ${P.sand}60`, color: P.earth, fontFamily: T.sans, fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={salvar} disabled={saving || !form.nome || !form.descricao}
                  style={{ flex: 2, padding: "0.9rem", background: saving ? P.muted : P.primary, color: "#fff", border: "none", fontFamily: T.sans, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", cursor: saving ? "wait" : "pointer" }}>
                  {saving ? "A guardar..." : "Guardar"}
                </button>
              </div>

              {/* apagar (só ao editar) */}
              {editando && (
                confirmDelete === editando.slug ? (
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button onClick={() => setConfirmDelete(null)}
                      style={{ flex: 1, padding: "0.75rem", background: P.linen, border: `1px solid ${P.sand}60`, color: P.earth, fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                      Cancelar
                    </button>
                    <button onClick={() => apagar(editando.slug)}
                      style={{ flex: 1, padding: "0.75rem", background: P.red, color: "#fff", border: "none", fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                      Confirmar apagar
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(editando.slug)}
                    style={{ padding: "0.65rem", background: "none", border: `1px solid ${P.red}40`, color: P.red, fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                    Apagar produto
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5E8DAA", marginBottom: "0.4rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 0.875rem",
  border: "1px solid #A8CBE080",
  background: "#F0F7FD",
  fontFamily: "'Jost', system-ui, sans-serif",
  fontSize: "0.9rem",
  color: "#0D253F",
  outline: "none",
  boxSizing: "border-box",
  borderRadius: 0,
  WebkitAppearance: "none",
};
