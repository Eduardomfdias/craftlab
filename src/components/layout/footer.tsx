"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

const P = {
  primary:   "#2E6B9E",
  dark:      "#0A1E32",
  earth:     "#0D253F",
  warmWhite: "#F0F7FD",
  sand:      "#A8CBE0",
  muted:     "#5E8DAA",
  rope:      "#7FADC8",
};
const T = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'Jost', system-ui, sans-serif",
};

export function Footer() {
  return (
    <footer style={{ background: P.dark, color: P.sand, paddingTop: "5rem", paddingBottom: "2.5rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "3rem", paddingBottom: "4rem", borderBottom: `1px solid ${P.muted}25` }}>

          {/* Brand */}
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <img
                src="/logo.png"
                alt="CraftLab.ed"
                style={{ height: 72, width: 72, objectFit: "contain", mixBlendMode: "screen" }}
              />
            </div>
            <p style={{ fontFamily: T.sans, fontSize: "0.5rem", letterSpacing: "0.35em", textTransform: "uppercase", color: `${P.sand}40`, marginBottom: "0.5rem" }}>
              Arte em Corda · Portugal
            </p>
            <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1rem", color: `${P.sand}55`, marginBottom: "1.5rem" }}>
              Cada Nó tem uma história.
            </p>
            <p style={{ fontFamily: T.sans, fontWeight: 300, fontSize: "0.88rem", color: `${P.sand}65`, maxWidth: 260, lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Feito à mão, com propósito.<br />
              Feito à mão, feito para ti!
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={13} style={{ color: P.rope }} />
                <span style={{ fontFamily: T.sans, fontSize: "0.75rem", color: `${P.sand}50` }}>Portugal, com envio nacional</span>
              </div>
              <a href="mailto:craftlab.ed@gmail.com" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                <Mail size={13} style={{ color: P.rope }} />
                <span style={{ fontFamily: T.sans, fontSize: "0.75rem", color: `${P.sand}50` }}>craftlab.ed@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Loja */}
          <div>
            <p style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: P.rope, marginBottom: "1.25rem" }}>Loja</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[{l: "Todos os Produtos", h: "/loja"}, {l: "Anilhas Escutistas", h: "/loja?cat=anilhas"}, {l: "Porta-chaves", h: "/loja?cat=porta-chaves"}].map(({l, h}) => (
                <li key={l}><Link href={h} style={{ fontFamily: T.sans, fontSize: "0.82rem", fontWeight: 300, color: `${P.sand}50`, textDecoration: "none" }}>{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: P.rope, marginBottom: "1.25rem" }}>Informação</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[{l:"A Nossa História",h:"/sobre"},{l:"Contacto",h:"/contacto"}].map(({l,h}) => (
                <li key={l}><Link href={h} style={{ fontFamily: T.sans, fontSize: "0.82rem", fontWeight: 300, color: `${P.sand}50`, textDecoration: "none" }}>{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Redes */}
          <div>
            <p style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: P.rope, marginBottom: "1.25rem" }}>Redes</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li>
                <a href="https://www.instagram.com/craftlab.ed" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: T.sans, fontSize: "0.82rem", fontWeight: 300, color: `${P.sand}50`, textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/profile.php?id=61588184506129" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: T.sans, fontSize: "0.82rem", fontWeight: 300, color: `${P.sand}50`, textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Facebook
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div style={{ paddingTop: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <p style={{ fontFamily: T.sans, fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: `${P.sand}25` }}>
            &copy; {new Date().getFullYear()} CraftLab.ed — Todos os direitos reservados
          </p>
          <p style={{ fontFamily: T.sans, fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: `${P.sand}25` }}>
            Feito com ♥ em Portugal
          </p>
        </div>
      </div>
    </footer>
  );
}
