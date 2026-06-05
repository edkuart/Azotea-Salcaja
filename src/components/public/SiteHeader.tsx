"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import { restaurantInfo } from "@/modules/restaurant/public-data";

const chessSubItems = [
  { href: "/ajedrez/clases",   label: "Clases",         exact: false },
  { href: "/ajedrez/torneos",  label: "Torneos",         exact: false },
  { href: "/ajedrez/agenda",   label: "Agenda",          exact: false },
  { href: "/ajedrez/ranking",  label: "Clasificación",   exact: false },
  { href: "/ajedrez",          label: "Comunidad",       exact: true  },
];

const mobileExtras = [
  { href: `https://wa.me/${restaurantInfo.whatsapp}`, label: "WhatsApp",         external: true  },
  { href: "/ajedrez/crear",                           label: "Torneos privados", external: false },
];

const NAV_LINK = (active: boolean) => ({
  fontFamily: "var(--font-poster)",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
  color: "var(--color-ink)",
  borderBottom: active ? "2px solid var(--color-stage)" : "2px solid transparent",
  paddingBottom: "2px",
  textDecoration: "none",
  transition: "color 0.15s",
  whiteSpace: "nowrap" as const,
});

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chessOpen, setChessOpen] = useState(false);
  const menuRef   = useRef<HTMLDivElement>(null);
  const chessRef  = useRef<HTMLDivElement>(null);

  const isChessActive = pathname.startsWith("/ajedrez");

  // Close everything on route change
  useEffect(() => { setOpen(false); setChessOpen(false); }, [pathname]);

  // ESC closes mobile menu
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open]);

  // Body scroll lock while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Click-outside closes chess desktop dropdown (not when clicking inside mobile menu)
  useEffect(() => {
    if (!chessOpen) return;
    const fn = (e: MouseEvent) => {
      const inMobileMenu = menuRef.current?.contains(e.target as Node);
      if (inMobileMenu) return;
      if (chessRef.current && !chessRef.current.contains(e.target as Node)) {
        setChessOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [chessOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-40 flex items-center justify-between gap-6 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-3.5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* ── Brand ── */}
        <Link
          href="/"
          className="flex items-center gap-3 text-[var(--color-ink)] no-underline"
          style={{ fontFamily: "var(--font-display)", fontSize: "22px", lineHeight: 1 }}
        >
          <div className="vinyl-disc-sm shrink-0" style={{ width: "32px", height: "32px" }} aria-hidden="true" />
          <span>
            Chess
            <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-stage)" }}>
              itos
            </em>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">

          <Link href="/" style={NAV_LINK(pathname === "/")} className="no-underline">
            Inicio
          </Link>

          {/* Ajedrez dropdown */}
          <div ref={chessRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setChessOpen((v) => !v)}
              aria-expanded={chessOpen}
              aria-haspopup="menu"
              style={{
                ...NAV_LINK(isChessActive),
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "0 0 2px 0",
              }}
            >
              Ajedrez
              <ChevronDown
                aria-hidden
                style={{
                  width: "12px",
                  height: "12px",
                  flexShrink: 0,
                  transform: chessOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {/* Dropdown panel */}
            {chessOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 14px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--color-ink)",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "4px 4px 0 var(--color-stage)",
                  minWidth: "160px",
                  zIndex: 50,
                }}
              >
                {chessSubItems.map((item, i) => {
                  const subActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setChessOpen(false)}
                      style={{
                        display: "block",
                        padding: "11px 18px",
                        fontFamily: "var(--font-poster)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: subActive ? "var(--color-marquee)" : "var(--color-cream)",
                        textDecoration: "none",
                        borderBottom: i < chessSubItems.length - 1
                          ? "1px solid rgba(255,253,208,0.12)"
                          : "none",
                        transition: "color 0.15s",
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/menu"
            style={NAV_LINK(pathname.startsWith("/menu") || pathname.startsWith("/eventos"))}
            className="no-underline"
          >
            Restaurante
          </Link>

          <Link href="/contacto" style={NAV_LINK(pathname.startsWith("/contacto"))} className="no-underline">
            Contacto
          </Link>
        </nav>

        {/* ── Desktop CTA ── */}
        <a
          href={`https://wa.me/${restaurantInfo.whatsapp}`}
          className="btn btn-primary hidden sm:inline-flex"
          style={{ padding: "10px 18px" }}
          rel="noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>

        {/* ── Hamburger (mobile) ── */}
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex md:hidden flex-col justify-center items-center gap-[5px] p-2 -mr-1"
          style={{ width: "40px", height: "40px" }}
        >
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--color-ink)", transition: "transform 0.2s, opacity 0.2s", transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--color-ink)", transition: "opacity 0.2s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "var(--color-ink)", transition: "transform 0.2s, opacity 0.2s", transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
        </button>
      </header>

      {/* ── Mobile menu ── */}
      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!open}
        className="md:hidden"
        style={{
          position: "fixed",
          top: "57px",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 39,
          background: "var(--color-ink)",
          color: "var(--color-cream)",
          overflowY: "auto",
          transform: open ? "translateY(0)" : "translateY(-8px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "transform 0.22s ease, opacity 0.22s ease",
        }}
      >
        <nav
          className="mx-auto w-full max-w-6xl px-5 py-8 flex flex-col gap-1"
          aria-label="Menú de navegación"
        >
          <MobileNavLink href="/" label="Inicio" active={pathname === "/"} onClick={() => setOpen(false)} />

          {/* Ajedrez accordion */}
          <div>
            <button
              type="button"
              onClick={() => setChessOpen((v) => !v)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 8vw, 3rem)",
                lineHeight: 1.1,
                color: isChessActive ? "var(--color-stage)" : "var(--color-cream)",
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(255,253,208,0.1)",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
              }}
            >
              Ajedrez
              <ChevronDown
                aria-hidden
                style={{
                  width: "28px",
                  height: "28px",
                  flexShrink: 0,
                  transform: chessOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {chessOpen && (
              <div style={{ paddingLeft: "8px", paddingBottom: "4px" }}>
                {chessSubItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "9px 0",
                      fontFamily: "var(--font-poster)",
                      fontSize: "14px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--color-marquee)",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(255,253,208,0.06)",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <MobileNavLink href="/menu" label="Restaurante" active={pathname.startsWith("/menu") || pathname.startsWith("/eventos")} onClick={() => setOpen(false)} />
          <MobileNavLink href="/contacto" label="Contacto" active={pathname.startsWith("/contacto")} onClick={() => setOpen(false)} />

          {/* Divider */}
          <div style={{ margin: "20px 0 12px", height: "2px", background: "var(--color-stage)", width: "48px" }} />

          {/* Extras */}
          {mobileExtras.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                rel="noreferrer"
                target="_blank"
                onClick={() => setOpen(false)}
                style={{ fontFamily: "var(--font-poster)", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-marquee)", textDecoration: "none", padding: "8px 0", display: "block" }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ fontFamily: "var(--font-poster)", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-marquee)", textDecoration: "none", padding: "8px 0", display: "block" }}
              >
                {item.label}
              </Link>
            )
          )}

          {/* Bottom strip */}
          <div style={{ marginTop: "auto", paddingTop: "40px", opacity: 0.45, fontFamily: "var(--font-poster)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {restaurantInfo.address}
          </div>
        </nav>
      </div>
    </>
  );
}

function MobileNavLink({
  href, label, active, onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2rem, 8vw, 3rem)",
        lineHeight: 1.1,
        color: active ? "var(--color-stage)" : "var(--color-cream)",
        textDecoration: "none",
        borderBottom: "1px solid rgba(255,253,208,0.1)",
        padding: "10px 0",
        display: "block",
        transition: "color 0.15s",
      }}
    >
      {label}
    </Link>
  );
}
