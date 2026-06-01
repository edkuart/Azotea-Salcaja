import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCategories,
  adminEvents,
  adminProducts,
} from "@/modules/admin/restaurant-data";
import { getActiveOfficialTournaments } from "@/modules/chess/public-data";

const quickActions = [
  { href: "/admin/productos/nuevo", label: "Nuevo\nproducto", icon: "+",    isChess: false },
  { href: "/admin/eventos",         label: "Nuevo\nevento",   icon: "★",    isChess: false },
  { href: "/admin/ajedrez/torneos/nuevo", label: "Nuevo\ntorneo", icon: "♛", isChess: true },
  { href: "/",                      label: "Ver sitio\npúblico", icon: "↗", isChess: false },
];

export default function AdminPage() {
  const activeTournaments = getActiveOfficialTournaments();
  const stats = [
    { label: "Eventos\nde hoy",     value: adminEvents.length,     delta: "activos",  warn: false },
    { label: "Torneos\nactivos",    value: activeTournaments.length, delta: "en curso", warn: false },
    { label: "Productos\nen carta", value: adminProducts.length,   delta: `${adminCategories.length} categorías`, warn: false },
  ];

  return (
    <AdminShell>
      {/* greeting */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontFamily: "var(--font-poster)",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontSize: 11,
            color: "var(--color-stage)",
          }}
        >
          Panel administrativo
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            lineHeight: 0.95,
            marginTop: 6,
          }}
        >
          Bienvenido,{" "}
          <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-stage)" }}>
            admin
          </em>
          .
        </h1>
      </div>

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--color-grain)",
              border: "2px solid var(--color-ink)",
              padding: "12px 12px 14px",
              boxShadow: "3px 3px 0 var(--color-ink)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: 9.5,
                opacity: 0.7,
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                minHeight: 22,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 44,
                lineHeight: 0.95,
                color: "var(--color-stage)",
                marginTop: 4,
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.08em",
                color: s.warn ? "var(--color-amber)" : "var(--color-emerald)",
                marginTop: 4,
              }}
            >
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      {/* quick actions */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 11, opacity: 0.7 }}>
          Acciones rápidas
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "var(--color-ink)",
              color: "var(--color-cream)",
              border: "2px solid var(--color-ink)",
              aspectRatio: "1.05 / 1",
              padding: 14,
              textDecoration: "none",
              boxShadow: "3px 3px 0 var(--color-stage)",
              position: "relative",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                border: `2px solid ${a.isChess ? "var(--color-marquee)" : "var(--color-cream)"}`,
                display: "grid",
                placeItems: "center",
                fontFamily: a.isChess ? "var(--font-chess)" : "var(--font-display)",
                fontStyle: a.isChess ? "italic" : "normal",
                fontSize: 18,
                lineHeight: 1,
                color: a.isChess ? "var(--color-marquee)" : "inherit",
              }}
            >
              {a.icon}
            </span>
            <span
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: 13,
                lineHeight: 1.05,
                whiteSpace: "pre-line",
              }}
            >
              {a.label}
            </span>
            <span
              style={{
                position: "absolute",
                right: 12,
                bottom: 12,
                fontFamily: "monospace",
                fontSize: 16,
              }}
            >
              →
            </span>
          </Link>
        ))}
      </div>

      {/* status section */}
      <div
        style={{
          borderTop: "2px solid var(--color-ink)",
          paddingTop: 16,
        }}
      >
        <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 11, opacity: 0.7, marginBottom: 10 }}>
          Estado del sistema
        </p>
        <div style={{ display: "grid", gap: 6 }}>
          {[
            { label: "Sitio público",  status: "Activo",            ok: true  },
            { label: "Datos reales",   status: "Pendiente",         ok: false },
            { label: "Base de datos",  status: "Próxima conexión",  ok: null  },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "var(--color-grain)",
                border: "2px solid var(--color-ink)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
            >
              <span>{row.label}</span>
              <span
                style={{
                  fontFamily: "var(--font-poster)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: row.ok === true ? "var(--color-emerald)" : row.ok === false ? "var(--color-amber)" : "var(--color-ink)",
                }}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
