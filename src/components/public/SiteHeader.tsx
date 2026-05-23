"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { restaurantInfo } from "@/modules/restaurant/public-data";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menú" },
  { href: "/eventos", label: "Eventos" },
  { href: "/ajedrez", label: "Ajedrez" },
  { href: "/ajedrez/torneos", label: "Torneos" },
  { href: "/contacto", label: "Contacto" },
];

const mobileExtras = [
  {
    href: `https://wa.me/${restaurantInfo.whatsapp}`,
    label: "WhatsApp",
    external: true,
  },
  { href: "/ajedrez/crear", label: "Torneos privados", external: false },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className="sticky top-0 z-40 flex items-center justify-between gap-6 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-3.5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 text-[var(--color-ink)] no-underline"
          style={{ fontFamily: "var(--font-display)", fontSize: "22px", lineHeight: 1 }}
        >
          <div
            className="vinyl-disc-sm shrink-0"
            style={{ width: "32px", height: "32px" }}
            aria-hidden="true"
          />
          <span>
            Azotea{" "}
            <em
              style={{
                fontFamily: "var(--font-chess)",
                fontStyle: "italic",
                color: "var(--color-stage)",
              }}
            >
              Salcajá
            </em>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="pb-0.5 no-underline transition-colors"
                style={{
                  fontFamily: "var(--font-poster)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--color-ink)",
                  borderBottom: isActive
                    ? "2px solid var(--color-stage)"
                    : "2px solid transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <a
          href={`https://wa.me/${restaurantInfo.whatsapp}`}
          className="btn btn-primary hidden sm:inline-flex"
          style={{ padding: "10px 18px" }}
          rel="noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex md:hidden flex-col justify-center items-center gap-[5px] p-2 -mr-1"
          style={{ width: "40px", height: "40px" }}
        >
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              background: "var(--color-ink)",
              transition: "transform 0.2s, opacity 0.2s",
              transform: open ? "translateY(7px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              background: "var(--color-ink)",
              transition: "opacity 0.2s",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              background: "var(--color-ink)",
              transition: "transform 0.2s, opacity 0.2s",
              transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </header>

      {/* Mobile dropdown */}
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
          {/* Main nav links */}
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 8vw, 3rem)",
                  lineHeight: 1.1,
                  color: isActive ? "var(--color-stage)" : "var(--color-cream)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,253,208,0.1)",
                  padding: "10px 0",
                  display: "block",
                  transition: "color 0.15s",
                }}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div
            style={{
              margin: "20px 0 12px",
              height: "2px",
              background: "var(--color-stage)",
              width: "48px",
            }}
          />

          {/* Extra links */}
          {mobileExtras.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                rel="noreferrer"
                target="_blank"
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-poster)",
                  fontSize: "13px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-marquee)",
                  textDecoration: "none",
                  padding: "8px 0",
                  display: "block",
                }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-poster)",
                  fontSize: "13px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-marquee)",
                  textDecoration: "none",
                  padding: "8px 0",
                  display: "block",
                }}
              >
                {item.label}
              </Link>
            )
          )}

          {/* Bottom info strip */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "40px",
              opacity: 0.45,
              fontFamily: "var(--font-poster)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {restaurantInfo.address}
          </div>
        </nav>
      </div>
    </>
  );
}
