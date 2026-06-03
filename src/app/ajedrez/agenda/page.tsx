import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, MapPin, Trophy } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { listTournaments } from "@/lib/tournament-store";
import {
  formatTournamentSystem,
  getEffectiveTournamentStatus,
  officialChessTournaments,
} from "@/modules/chess/public-data";
import type { ChessTournament } from "@/modules/chess/types";

export const metadata: Metadata = {
  title: "Agenda — Ajedrez · Azotea Salcajá",
  description:
    "Calendario de clases Chessitos y torneos de ajedrez en Azotea Salcajá.",
};

export const dynamic = "force-dynamic";

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAYS_ES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDate(d: Date) {
  return `${DAYS_ES[d.getDay()]}, ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`;
}

function getUpcomingMondays(count: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: Date[] = [];
  // days since last Monday, or 0 if today is Monday
  const sinceMonday = (today.getDay() + 6) % 7; // Mon=0 … Sun=6
  // Next Monday (or today if it's Monday)
  const next = new Date(today);
  next.setDate(today.getDate() + (sinceMonday === 0 ? 0 : 7 - sinceMonday));
  for (let i = 0; i < count; i++) {
    days.push(new Date(next));
    next.setDate(next.getDate() + 7);
  }
  return days;
}

function isUpcoming(t: ChessTournament) {
  return t.status === "setup" || t.status === "active";
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  setup:     { label: "Próximo",    color: "var(--color-marquee)" },
  active:    { label: "En curso",   color: "var(--color-emerald)" },
  closed:    { label: "Finalizado", color: "#888" },
  cancelled: { label: "Cancelado",  color: "var(--color-stage)"  },
};

// ─────────────────────────────────────────────────────────────────────────────

export default async function AgendaPage() {
  const stored = await listTournaments();
  const allTournaments = [
    ...stored,
    ...officialChessTournaments.filter(
      (ot) => !stored.some((s) => s.id === ot.id),
    ),
  ];

  const upcoming = allTournaments.filter(isUpcoming);
  const mondays  = getUpcomingMondays(8);

  return (
    <PublicLayout>
      <main>

        {/* ── Hero ── */}
        <section
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderBottom: "4px solid var(--color-stage)",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              href="/ajedrez"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: "10px",
                color: "var(--color-marquee)",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "18px",
              }}
            >
              ← Ajedrez
            </Link>
            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: "11px",
                color: "var(--color-stage)",
                marginBottom: "12px",
              }}
            >
              Calendario
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 7vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
                marginBottom: "14px",
              }}
            >
              Agenda de{" "}
              <em
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  color: "var(--color-stage)",
                }}
              >
                ajedrez
              </em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.7,
                color: "rgba(255,253,208,0.78)",
                maxWidth: "480px",
              }}
            >
              Clases semanales y torneos oficiales. Todo lo que pasa los lunes
              en Azotea Salcajá.
            </p>
          </div>
        </section>

        {/* ── Dos columnas: Clases | Torneos ── */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">

            {/* — Clases — */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "var(--color-stage)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookOpen style={{ width: "16px", height: "16px", color: "var(--color-cream)" }} aria-hidden />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      fontSize: "10px",
                      color: "var(--color-stage)",
                    }}
                  >
                    Clases · Chessitos
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    Lunes · 5:30 – 7:30 PM · Azotea Salcajá
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "6px" }}>
                {mondays.map((d, i) => (
                  <div
                    key={d.toISOString()}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      background: i === 0 ? "var(--color-ink)" : "var(--color-grain)",
                      border: "2px solid var(--color-ink)",
                      boxShadow: i === 0 ? "3px 3px 0 var(--color-stage)" : "none",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: i === 0 ? "var(--color-cream)" : "var(--color-ink)",
                        }}
                      >
                        {formatDate(d)}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-poster)",
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          fontSize: "10px",
                          color: i === 0 ? "var(--color-marquee)" : "#888",
                          marginTop: "2px",
                        }}
                      >
                        5:30 – 7:30 PM
                      </p>
                    </div>
                    {i === 0 && (
                      <span
                        style={{
                          fontFamily: "var(--font-poster)",
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          fontSize: "9px",
                          background: "var(--color-stage)",
                          color: "var(--color-cream)",
                          padding: "3px 8px",
                        }}
                      >
                        Próxima
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <Link
                href="/ajedrez/clases"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "16px",
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontSize: "10px",
                  color: "var(--color-stage)",
                  textDecoration: "none",
                }}
              >
                Ver programa completo
                <ArrowRight style={{ width: "12px", height: "12px" }} aria-hidden />
              </Link>
            </div>

            {/* — Torneos — */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "var(--color-marquee)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Trophy style={{ width: "16px", height: "16px", color: "var(--color-ink)" }} aria-hidden />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      fontSize: "10px",
                      color: "var(--color-marquee)",
                    }}
                  >
                    Torneos oficiales
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#666" }}>
                    {upcoming.length > 0
                      ? `${upcoming.length} torneo${upcoming.length > 1 ? "s" : ""} activo${upcoming.length > 1 ? "s" : ""}`
                      : "Sin torneos activos"}
                  </p>
                </div>
              </div>

              {upcoming.length > 0 ? (
                <div style={{ display: "grid", gap: "6px" }}>
                  {upcoming.map((t) => {
                    const statusCfg = STATUS_LABEL[t.status] ?? STATUS_LABEL.setup;
                    const liveHref  = t.id.startsWith("t") ? `/ajedrez/torneos/live/${t.id}` : `/ajedrez/torneos/${t.slug}`;
                    return (
                      <Link
                        key={t.id}
                        href={liveHref}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px 16px",
                          background: "var(--color-grain)",
                          border: "2px solid var(--color-ink)",
                          boxShadow: "var(--shadow-card)",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "var(--color-ink)",
                              marginBottom: "4px",
                            }}
                          >
                            {t.title}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                              fontFamily: "var(--font-poster)",
                              textTransform: "uppercase",
                              letterSpacing: "0.14em",
                              fontSize: "9px",
                              color: "#888",
                            }}
                          >
                            <span>{formatTournamentSystem(t.system)}</span>
                            <span>·</span>
                            <span>{t.roundsPlanned} rondas</span>
                            {t.startsAt && (
                              <>
                                <span>·</span>
                                <span
                                  style={{ display: "flex", alignItems: "center", gap: "3px" }}
                                >
                                  <CalendarDays style={{ width: "10px", height: "10px" }} aria-hidden />
                                  {t.startsAt.split(" ")[0]}
                                </span>
                              </>
                            )}
                            {t.locationLabel && (
                              <>
                                <span>·</span>
                                <span
                                  style={{ display: "flex", alignItems: "center", gap: "3px" }}
                                >
                                  <MapPin style={{ width: "10px", height: "10px" }} aria-hidden />
                                  {t.locationLabel}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-poster)",
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              fontSize: "9px",
                              color: statusCfg.color,
                              border: `1px solid ${statusCfg.color}`,
                              padding: "2px 8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {statusCfg.label}
                          </span>
                          <ArrowRight
                            style={{ width: "14px", height: "14px", color: "var(--color-stage)" }}
                            aria-hidden
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    border: "2px dashed rgba(26,26,26,0.2)",
                    padding: "32px 20px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-chess)",
                      fontStyle: "italic",
                      fontSize: "2.5rem",
                      color: "rgba(26,26,26,0.12)",
                      marginBottom: "8px",
                    }}
                    aria-hidden
                  >
                    ♜
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "#999",
                      marginBottom: "16px",
                    }}
                  >
                    No hay torneos programados ahora mismo.
                  </p>
                  <Link
                    href="/ajedrez/torneos"
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      fontSize: "10px",
                      color: "var(--color-stage)",
                      textDecoration: "none",
                    }}
                  >
                    Ver historial →
                  </Link>
                </div>
              )}

              <Link
                href="/ajedrez/torneos"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "16px",
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontSize: "10px",
                  color: "var(--color-marquee)",
                  textDecoration: "none",
                }}
              >
                Ver todos los torneos
                <ArrowRight style={{ width: "12px", height: "12px" }} aria-hidden />
              </Link>
            </div>
          </div>
        </Section>

        {/* ── Info de ubicación ── */}
        <div style={{ background: "var(--color-grain)", borderTop: "2px solid var(--color-ink)" }}>
          <Section>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontSize: "10px",
                    color: "var(--color-stage)",
                    marginBottom: "6px",
                  }}
                >
                  Dónde encontrarnos
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    lineHeight: 1.1,
                    color: "var(--color-ink)",
                  }}
                >
                  Azotea Salcajá
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "#555",
                    marginTop: "4px",
                  }}
                >
                  Cada lunes · Clases 5:30 PM · Torneos 7:30 PM
                </p>
              </div>
              <Link href="/contacto" className="btn btn-primary">
                Cómo llegar
                <ArrowRight style={{ width: "14px", height: "14px", marginLeft: "6px" }} aria-hidden />
              </Link>
            </div>
          </Section>
        </div>

      </main>
    </PublicLayout>
  );
}
