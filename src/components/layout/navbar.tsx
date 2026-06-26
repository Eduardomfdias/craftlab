"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const P = {
  primary:   "#2E6B9E",
  primaryH:  "#1E5480",
  earth:     "#0D253F",
  dark:      "#0A1E32",
  bg:        "#EEF5FB",
  warmWhite: "#F0F7FD",
  sand:      "#A8CBE0",
  muted:     "#5E8DAA",
  rope:      "#7FADC8",
};
const T = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'Jost', system-ui, sans-serif",
};

const links = [
  { href: "/loja",     label: "Loja" },
  { href: "/sobre",    label: "O Processo" },
  { href: "/contacto", label: "Contacto" },
];

const HERO_PAGES = ["/", "/loja", "/sobre", "/contacto"];

export function Navbar() {
  const pathname = usePathname();
  const hasHero = HERO_PAGES.includes(pathname);
  const [scrolled, setScrolled] = useState(!hasHero);
  const [open, setOpen] = useState(false);
  const { count, setOpen: openCart } = useCart();

  useEffect(() => {
    if (!hasHero) return;
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [hasHero]);

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 96,
        background: scrolled ? "rgba(238,245,251,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${P.sand}60` : "none",
        transition: "all 0.4s ease",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: 1280, width: "100%", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>

          {/* Left Side: Nav and Menu Button */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <nav style={{ display: "flex", gap: "2.5rem" }} className="nav-desktop">
              {links.map((l) => (
                <Link key={l.href} href={l.href} style={{ fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: scrolled ? P.earth : "rgba(240,247,253,0.85)", textDecoration: "none", transition: "color 0.2s" }}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <button className="menu-mobile" onClick={() => setOpen(v => !v)} style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: scrolled ? P.earth : P.warmWhite, transition: "color 0.3s" }} aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Logo — imagem com blend mode */}
          <Link href="/" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/logo.png"
              alt="CraftLab.ed"
              style={{
                height: 96,
                width: 96,
                objectFit: "contain",
                filter: scrolled ? "brightness(0)" : "none",
                transition: "filter 0.35s ease",
              }}
            />
          </Link>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => openCart(true)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: scrolled ? P.earth : P.warmWhite, transition: "color 0.3s", padding: 0 }} aria-label="Carrinho">
              <ShoppingBag size={19} />
              {count > 0 && (
                <span style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, background: P.primary, color: "#fff", borderRadius: "50%", fontSize: "0.55rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, fontWeight: 600 }}>{count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 40,
        background: P.dark,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
            style={{ fontFamily: T.serif, fontSize: "3rem", fontStyle: "italic", color: P.warmWhite, textDecoration: "none" }}>
            {l.label}
          </Link>
        ))}
        <p style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: `${P.sand}40`, position: "absolute", bottom: "2.5rem" }}>
          Cada Nó tem uma história.
        </p>
      </div>
    </>
  );
}
