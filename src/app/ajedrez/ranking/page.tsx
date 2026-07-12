import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Medal, TrendingUp } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { VictoryPodium } from "@/components/chess/VictoryPodium";
import { Section } from "@/components/public/Section";
import { listOfficialTournaments } from "@/lib/official-tournaments";
import {
  formatTournamentSystem,
  getEffectiveTournamentStatus,
} from "@/modules/chess/public-data";
import { calculateStandings } from "@/modules/chess/standings";
import type { ChessTournament } from "@/modules/chess/types";

export const metadata: Metadata = {
  title: "Palmarés — Ajedrez · Azotea Salcajá",
  description:
    "Los podios de cada torneo oficial de la comunidad de ajedrez en Azotea Salcajá.",
};

export const dynamic = "force-dynamic";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Solo torneos realmente disputados: finalizados, no cancelados. */
function isCompleted(t: ChessTournament) {
  return getEffectiveTournamentStatus(t) === "closed";
}

function getPodium(t: ChessTournament) {
  const standings = calculateStandings(t);
  return standings.slice(0, 3);
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function RankingPage() {
  const allTournaments = await listOfficialTournaments();
  const completed = allTournaments.filter(isCompleted);

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
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <Link
                href="/ajedrez"
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                  color: "var(--color-marquee)",
                  textDecoration: "none",
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
                }}
              >
                Historia de la comunidad
              </p>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 9vw, var(--text-4xl))",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
                margin: "10px 0 8px",
              }}
            >
              Palmarés
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
                color: "rgba(255,253,208,0.78)",
                maxWidth: "500px",
                marginBottom: "14px",
              }}
            >
              Los podios de cada torneo oficial. El ranking ELO y el circuito
              anual viven en su propia página.
            </p>
            <Link
              href="/ajedrez/club"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--color-stage)",
                color: "var(--color-cream)",
                border: "2px solid var(--color-cream)",
                boxShadow: "3px 3px 0 var(--color-marquee)",
                padding: "8px 14px",
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: "11px",
                textDecoration: "none",
              }}
            >
              <TrendingUp
                style={{ width: "16px", height: "16px" }}
                aria-hidden
              />
              Ver ranking del club
              <ArrowRight
                style={{ width: "14px", height: "14px" }}
                aria-hidden
              />
            </Link>
          </div>
        </section>

        {/* ── Historial de torneos con podios ── */}
        <Section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <Medal
              style={{
                width: "20px",
                height: "20px",
                color: "var(--color-marquee)",
              }}
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
              Torneos disputados
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
                Cuando termine el primer torneo oficial, aquí aparecerá el podio
                con los ganadores.
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
                const podium = getPodium(t);
                const liveHref = t.id.startsWith("t")
                  ? `/ajedrez/torneos/live/${t.id}`
                  : `/ajedrez/torneos/${t.slug}`;
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
                          {formatTournamentSystem(t.system)} · {t.roundsPlanned}{" "}
                          rondas · {t.players.length} jugadores
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
                        <ArrowRight
                          style={{ width: "10px", height: "10px" }}
                          aria-hidden
                        />
                      </Link>
                    </div>

                    {/* Podium */}
                    {podium.length > 0 ? (
                      <div style={{ padding: "14px" }}>
                        <VictoryPodium
                          variant="compact"
                          entries={podium.map((standing) => ({
                            playerId: standing.playerId,
                            name: standing.name,
                            photoUrl: standing.photoUrl,
                            avatarId: standing.avatarId,
                            points: standing.points,
                            wins: standing.wins,
                          }))}
                          label={`Podio de ${t.title}`}
                        />
                      </div>
                    ) : (
                      <div style={{ padding: "20px 18px" }}>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            color: "#999",
                          }}
                        >
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
      </main>
    </PublicLayout>
  );
}
