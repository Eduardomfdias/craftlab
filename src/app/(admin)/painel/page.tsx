"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const P = {
  primary: "#2E6B9E", earth: "#0D253F", muted: "#5E8DAA", sand: "#A8CBE0",
  dark: "#0A1E32", bg: "#EEF5FB", linen: "#E0EDF7", warm: "#F0F7FD",
  red: "#c0392b", green: "#27ae60",
};
const T = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Jost', system-ui, sans-serif",
};

type Produto = {
  slug: string; nome: string; descricao: string; preco: number;
  categoria: string; tag?: string; stock: number;
  destaque: boolean; disponivel: boolean; fotos: string[];
};

const CAT_CONFIG = [
  { chave: "categoria_img_anilhas",      label: "Anilhas Escutistas" },
  { chave: "categoria_img_porta-chaves", label: "Porta-chaves" },
  { chave: "categoria_img_combos",       label: "Combos & Packs" },
] as const;

const HISTORIA_CONFIG = [
  { chave: "historia_img_principal", label: "Imagem principal (maior, fundo)" },
  { chave: "historia_img_secundaria", label: "Imagem secundária (menor, frente)" },
] as const;

const LOJA_CONFIG = [
  { chave: "loja_img_capa", label: "Foto de capa da loja" },
] as const;

export default function PainelPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const [dispFilter, setDispFilter] = useState<"todos" | "disponivel" | "esgotado">("todos");
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockVal, setStockVal] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [catImgs, setCatImgs] = useState<Record<string, string>>({});
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [savingCat, setSavingCat] = useState(false);

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const carregar = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/produtos?t=${Date.now()}`);
      if (!r.ok) throw new Error("Sessão expirada");
      setProdutos(await r.json());
    } catch (e) {
      flash((e as Error).message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    fetch("/api/admin/config")
      .then(r => r.json())
      .then(setCatImgs)
      .catch(() => {});
  }, []);

  const salvarCatImgs = async () => {
    setSavingCat(true);
    try {
      const r = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catImgs),
      });
      if (!r.ok) throw new Error("Erro ao guardar");
      flash("Imagens das categorias guardadas!");
    } catch (e) {
      flash((e as Error).message, false);
    } finally {
      setSavingCat(false);
    }
  };

  const filtered = useMemo(() => produtos.filter(p => {
    if (query && !p.nome.toLowerCase().includes(query.toLowerCase())) return false;
    if (categoria !== "todos" && p.categoria !== categoria) return false;
    if (dispFilter === "disponivel" && (!p.disponivel || p.stock === 0)) return false;
    if (dispFilter === "esgotado" && p.stock > 0) return false;
    return true;
  }), [produtos, query, categoria, dispFilter]);

  const stats = useMemo(() => ({
    total: produtos.length,
    emStock: produtos.filter(p => p.stock > 0).length,
    esgotados: produtos.filter(p => p.stock === 0).length,
  }), [produtos]);

  const salvarStock = async (slug: string) => {
    const produto = produtos.find(p => p.slug === slug);
    if (!produto) return;
    const novoStock = parseInt(stockVal) || 0;
    if (stockVal.trim() === "" || isNaN(parseInt(stockVal)) || parseInt(stockVal) < 0) {
      flash("Stock inválido.", false);
      setEditingStock(null);
      return;
    }
    try {
      const r = await fetch(`/api/admin/produtos/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...produto, stock: novoStock }),
      });
      if (!r.ok) throw new Error("Erro ao guardar stock");
      setProdutos(prev => prev.map(p => p.slug === slug ? { ...p, stock: novoStock } : p));
      flash("Stock actualizado!");
    } catch (e) {
      flash((e as Error).message, false);
    } finally {
      setEditingStock(null);
    }
  };

  const apagar = async (slug: string) => {
    try {
      const r = await fetch(`/api/admin/produtos/${slug}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Erro ao apagar produto.");
      setProdutos(prev => prev.filter(p => p.slug !== slug));
      flash("Produto apagado.");
    } catch (e) {
      flash((e as Error).message, false);
    } finally {
      setConfirmDelete(null);
    }
  };

  const sair = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin-login");
  };

  const stockColor = (s: number) => s === 0 ? P.red : s <= 3 ? "#e67e22" : P.green;

  const toggleDestaque = async (slug: string) => {
    const produto = produtos.find(p => p.slug === slug);
    if (!produto) return;
    const novoDestaque = !produto.destaque;
    try {
      const r = await fetch(`/api/admin/produtos/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destaque: novoDestaque }),
      });
      if (!r.ok) throw new Error("Erro ao guardar");
      setProdutos(prev => prev.map(p => p.slug === slug ? { ...p, destaque: novoDestaque } : p));
      flash(novoDestaque ? "Produto em destaque ★" : "Destaque removido");
    } catch (e) {
      flash((e as Error).message, false);
    }
  };

  const saveCatImg = async (chave: string, url: string) => {
    const newImgs = { ...catImgs, [chave]: url };
    setCatImgs(newImgs);
    try {
      const r = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newImgs),
      });
      if (!r.ok) throw new Error("Erro ao guardar");
      flash("Imagem guardada!");
    } catch (e) {
      flash((e as Error).message, false);
    }
  };

  const uploadCatImg = async (chave: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!r.ok) throw new Error("Erro no upload");
      const { url } = await r.json();
      await saveCatImg(chave, url);
    } catch (e) {
      flash((e as Error).message, false);
    }
  };

  return (
    <div style={{ minHeight: "100svh", background: P.bg, fontFamily: T.sans }}>

      {toast && (
        <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 200, background: toast.ok ? P.green : P.red, color: "#fff", padding: "0.75rem 1.25rem", borderRadius: 6, fontFamily: T.sans, fontSize: "0.75rem", letterSpacing: "0.08em", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          {toast.msg}
        </div>
      )}

      <div style={{ background: P.dark, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src="/logo.png" alt="CraftLab.ed" style={{ height: 36, width: 36, objectFit: "contain" }} />
          <span style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.1rem", color: "#fff" }}>Painel de Gestão</span>
        </div>
        <button onClick={sair} style={{ fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: `${P.sand}80`, background: "none", border: "none", cursor: "pointer" }}>
          Sair
        </button>
      </div>

      <div style={{ background: P.earth, padding: "1rem 1.25rem", display: "flex", gap: "2rem" }}>
        {[
          { label: "Produtos", value: stats.total },
          { label: "Em stock", value: stats.emStock },
          { label: "Esgotados", value: stats.esgotados },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: T.serif, fontSize: "1.8rem", color: "#fff", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: `${P.sand}80`, marginTop: "0.2rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.25rem 1rem" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar produtos..." style={{ flex: 1, padding: "0.65rem 0.875rem", border: `1px solid ${P.sand}80`, background: "#fff", fontFamily: T.sans, fontSize: "0.82rem", color: P.earth, outline: "none", boxSizing: "border-box" as const }} />
            <button onClick={() => router.push("/painel/produto/novo")} style={{ background: P.primary, color: "#fff", border: "none", padding: "0.6rem 1.1rem", fontFamily: T.sans, fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>
              + Novo
            </button>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ flex: 1, padding: "0.65rem 0.875rem", border: `1px solid ${P.sand}80`, background: "#fff", fontFamily: T.sans, fontSize: "0.82rem", color: P.earth, outline: "none" }}>
              <option value="todos">Todas as categorias</option>
              <option value="anilhas">Anilhas</option>
              <option value="porta-chaves">Porta-chaves</option>
              <option value="combos">Combos & Packs</option>
            </select>
            <select value={dispFilter} onChange={e => setDispFilter(e.target.value as "todos" | "disponivel" | "esgotado")} style={{ flex: 1, padding: "0.65rem 0.875rem", border: `1px solid ${P.sand}80`, background: "#fff", fontFamily: T.sans, fontSize: "0.82rem", color: P.earth, outline: "none" }}>
              <option value="todos">Todos</option>
              <option value="disponivel">Disponíveis</option>
              <option value="esgotado">Esgotados</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: P.muted, padding: "3rem 0", fontSize: "0.75rem" }}>A carregar...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: P.muted, padding: "3rem 0", fontSize: "0.75rem" }}>
            {produtos.length === 0 ? "Nenhum produto ainda." : "Nenhum produto corresponde ao filtro."}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {filtered.map(p => (
              <div key={p.slug} style={{ background: "#fff", border: `1px solid ${P.sand}50`, padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 52, height: 52, background: P.linen, flexShrink: 0, overflow: "hidden" }}>
                  {p.fotos?.[0] && <img src={p.fotos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: "0.88rem", color: P.earth, marginBottom: "0.15rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nome}</p>
                  <p style={{ fontSize: "0.7rem", color: P.muted }}>{p.preco.toFixed(2).replace(".", ",")} € · {p.categoria}</p>
                </div>
                {editingStock === p.slug ? (
                  <input
                    type="number" min={0} value={stockVal}
                    onChange={e => setStockVal(e.target.value)}
                    onBlur={() => salvarStock(p.slug)}
                    onKeyDown={e => { if (e.key === "Enter") salvarStock(p.slug); if (e.key === "Escape") setEditingStock(null); }}
                    autoFocus
                    style={{ width: 60, padding: "0.3rem 0.4rem", border: `1px solid ${P.primary}`, background: P.warm, fontFamily: T.sans, fontSize: "0.78rem", color: P.earth, textAlign: "center", outline: "none" }}
                  />
                ) : (
                  <button onClick={() => { setEditingStock(p.slug); setStockVal(String(p.stock)); }} style={{ flexShrink: 0, background: stockColor(p.stock) + "18", border: `1px solid ${stockColor(p.stock)}50`, color: stockColor(p.stock), borderRadius: 4, padding: "0.28rem 0.55rem", fontFamily: T.sans, fontSize: "0.65rem", fontWeight: 600, cursor: "pointer", minWidth: 52, textAlign: "center" }}>
                    {p.stock === 0 ? "Esgotado" : `${p.stock}`}
                  </button>
                )}
                <button
                  onClick={() => toggleDestaque(p.slug)}
                  title={p.destaque ? "Remover destaque" : "Colocar em destaque"}
                  style={{ flexShrink: 0, background: p.destaque ? "#f5a623" + "22" : "none", border: `1px solid ${p.destaque ? "#f5a623" : P.sand + "60"}`, color: p.destaque ? "#f5a623" : P.muted, padding: "0.4rem 0.55rem", fontFamily: T.sans, fontSize: "0.75rem", cursor: "pointer", lineHeight: 1 }}
                >
                  ★
                </button>
                <button onClick={() => router.push(`/painel/produto/${p.slug}`)} style={{ flexShrink: 0, background: P.linen, border: `1px solid ${P.sand}60`, color: P.earth, padding: "0.4rem 0.75rem", fontFamily: T.sans, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                  Editar
                </button>
                {confirmDelete === p.slug ? (
                  <button onClick={() => apagar(p.slug)} style={{ flexShrink: 0, background: P.red, border: "none", color: "#fff", padding: "0.4rem 0.6rem", fontFamily: T.sans, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                    Confirmar
                  </button>
                ) : (
                  <button onClick={() => setConfirmDelete(p.slug)} style={{ flexShrink: 0, background: "none", border: `1px solid ${P.red}40`, color: P.red, padding: "0.4rem 0.6rem", fontFamily: T.sans, fontSize: "0.58rem", cursor: "pointer" }}>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ IMAGENS DAS CATEGORIAS ════════════════════════ */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 1rem 3rem" }}>
        <div style={{ borderTop: `1px solid ${P.sand}50`, paddingTop: "1.5rem", marginTop: "0.5rem" }}>
          <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.1rem", color: P.earth, marginBottom: "0.35rem" }}>Explorar Loja</p>
          <p style={{ fontFamily: T.sans, fontSize: "0.68rem", color: P.muted, marginBottom: "1.25rem", letterSpacing: "0.04em" }}>
            Escolhe a imagem de fundo de cada categoria na página inicial.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {CAT_CONFIG.map(({ chave, label }) => {
              const imgAtual = catImgs[chave];
              const todasFotos = produtos.flatMap(p => p.fotos).filter(Boolean);
              const fotosUnicas = [...new Set(todasFotos)];
              return (
                <div key={chave} style={{ background: "#fff", border: `1px solid ${P.sand}50`, padding: "0.875rem 1rem" }}>
                  <p style={{ fontFamily: T.sans, fontSize: "0.72rem", fontWeight: 500, color: P.earth, marginBottom: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{ width: 72, height: 72, background: P.linen, flexShrink: 0, overflow: "hidden", border: `1px solid ${P.sand}40` }}>
                      {imgAtual
                        ? <img src={imgAtual} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🖼️</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {imgAtual && <p style={{ fontFamily: T.sans, fontSize: "0.6rem", color: P.muted, marginBottom: "0.4rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{imgAtual}</p>}
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <button
                        onClick={() => setPickerFor(pickerFor === chave ? null : chave)}
                        style={{ background: P.linen, border: `1px solid ${P.sand}60`, color: P.earth, padding: "0.4rem 0.875rem", fontFamily: T.sans, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
                      >
                        {pickerFor === chave ? "Fechar" : imgAtual ? "Das fotos" : "Escolher"}
                      </button>
                      <label style={{ background: P.primary, color: "#fff", border: "none", padding: "0.4rem 0.875rem", fontFamily: T.sans, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", display: "inline-block" }}>
                        Carregar foto
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadCatImg(chave, f); e.target.value = ""; }} />
                      </label>
                      </div>
                    </div>
                  </div>

                  {pickerFor === chave && (
                    <div style={{ marginTop: "0.875rem", borderTop: `1px solid ${P.sand}30`, paddingTop: "0.875rem" }}>
                      {fotosUnicas.length === 0
                        ? <p style={{ fontFamily: T.sans, fontSize: "0.7rem", color: P.muted }}>Sem fotos de produtos disponíveis.</p>
                        : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: "0.5rem", maxHeight: 240, overflowY: "auto" }}>
                            {fotosUnicas.map(foto => (
                              <div
                                key={foto}
                                onClick={() => { saveCatImg(chave, foto); setPickerFor(null); }}
                                style={{ aspectRatio: "1", overflow: "hidden", cursor: "pointer", border: catImgs[chave] === foto ? `2px solid ${P.primary}` : `2px solid transparent`, boxSizing: "border-box" as const }}
                              >
                                <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily: T.sans, fontSize: "0.65rem", color: P.muted, fontStyle: "italic" }}>
            As imagens são guardadas automaticamente ao selecionar.
          </p>
        </div>

        {/* ═══ IMAGENS DA SECÇÃO "FEITO À MÃO" ══════════════ */}
        <div style={{ borderTop: `1px solid ${P.sand}50`, paddingTop: "1.5rem", marginTop: "1.5rem" }}>
          <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.1rem", color: P.earth, marginBottom: "0.35rem" }}>Feito à mão, para ti!</p>
          <p style={{ fontFamily: T.sans, fontSize: "0.68rem", color: P.muted, marginBottom: "1.25rem", letterSpacing: "0.04em" }}>
            Escolhe as imagens da secção "A Nossa História" na página inicial.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {HISTORIA_CONFIG.map(({ chave, label }) => {
              const imgAtual = catImgs[chave];
              const todasFotos = produtos.flatMap(p => p.fotos).filter(Boolean);
              const fotosUnicas = [...new Set(todasFotos)];
              return (
                <div key={chave} style={{ background: "#fff", border: `1px solid ${P.sand}50`, padding: "0.875rem 1rem" }}>
                  <p style={{ fontFamily: T.sans, fontSize: "0.72rem", fontWeight: 500, color: P.earth, marginBottom: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{ width: 72, height: 72, background: P.linen, flexShrink: 0, overflow: "hidden", border: `1px solid ${P.sand}40` }}>
                      {imgAtual
                        ? <img src={imgAtual} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🖼️</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {imgAtual && <p style={{ fontFamily: T.sans, fontSize: "0.6rem", color: P.muted, marginBottom: "0.4rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{imgAtual}</p>}
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <button
                          onClick={() => setPickerFor(pickerFor === chave ? null : chave)}
                          style={{ background: P.linen, border: `1px solid ${P.sand}60`, color: P.earth, padding: "0.4rem 0.875rem", fontFamily: T.sans, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
                        >
                          {pickerFor === chave ? "Fechar" : imgAtual ? "Das fotos" : "Escolher"}
                        </button>
                        <label style={{ background: P.primary, color: "#fff", border: "none", padding: "0.4rem 0.875rem", fontFamily: T.sans, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", display: "inline-block" }}>
                          Carregar foto
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadCatImg(chave, f); e.target.value = ""; }} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {pickerFor === chave && (
                    <div style={{ marginTop: "0.875rem", borderTop: `1px solid ${P.sand}30`, paddingTop: "0.875rem" }}>
                      {fotosUnicas.length === 0
                        ? <p style={{ fontFamily: T.sans, fontSize: "0.7rem", color: P.muted }}>Sem fotos de produtos disponíveis.</p>
                        : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: "0.5rem", maxHeight: 240, overflowY: "auto" }}>
                            {fotosUnicas.map(foto => (
                              <div
                                key={foto}
                                onClick={() => { saveCatImg(chave, foto); setPickerFor(null); }}
                                style={{ aspectRatio: "1", overflow: "hidden", cursor: "pointer", border: catImgs[chave] === foto ? `2px solid ${P.primary}` : `2px solid transparent`, boxSizing: "border-box" as const }}
                              >
                                <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily: T.sans, fontSize: "0.65rem", color: P.muted, fontStyle: "italic" }}>
            As imagens são guardadas automaticamente ao selecionar.
          </p>
        </div>

        {/* ═══ IMAGEM DA CAPA DA LOJA ════════════════════════ */}
        <div style={{ borderTop: `1px solid ${P.sand}50`, paddingTop: "1.5rem", marginTop: "1.5rem" }}>
          <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.1rem", color: P.earth, marginBottom: "0.35rem" }}>Capa da Loja</p>
          <p style={{ fontFamily: T.sans, fontSize: "0.68rem", color: P.muted, marginBottom: "1.25rem", letterSpacing: "0.04em" }}>
            Escolhe a foto de capa da página da loja.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {LOJA_CONFIG.map(({ chave, label }) => {
              const imgAtual = catImgs[chave];
              const todasFotos = produtos.flatMap(p => p.fotos).filter(Boolean);
              const fotosUnicas = [...new Set(todasFotos)];
              return (
                <div key={chave} style={{ background: "#fff", border: `1px solid ${P.sand}50`, padding: "0.875rem 1rem" }}>
                  <p style={{ fontFamily: T.sans, fontSize: "0.72rem", fontWeight: 500, color: P.earth, marginBottom: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{ width: 72, height: 72, background: P.linen, flexShrink: 0, overflow: "hidden", border: `1px solid ${P.sand}40` }}>
                      {imgAtual
                        ? <img src={imgAtual} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🖼️</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {imgAtual && <p style={{ fontFamily: T.sans, fontSize: "0.6rem", color: P.muted, marginBottom: "0.4rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{imgAtual}</p>}
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <button
                          onClick={() => setPickerFor(pickerFor === chave ? null : chave)}
                          style={{ background: P.linen, border: `1px solid ${P.sand}60`, color: P.earth, padding: "0.4rem 0.875rem", fontFamily: T.sans, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
                        >
                          {pickerFor === chave ? "Fechar" : imgAtual ? "Das fotos" : "Escolher"}
                        </button>
                        <label style={{ background: P.primary, color: "#fff", border: "none", padding: "0.4rem 0.875rem", fontFamily: T.sans, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", display: "inline-block" }}>
                          Carregar foto
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadCatImg(chave, f); e.target.value = ""; }} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {pickerFor === chave && (
                    <div style={{ marginTop: "0.875rem", borderTop: `1px solid ${P.sand}30`, paddingTop: "0.875rem" }}>
                      {fotosUnicas.length === 0
                        ? <p style={{ fontFamily: T.sans, fontSize: "0.7rem", color: P.muted }}>Sem fotos de produtos disponíveis.</p>
                        : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: "0.5rem", maxHeight: 240, overflowY: "auto" }}>
                            {fotosUnicas.map(foto => (
                              <div
                                key={foto}
                                onClick={() => { saveCatImg(chave, foto); setPickerFor(null); }}
                                style={{ aspectRatio: "1", overflow: "hidden", cursor: "pointer", border: catImgs[chave] === foto ? `2px solid ${P.primary}` : `2px solid transparent`, boxSizing: "border-box" as const }}
                              >
                                <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily: T.sans, fontSize: "0.65rem", color: P.muted, fontStyle: "italic" }}>
            A imagem é guardada automaticamente ao selecionar.
          </p>
        </div>
      </div>
    </div>
  );
}
