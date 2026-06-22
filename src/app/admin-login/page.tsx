"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const P = {
  primary: "#2E6B9E",
  earth:   "#0D253F",
  bg:      "#EEF5FB",
  muted:   "#5E8DAA",
  sand:    "#A8CBE0",
  dark:    "#0A1E32",
};
const T = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'Jost', system-ui, sans-serif",
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/painel";

  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(next);
      } else {
        setErro("Password incorreta. Tenta novamente.");
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100svh", background: P.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <img src="/logo.png" alt="CraftLab.ed" style={{ height: 80, width: 80, objectFit: "contain", margin: "0 auto 1rem" }} />
          <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: "1.5rem", color: "rgba(240,247,253,0.9)" }}>
            Painel de Gestão
          </p>
          <p style={{ fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${P.sand}50`, marginTop: "0.25rem" }}>
            CraftLab.ed
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontFamily: T.sans, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: `${P.sand}60`, marginBottom: "0.5rem" }}>
              Password
            </label>
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: "100%", padding: "0.875rem 1rem",
                background: "rgba(240,247,253,0.07)",
                border: erro ? "1px solid #e74c3c" : "1px solid rgba(168,203,224,0.2)",
                color: "rgba(240,247,253,0.9)",
                outline: "none", fontFamily: T.sans, fontSize: "1rem",
                boxSizing: "border-box", WebkitAppearance: "none",
                borderRadius: 0,
              }}
            />
            {erro && (
              <p style={{ fontFamily: T.sans, fontSize: "0.7rem", color: "#e74c3c", marginTop: "0.5rem" }}>
                {erro}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: "0.9rem", background: loading ? P.muted : P.primary,
              color: "#fff", border: "none", cursor: loading ? "wait" : "pointer",
              fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase",
              transition: "background 0.2s",
            }}
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>


      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
