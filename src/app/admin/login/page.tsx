"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import type { LoginState } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ background: "var(--color-ink)" }}
    >
      {/* Ghost watermark */}
      <span
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "-4%",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(10rem, 22vw, 20rem)",
          lineHeight: 0.8,
          color: "var(--color-cream)",
          opacity: 0.03,
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        ADMIN
      </span>

      <section
        className="relative w-full max-w-md"
        style={{
          background: "var(--color-cream)",
          border: "3px solid var(--color-ink)",
          boxShadow: "8px 8px 0 var(--color-stage)",
          padding: "36px 32px 32px",
        }}
      >
        {/* Vinyl disc decoration */}
        <div
          aria-hidden="true"
          className="vinyl-disc-sm"
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "48px",
            height: "48px",
            opacity: 0.9,
          }}
        />

        {/* Header */}
        <p
          style={{
            fontFamily: "var(--font-poster)",
            fontSize: "var(--text-xs)",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "var(--color-stage)",
          }}
        >
          Panel de administración
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            lineHeight: 1,
            color: "var(--color-ink)",
            margin: "10px 0 24px",
          }}
        >
          Iniciar sesión
        </h1>

        {/* Error message */}
        {state?.error && (
          <div
            role="alert"
            style={{
              background: "var(--color-stage)",
              color: "var(--color-cream)",
              padding: "10px 14px",
              marginBottom: "20px",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              border: "2px solid var(--color-ink)",
            }}
          >
            {state.error}
          </div>
        )}

        <form action={action} className="grid gap-5">
          {/* Email */}
          <div className="grid gap-1.5">
            <label
              htmlFor="email"
              style={{
                fontFamily: "var(--font-poster)",
                fontSize: "var(--text-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--color-ink)",
              }}
            >
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@azotea.com"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                padding: "10px 14px",
                border: "2px solid var(--color-ink)",
                background: "white",
                color: "var(--color-ink)",
                outline: "none",
                width: "100%",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-stage)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-ink)")
              }
            />
          </div>

          {/* Password */}
          <div className="grid gap-1.5">
            <label
              htmlFor="password"
              style={{
                fontFamily: "var(--font-poster)",
                fontSize: "var(--text-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--color-ink)",
              }}
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                padding: "10px 14px",
                border: "2px solid var(--color-ink)",
                background: "white",
                color: "var(--color-ink)",
                outline: "none",
                width: "100%",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-stage)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-ink)")
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            style={{
              marginTop: "4px",
              fontFamily: "var(--font-poster)",
              fontSize: "var(--text-sm)",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              background: pending ? "var(--color-mist)" : "var(--color-ink)",
              color: "var(--color-cream)",
              border: "2px solid var(--color-ink)",
              padding: "13px 24px",
              cursor: pending ? "not-allowed" : "pointer",
              boxShadow: pending ? "none" : "4px 4px 0 var(--color-stage)",
              transition: "box-shadow 0.15s, transform 0.15s",
              width: "100%",
            }}
          >
            {pending ? "Verificando…" : "Entrar"}
          </button>
        </form>

        {/* Footer note */}
        <p
          style={{
            marginTop: "20px",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            color: "var(--color-ink)",
            opacity: 0.5,
          }}
        >
          Acceso restringido al equipo de Azotea Salcajá.
        </p>
      </section>
    </main>
  );
}
