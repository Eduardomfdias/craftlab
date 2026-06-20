"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

const P = {
  primary:   "#2E6B9E",
  earth:     "#0D253F",
  bg:        "#EEF5FB",
  linen:     "#E0EDF7",
  muted:     "#5E8DAA",
  rope:      "#7FADC8",
  dark:      "#0A1E32",
  warmWhite: "#F0F7FD",
  sand:      "#A8CBE0",
};
const T = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'Jost', system-ui, sans-serif",
};

export function CartDrawer() {
  const { items, total, count, open, setOpen, removeItem, inc, dec } = useCart();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(10,30,50,0.45)", zIndex: 98, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Drawer */}
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 99,
        width: "min(420px, 100vw)",
        background: P.warmWhite,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", flexDirection: "column",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 1.75rem", borderBottom: `1px solid ${P.sand}60` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ShoppingBag size={18} color={P.earth} />
            <span style={{ fontFamily: T.sans, fontWeight: 500, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.earth }}>
              Carrinho {count > 0 && `(${count})`}
            </span>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: P.muted, padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.75rem" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "4rem" }}>
              <ShoppingBag size={48} color={`${P.sand}`} style={{ margin: "0 auto 1.5rem" }} />
              <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.4rem", color: P.earth, marginBottom: "0.5rem" }}>O carrinho está vazio.</p>
              <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.82rem", color: P.muted, marginBottom: "2rem" }}>Ainda não adicionaste nenhum produto.</p>
              <button
                onClick={() => setOpen(false)}
                style={{ fontFamily: T.sans, fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.primary, background: "none", border: `1px solid ${P.primary}`, padding: "0.75rem 1.5rem", cursor: "pointer" }}
              >
                Ver Loja
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <img src={item.foto} alt={item.nome} style={{ width: 72, height: 90, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: "0.85rem", color: P.earth, marginBottom: "0.2rem" }}>{item.nome}</p>
                    <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: "0.9rem", color: P.primary, marginBottom: "0.75rem" }}>
                      {(item.preco * item.qty).toFixed(2).replace(".", ",")} €
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button onClick={() => dec(item.id)} style={{ width: 28, height: 28, border: `1px solid ${P.sand}`, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: P.muted }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontFamily: T.sans, fontSize: "0.82rem", color: P.earth, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => inc(item.id)} style={{ width: 28, height: 28, border: `1px solid ${P.sand}`, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: P.muted }}>
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(item.id)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: P.muted, padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "1.5rem 1.75rem", borderTop: `1px solid ${P.sand}60` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: T.sans, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted }}>Total</span>
              <span style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.75rem", color: P.earth }}>
                {total.toFixed(2).replace(".", ",")} €
              </span>
            </div>
            <Link
              href="/encomenda"
              onClick={() => setOpen(false)}
              style={{ display: "block", width: "100%", textAlign: "center", background: P.primary, color: "#fff", padding: "1rem", fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", boxSizing: "border-box" }}
            >
              Finalizar Encomenda
            </Link>
            <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <p style={{ fontFamily: T.sans, fontSize: "0.62rem", color: P.muted, fontWeight: 300, marginBottom: "0.3rem" }}>
                Envio calculado na finalização.
              </p>
              <p style={{ fontFamily: T.sans, fontSize: "0.62rem", color: P.primary, fontWeight: 500, lineHeight: 1.4 }}>
                O pagamento só é feito quando a tua encomenda estiver pronta a ser enviada!
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
