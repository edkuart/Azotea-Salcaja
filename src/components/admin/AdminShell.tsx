"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/actions/auth";
import { BrandMark } from "@/components/public/BrandMark";

const primaryNav = [
  { href: "/admin",               label: "Resumen",          icon: "▦",  isChess: false },
  { href: "/admin/productos",     label: "Productos",        icon: "◉",  isChess: false },
  { href: "/admin/categorias",    label: "Categorías",       icon: "⊞",  isChess: false },
  { href: "/admin/eventos",       label: "Eventos",          icon: "★",  isChess: false },
  { href: "/admin/ajedrez/torneos",       label: "Ajedrez · torneos",       icon: "♛", isChess: true },
  { href: "/admin/ajedrez/inscripciones", label: "Ajedrez · inscripciones", icon: "♟", isChess: true },
];

const secondaryNav = [
  { href: "/admin/restaurante",   label: "Restaurante",      icon: "⚙",  isChess: false },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-cream)" }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between"
        style={{
          background: "var(--color-ink)",
          color: "var(--color-cream)",
          padding: "14px 18px 16px",
          borderBottom: "2px solid var(--color-ink)",
        }}
      >
        <Link
          href="/admin"
          className="flex items-center gap-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            lineHeight: 1,
            color: "var(--color-cream)",
            textDecoration: "none",
          }}
        >
          <BrandMark size={26} aria-hidden />
          Chess
          <em
            style={{
              fontFamily: "var(--font-chess)",
              fontStyle: "italic",
              color: "var(--color-stage)",
              fontSize: 19,
            }}
          >
            itos
          </em>
        </Link>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 40,
            height: 40,
            border: `2px solid ${open ? "var(--color-stage)" : "var(--color-cream)"}`,
            background: open ? "var(--color-stage)" : "transparent",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
        >
          {open ? (
            <span
              style={{
                display: "block",
                width: 16,
                height: 2,
                background: "var(--color-cream)",
                transform: "rotate(45deg)",
                boxShadow: "0 0 0 0",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  display: "block",
                  width: 16,
                  height: 2,
                  background: "var(--color-cream)",
                  transform: "rotate(90deg)",
                }}
              />
            </span>
          ) : (
            <span
              style={{
                display: "block",
                width: 18,
                height: 2,
                background: "var(--color-cream)",
                boxShadow: "0 -6px 0 var(--color-cream), 0 6px 0 var(--color-cream)",
              }}
            />
          )}
        </button>
      </header>

      {/* ── Drawer + scrim ───────────────────────────────────── */}
      {open && (
        <>
          {/* scrim */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(26,26,26,0.55)" }}
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* drawer */}
          <aside
            className="fixed top-0 left-0 z-50 h-full overflow-hidden"
            style={{
              width: "min(86%, 320px)",
              background: "var(--color-ink)",
              color: "var(--color-cream)",
              borderRight: "3px solid var(--color-stage)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* emblema (marca de agua) */}
            <BrandMark
              size={230}
              aria-hidden
              style={{
                position: "absolute",
                top: -86,
                right: -86,
                opacity: 0.16,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* header */}
            <div
              style={{
                padding: "20px 22px 18px",
                borderBottom: "2px solid rgba(245,240,232,0.18)",
                position: "relative",
                zIndex: 2,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  fontSize: 10,
                  color: "var(--color-marquee)",
                }}
              >
                Panel de administración
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  lineHeight: 1,
                  marginTop: 6,
                }}
              >
                Chess
                <em
                  style={{
                    fontFamily: "var(--font-chess)",
                    fontStyle: "italic",
                    color: "var(--color-stage)",
                  }}
                >
                  itos
                </em>
              </p>
            </div>

            {/* nav */}
            <nav style={{ padding: "12px 0 0", position: "relative", zIndex: 2, flex: 1 }}>
              {primaryNav.map((item) => {
                const active = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "13px 22px",
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--color-cream)",
                      textDecoration: "none",
                      borderLeft: active
                        ? `4px solid ${item.isChess ? "var(--color-marquee)" : "var(--color-stage)"}`
                        : "4px solid transparent",
                      background: active ? "rgba(255,253,208,0.10)" : "transparent",
                      transition: "background 0.12s",
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        textAlign: "center",
                        fontFamily: item.isChess ? "var(--font-chess)" : "var(--font-display)",
                        fontStyle: item.isChess ? "italic" : "normal",
                        fontSize: 16,
                        color: item.isChess ? "var(--color-marquee)" : active ? "var(--color-stage)" : "inherit",
                        opacity: 0.9,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}

              <div style={{ height: 1, background: "rgba(245,240,232,0.18)", margin: "12px 22px" }} />

              {secondaryNav.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "13px 22px",
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--color-cream)",
                      textDecoration: "none",
                      borderLeft: active ? "4px solid var(--color-stage)" : "4px solid transparent",
                      background: active ? "rgba(255,253,208,0.10)" : "transparent",
                    }}
                  >
                    <span style={{ width: 22, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 16, opacity: 0.9, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* footer */}
            <div
              style={{
                borderTop: "2px solid rgba(245,240,232,0.18)",
                padding: "14px 22px 20px",
                display: "grid",
                gap: 6,
                position: "relative",
                zIndex: 2,
              }}
            >
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.16em",
                  fontSize: 11,
                  color: "var(--color-cream)",
                  textDecoration: "none",
                  padding: "8px 0",
                }}
              >
                <span style={{ opacity: 0.7 }}>↗</span>
                Ver sitio público
              </Link>

              <form action={logout}>
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.16em",
                    fontSize: 11,
                    color: "var(--color-stage)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 0",
                    width: "100%",
                    textAlign: "left" as const,
                  }}
                >
                  <span style={{ opacity: 0.8 }}>↩</span>
                  Cerrar sesión
                </button>
              </form>
            </div>
          </aside>
        </>
      )}

      {/* ── Main content ─────────────────────────────────────── */}
      <main>
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
