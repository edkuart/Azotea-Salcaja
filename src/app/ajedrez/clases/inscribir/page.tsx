"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";

// ── Design tokens reutilizados del sistema ─────────────────────────────────

const INPUT = {
  fontFamily: "var(--font-body)",
  fontSize: "15px",
  padding: "12px 14px",
  border: "2px solid var(--color-ink)",
  background: "var(--color-grain)",
  width: "100%",
  outline: "none",
  color: "var(--color-ink)",
  display: "block",
  boxSizing: "border-box" as const,
};

const LABEL = {
  fontFamily: "var(--font-poster)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.16em",
  fontSize: "10px",
  color: "var(--color-ink)",
  opacity: 0.8,
  display: "block",
  marginBottom: "5px",
};

const SECTION_HEADING = {
  fontFamily: "var(--font-poster)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.22em",
  fontSize: "11px",
  color: "var(--color-ink)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  margin: "28px 0 14px",
};

const EXPERIENCE_OPTIONS = [
  { value: "none",         label: "Ninguna",     desc: "Nunca ha jugado ajedrez" },
  { value: "basic",        label: "Básica",      desc: "Conoce algunas piezas" },
  { value: "intermediate", label: "Intermedia",  desc: "Juega partidas completas" },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function InscribirPage() {
  const router = useRouter();
  const [experience, setExperience] = useState("none");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      childName:  (fd.get("childName")  as string).trim(),
      childAge:   Number(fd.get("childAge")),
      parentName: (fd.get("parentName") as string).trim(),
      phone:      (fd.get("phone")      as string).trim(),
      email:      ((fd.get("email")     as string | null) ?? "").trim() || null,
      experience,
      message:    ((fd.get("message")   as string | null) ?? "").trim() || null,
    };

    try {
      const res = await fetch("/api/enrollments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Ocurrió un error. Intenta de nuevo.");
        setStatus("error");
        return;
      }

      router.push("/ajedrez/clases/gracias");
    } catch {
      setErrorMsg("No se pudo conectar. Verifica tu conexión e intenta de nuevo.");
      setStatus("error");
    }
  }

  const loading = status === "loading";

  return (
    <PublicLayout>
      <main>
        <div
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            padding: "20px 0 18px",
            borderBottom: "4px solid var(--color-stage)",
          }}
        >
          <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
            <Link
              href="/ajedrez/clases"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: "10px",
                color: "var(--color-marquee)",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              ← Clases
            </Link>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
              }}
            >
              Inscripción{" "}
              <em
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  color: "var(--color-stage)",
                }}
              >
                Chessitos
              </em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "rgba(255,253,208,0.65)",
                marginTop: "8px",
              }}
            >
              Completa el formulario y nos pondremos en contacto para confirmar el cupo.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
          <form onSubmit={handleSubmit} noValidate>

            {/* ── Sobre el niño/a ── */}
            <p style={SECTION_HEADING}>
              <span style={{ width: 18, height: 2, background: "var(--color-stage)", display: "block", flexShrink: 0 }} />
              Sobre el niño/a
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <label style={LABEL} htmlFor="childName">Nombre completo *</label>
                <input
                  id="childName"
                  name="childName"
                  type="text"
                  required
                  placeholder="Nombre del niño o niña"
                  style={INPUT}
                  disabled={loading}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.background = "var(--color-cream)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--color-ink)";   e.currentTarget.style.background = "var(--color-grain)"; }}
                />
              </div>

              <div>
                <label style={LABEL} htmlFor="childAge">Edad *</label>
                <input
                  id="childAge"
                  name="childAge"
                  type="number"
                  required
                  min={5}
                  max={16}
                  placeholder="8"
                  style={{ ...INPUT, width: "120px" }}
                  disabled={loading}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.background = "var(--color-cream)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--color-ink)";   e.currentTarget.style.background = "var(--color-grain)"; }}
                />
              </div>

              {/* Experiencia */}
              <div>
                <p style={{ ...LABEL, marginBottom: "10px" }}>Experiencia en ajedrez</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {EXPERIENCE_OPTIONS.map((opt) => {
                    const selected = experience === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setExperience(opt.value)}
                        disabled={loading}
                        style={{
                          border: "2px solid var(--color-ink)",
                          background: selected ? "var(--color-ink)" : "var(--color-grain)",
                          color: selected ? "var(--color-cream)" : "var(--color-ink)",
                          borderLeft: selected ? "4px solid var(--color-stage)" : "2px solid var(--color-ink)",
                          padding: "10px 10px 12px",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "10px", color: selected ? "var(--color-marquee)" : "inherit", marginBottom: "3px" }}>
                          {opt.label}
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", lineHeight: 1.3, color: selected ? "rgba(255,253,208,0.75)" : "#666" }}>
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Datos del tutor ── */}
            <p style={SECTION_HEADING}>
              <span style={{ width: 18, height: 2, background: "var(--color-stage)", display: "block", flexShrink: 0 }} />
              Datos del padre / madre / tutor
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <label style={LABEL} htmlFor="parentName">Nombre *</label>
                <input
                  id="parentName"
                  name="parentName"
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  style={INPUT}
                  disabled={loading}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.background = "var(--color-cream)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--color-ink)";   e.currentTarget.style.background = "var(--color-grain)"; }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={LABEL} htmlFor="phone">Teléfono / WhatsApp *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="5555-0000"
                    style={INPUT}
                    disabled={loading}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.background = "var(--color-cream)"; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--color-ink)";   e.currentTarget.style.background = "var(--color-grain)"; }}
                  />
                </div>
                <div>
                  <label style={LABEL} htmlFor="email">Correo electrónico</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="opcional"
                    style={INPUT}
                    disabled={loading}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.background = "var(--color-cream)"; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--color-ink)";   e.currentTarget.style.background = "var(--color-grain)"; }}
                  />
                </div>
              </div>

              <div>
                <label style={LABEL} htmlFor="message">Mensaje o pregunta</label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="¿Alguna pregunta sobre el programa?"
                  style={{ ...INPUT, resize: "vertical", minHeight: "80px" }}
                  disabled={loading}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.background = "var(--color-cream)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--color-ink)";   e.currentTarget.style.background = "var(--color-grain)"; }}
                />
              </div>
            </div>

            {/* Error */}
            {status === "error" && (
              <div
                style={{
                  marginTop: "16px",
                  background: "rgba(204,45,48,0.08)",
                  border: "2px solid var(--color-stage)",
                  padding: "12px 16px",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--color-stage)",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "rgba(26,26,26,0.5)" : "var(--color-ink)",
                color: "var(--color-cream)",
                border: "2px solid var(--color-ink)",
                padding: "16px",
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                letterSpacing: "0.01em",
                marginTop: "24px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "var(--shadow-card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.2s",
              }}
            >
              {loading && <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} aria-hidden />}
              {loading ? "Enviando..." : (
                <>
                  Enviar inscripción{" "}
                  <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-marquee)" }}>
                    Chessitos
                  </em>
                </>
              )}
            </button>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "#888",
                textAlign: "center",
                marginTop: "12px",
                lineHeight: 1.5,
              }}
            >
              Los datos se guardan de forma segura y solo se usan para contactarte sobre el programa.
            </p>
          </form>
        </div>
      </main>
    </PublicLayout>
  );
}
