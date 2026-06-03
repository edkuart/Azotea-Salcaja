import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Medal, Trophy } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { listTournaments } from "@/lib/tournament-store";
import {
  formatTournamentSystem,
  officialChessTournaments,
} from "@/modules/chess/public-data";
import { calculateStandings } from "@/modules/chess/standings";
import type { ChessTournament } from "@/modules/chess/types";

export const metadata: Metadata = {
  title: "Clasificación — Ajedrez · Azotea Salcajá",
  description:
    "Historial de torneos y podios de la comunidad de ajedrez en Azotea Salcajá.",
};

export const dynamic = "force-dynamic";

// ── Helpers ──────────────────────────────────────────────────────────────────

function isCompleted(t: ChessTournament) {
  if (t.status === "closed" || t.status === "cancelled") return true;
  if (t.rounds.length === 0) return false;
  const allGenerated = t.rounds.length >= t.roundsPlanned;
  const lastDone = t.rounds.at(-1)!.games.every((g) => g.result !== "unplayed");
  return allGenerated && lastDone;
}

function getPodium(t: ChessTournament) {
  const standings = calculateStandings(t);
  return standings.slice(0, 3);
}

const MEDAL_COLORS = [
  { border: "var(--color-marquee)", label: "1°", emoji: "🥇" },
  { border: "#9ca3af",              label: "2°", emoji: "🥈" },
  { border: "#8a5a2b",              label: "3°", emoji: "🥉" },
];

// ─────────────────────────────────────────────────────────────────────────────

export default async function RankingPage() {
  const stored = await listTournaments();
  const allTournaments = [
    ...stored,
    ...officialChessTournaments.filter(
      (ot) => !stored.some((s) => s.id === ot.id),
    ),
  ];

  const completed = allTournaments.filter(isCompleted);
  const active    = allTournaments.filter((t) => !isCompleted(t) && t.rounds.length > 0);

  // Total stats across all tournaments
  const totalGames   = allTournaments.flatMap((t) => t.rounds.flatMap((r) => r.games)).filter((g) => g.result !== "unplayed" && !g.isBye).length;
  const totalPlayers = allTournaments.reduce((acc, t) => acc + t.players.length, 0);

  return (
    <PublicLayout>
      <main>

        {/* ── Hero ── */}
        <section
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderBottom: "4px solid var(--color-marquee)",
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
                color: "var(--color-marquee)",
                marginBottom: "12px",
              }}
            >
              Historia de la comunidad
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
              Clasificación{" "}
              <em
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  color: "var(--color-marquee)",
                }}
              >
                &amp; Palmarés
              </em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.7,
                color: "rgba(255,253,208,0.78)",
                maxWidth: "500px",
              }}
            >
              Resultados y podios de cada torneo oficial. A medida que la
              comunidad crezca, aquí aparecerá el ranking ELO acumulado de
              todos los jugadores.
            </p>
          </div>
        </section>

        {/* ── Stats globales ── */}
        <div style={{ background: "var(--color-stage)", color: "var(--color-cream)" }}>
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
              {[
                { value: allTournaments.length, label: "Torneos" },
                { value: totalPlayers,          label: "Participantes" },
                { value: totalGames,            label: "Partidas jugadas" },
              ].map(({ value, label }) => (
                <div key={label} style={{ textAlign: "center", padding: "12px 8px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 6vw, 3.5rem)",
                      lineHeight: 0.9,
                      color: "var(--color-cream)",
                    }}
                  >
                    {value}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      fontSize: "9px",
                      color: "rgba(255,253,208,0.7)",
                      marginTop: "6px",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Torneos en curso ── */}
        {active.length > 0 && (
          <Section>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <Trophy
                style={{ width: "20px", height: "20px", color: "var(--color-emerald)" }}
                aria-hidden
              />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  lineHeight: 1,
                  color: "var(--color-ink)",
                }}
              >
                En curso
              </h2>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              {active.map((t) => {
                const standings = calculateStandings(t);
                const leader    = standings[0];
                const liveHref  = t.id.startsWith("t") ? `/ajedrez/torneos/live/${t.id}` : `/ajedrez/torneos/${t.slug}`;
                return (
                  <Link
                    key={t.id}
                    href={liveHref}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 18px",
                      background: "var(--color-grain)",
                      border: "2px solid var(--color-ink)",
                      borderLeft: "4px solid var(--color-emerald)",
                      boxShadow: "var(--shadow-card)",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.2rem",
                          color: "var(--color-ink)",
                          marginBottom: "4px",
                        }}
                      >
                        {t.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-poster)",
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          fontSize: "9px",
                          color: "#888",
                        }}
                      >
                        {formatTournamentSystem(t.system)} · Ronda {t.rounds.length}/{t.roundsPlanned}
                        {leader && ` · Líder: ${leader.name} (${leader.points} pts)`}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-poster)",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          fontSize: "9px",
                          color: "var(--color-emerald)",
                          border: "1px solid var(--color-emerald)",
                          padding: "2px 8px",
                        }}
                      >
                        En vivo
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
          </Section>
        )}

        {/* ── Historial de torneos con podios ── */}
        <Section>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <Medal
              style={{ width: "20px", height: "20px", color: "var(--color-marquee)" }}
              aria-hidden
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                lineHeight: 1,
                color: "var(--color-ink)",
              }}
            >
              Palmarés
            </h2>
          </div>

          {completed.length === 0 ? (
            <div
              style={{
                border: "2px dashed rgba(26,26,26,0.2)",
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  fontSize: "3rem",
                  color: "rgba(26,26,26,0.1)",
                  marginBottom: "10px",
                }}
                aria-hidden
              >
                ♛
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                  color: "var(--color-ink)",
                  marginBottom: "8px",
                }}
              >
                El palmarés está en construcción
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "#888",
                  maxWidth: "380px",
                  margin: "0 auto 20px",
                  lineHeight: 1.6,
                }}
              >
                Cuando termine el primer torneo oficial, aquí aparecerá el
                podio con los ganadores.
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
                Ver torneos activos →
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {completed.map((t) => {
                const podium  = getPodium(t);
                const liveHref = t.id.startsWith("t") ? `/ajedrez/torneos/live/${t.id}` : `/ajedrez/torneos/${t.slug}`;
                return (
                  <article
                    key={t.id}
                    style={{
                      border: "2px solid var(--color-ink)",
                      boxShadow: "var(--shadow-card)",
                      background: "var(--color-grain)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Card header */}
                    <div
                      style={{
                        background: "var(--color-ink)",
                        color: "var(--color-cream)",
                        padding: "14px 18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.2rem",
                            lineHeight: 1.05,
                          }}
                        >
                          {t.title}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-poster)",
                            textTransform: "uppercase",
                            letterSpacing: "0.14em",
                            fontSize: "9px",
                            color: "rgba(255,253,208,0.55)",
                            marginTop: "3px",
                          }}
                        >
                          {formatTournamentSystem(t.system)} · {t.roundsPlanned} rondas · {t.players.length} jugadores
                        </p>
                      </div>
                      <Link
                        href={liveHref}
                        style={{
                          fontFamily: "var(--font-poster)",
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          fontSize: "9px",
                          color: "var(--color-marquee)",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          flexShrink: 0,
                        }}
                      >
                        Ver tabla
                        <ArrowRight style={{ width: "10px", height: "10px" }} aria-hidden />
                      </Link>
                    </div>

                    {/* Podium */}
                    {podium.length > 0 ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", padding: "16px" }}>
                        {[0, 1, 2].map((i) => {
                          const s = podium[i];
                          const medal = MEDAL_COLORS[i]!;
                          if (!s) {
                            return (
                              <div
                                key={i}
                                style={{
                                  border: "2px dashed rgba(26,26,26,0.15)",
                                  padding: "12px",
                                  textAlign: "center",
                                  minHeight: "70px",
                                }}
                              />
                            );
                          }
                          return (
                            <div
                              key={i}
                              style={{
                                background: i === 0 ? "var(--color-ink)" : "transparent",
                                border: "2px solid var(--color-ink)",
                                borderLeft: `4px solid ${medal.border}`,
                                padding: "10px 12px",
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "var(--font-poster)",
                                  fontSize: "9px",
                                  letterSpacing: "0.14em",
                                  textTransform: "uppercase",
                                  color: medal.border,
                                  marginBottom: "4px",
                                }}
                              >
                                {medal.label}
                              </p>
                              <p
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  color: i === 0 ? "var(--color-cream)" : "var(--color-ink)",
                                  lineHeight: 1.2,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {s.name}
                              </p>
                              <p
                                style={{
                                  fontFamily: "ui-monospace, monospace",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  color: medal.border,
                                  marginTop: "3px",
                                }}
                              >
                                {s.points} pts
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ padding: "20px 18px" }}>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#999" }}>
                          Sin resultados registrados.
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── Próximamente: ranking ELO ── */}
        <div
          style={{
            background: "var(--color-grain)",
            borderTop: "2px solid var(--color-ink)",
          }}
        >
          <Section>
            <div
              style={{
                border: "2px solid rgba(26,26,26,0.15)",
                padding: "28px 24px",
                display: "grid",
                gap: "12px",
                maxWidth: "540px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                  color: "var(--color-stage)",
                }}
              >
                Próximamente
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  lineHeight: 1.05,
                  color: "var(--color-ink)",
                }}
              >
                Ranking ELO de la comunidad
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.7,
                  color: "#555",
                }}
              >
                A medida que se jueguen más torneos, construiremos un ranking
                acumulado donde cada victoria y derrota moverá la puntuación
                de cada jugador. El objetivo es tener una tabla permanente de
                la comunidad local de Salcajá.
              </p>
            </div>
          </Section>
        </div>

      </main>
    </PublicLayout>
  );
}
