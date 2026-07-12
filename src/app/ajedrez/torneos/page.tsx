import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ListChecks,
  Trophy,
  Users,
} from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { TournamentPlayerIdentity } from "@/components/chess/TournamentPlayerIdentity";
import { Section } from "@/components/public/Section";
import { BrandMark } from "@/components/public/BrandMark";
import { listOfficialTournaments } from "@/lib/official-tournaments";
import {
  formatTournamentDate,
  formatTournamentStatus,
  formatTournamentSystem,
  getEffectiveTournamentStatus,
  getTournamentSummary,
  isTournamentHistorical,
} from "@/modules/chess/public-data";
import {
  getTournamentCoverImage,
  getTournamentPodium,
} from "@/modules/chess/publication";
import type { ChessTournament } from "@/modules/chess/types";

export const metadata: Metadata = {
  title: "Torneos de ajedrez",
  description: "Torneos oficiales de ajedrez publicados por Azotea Salcajá.",
};

export const dynamic = "force-dynamic";

/** Historial compacto: cuántos se muestran antes del "ver todo". */
const HISTORY_LIMIT = 6;

function tournamentHref(t: ChessTournament) {
  return isTournamentHistorical(t)
    ? `/ajedrez/torneos/${t.slug}`
    : `/ajedrez/torneos/live/${t.id}`;
}

export default async function ChessTournamentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ historial?: string | string[] }>;
}) {
  const params = await searchParams;
  const showAllHistory =
    (Array.isArray(params?.historial)
      ? params.historial[0]
      : params?.historial) === "todos";

  const tournaments = await listOfficialTournaments();
  const active = tournaments.filter((t) => !isTournamentHistorical(t));
  const historical = tournaments
    .filter(isTournamentHistorical)
    .sort((a, b) => (b.startsAt ?? "").localeCompare(a.startsAt ?? ""));
  const shownHistory = showAllHistory
    ? historical
    : historical.slice(0, HISTORY_LIMIT);
  const hiddenCount = historical.length - shownHistory.length;

  return (
    <PublicLayout>
      <main>
        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden border-b-[3px]"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderColor: "var(--color-stage)",
          }}
        >
          <BrandMark size={430} aria-hidden className="emblem-watermark" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
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
              <span
                className="section-label"
                style={{ color: "var(--color-marquee)" }}
              >
                Ajedrez oficial · Salcajá
              </span>
            </div>
            <h1
              className="mt-3 max-w-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-4xl)",
                lineHeight: 0.95,
              }}
            >
              Torneos de la comunidad
            </h1>
            <p
              className="mt-2 max-w-2xl text-sm leading-6"
              style={{ fontFamily: "var(--font-body)", opacity: 0.85 }}
            >
              Resultados, pareos e historias de las noches de ajedrez en Azotea
              Salcajá.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { href: "/ajedrez/agenda", label: "Agenda" },
                { href: "/ajedrez/ranking", label: "Palmarés" },
                { href: "/ajedrez/club", label: "Ranking del club" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border px-4 py-1.5 no-underline transition-transform hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-poster)",
                    fontSize: "var(--text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "var(--color-cream)",
                    borderColor: "rgba(255,253,208,0.4)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Section>
          {/* ── En curso ── */}
          <div className="flex items-center gap-2.5">
            <Trophy
              className="h-5 w-5"
              style={{ color: "var(--color-stage)" }}
              aria-hidden
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                lineHeight: 1,
              }}
            >
              En curso
            </h2>
          </div>

          {active.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {active.map((tournament) => {
                const summary = getTournamentSummary(tournament);
                const status = getEffectiveTournamentStatus(tournament);

                return (
                  <Link
                    key={tournament.id}
                    href={tournamentHref(tournament)}
                    className="product-card group flex-row! items-stretch no-underline"
                    style={{ color: "var(--color-ink)" }}
                  >
                    <div
                      className="w-24 shrink-0 border-r-2 sm:w-28"
                      style={{
                        backgroundImage: `url(${getTournamentCoverImage(tournament)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderColor: "var(--color-ink)",
                      }}
                    />
                    <div className="min-w-0 flex-1 p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="card-cat">
                          {formatTournamentSystem(tournament.system)}
                        </span>
                        <span
                          className="shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                          style={{
                            fontFamily: "var(--font-poster)",
                            background: "var(--color-stage)",
                            color: "var(--color-cream)",
                          }}
                        >
                          {formatTournamentStatus(status)}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "22px",
                          lineHeight: 1.02,
                          margin: "4px 0 0",
                        }}
                      >
                        {tournament.title}
                      </h3>

                      <div
                        className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t pt-2 text-[13px]"
                        style={{ borderColor: "rgba(26,26,26,0.12)" }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Users
                            className="h-3.5 w-3.5"
                            style={{ color: "var(--color-navy)" }}
                          />
                          {summary.players} jugadores
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ListChecks
                            className="h-3.5 w-3.5"
                            style={{ color: "var(--color-navy)" }}
                          />
                          {tournament.roundsPlanned} rondas
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays
                            className="h-3.5 w-3.5"
                            style={{ color: "var(--color-navy)" }}
                          />
                          {formatTournamentDate(tournament.startsAt)}
                        </span>
                      </div>

                      <span
                        className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-transform group-hover:gap-3"
                        style={{
                          fontFamily: "var(--font-poster)",
                          color: "var(--color-stage)",
                        }}
                      >
                        Ver en vivo
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className="mt-6 border-2 border-dashed px-5 py-8 text-center"
              style={{ borderColor: "rgba(26,26,26,0.2)" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "#777",
                }}
              >
                No hay torneos en juego ahora mismo. El próximo se publica el
                lunes — revisa la{" "}
                <Link
                  href="/ajedrez/agenda"
                  style={{ color: "var(--color-stage)" }}
                >
                  agenda
                </Link>
                .
              </p>
            </div>
          )}

          {/* ── Historial ── */}
          {historical.length > 0 && (
            <>
              <div className="mt-8 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CalendarDays
                    className="h-5 w-5"
                    style={{ color: "var(--color-navy)" }}
                    aria-hidden
                  />
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.8rem",
                      lineHeight: 1,
                    }}
                  >
                    Historial
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontSize: "10px",
                    color: "#888",
                  }}
                >
                  {historical.length} torneo{historical.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {shownHistory.map((tournament) => {
                  const champion = getTournamentPodium(tournament)[0];
                  return (
                    <Link
                      key={tournament.id}
                      href={tournamentHref(tournament)}
                      className="group flex min-w-0 items-center gap-4 border-2 p-3 no-underline transition motion-safe:hover:-translate-y-0.5"
                      style={{
                        background: "var(--color-grain)",
                        color: "var(--color-ink)",
                        borderColor: "var(--color-ink)",
                        boxShadow: "var(--shadow-card)",
                      }}
                    >
                      <div
                        className="h-16 w-16 shrink-0 border-2"
                        style={{
                          backgroundImage: `url(${getTournamentCoverImage(tournament)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderColor: "var(--color-ink)",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "var(--text-xl)",
                            lineHeight: 1.1,
                          }}
                        >
                          {tournament.title}
                        </p>
                        <p
                          className="mt-1 truncate opacity-70"
                          style={{
                            fontFamily: "var(--font-poster)",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.14em",
                          }}
                        >
                          {formatTournamentDate(tournament.startsAt)} ·{" "}
                          {formatTournamentSystem(tournament.system)} ·{" "}
                          {tournament.players.length} jugadores
                        </p>
                        {champion && (
                          <p
                            className="mt-1.5 flex items-center gap-1.5 truncate text-sm font-semibold"
                            style={{ color: "var(--color-navy)" }}
                          >
                            <Trophy
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: "var(--color-marquee)" }}
                              aria-hidden
                            />
                            <TournamentPlayerIdentity
                              name={champion.name}
                              photoUrl={champion.photoUrl}
                              avatarId={champion.avatarId}
                              size={24}
                              nameClassName="truncate"
                            />
                          </p>
                        )}
                      </div>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                        style={{ color: "var(--color-navy)" }}
                        aria-hidden
                      />
                    </Link>
                  );
                })}
              </div>

              {(hiddenCount > 0 || showAllHistory) && (
                <div className="mt-4 text-right">
                  <Link
                    href={
                      showAllHistory
                        ? "/ajedrez/torneos"
                        : "/ajedrez/torneos?historial=todos"
                    }
                    className="inline-flex items-center gap-2 no-underline transition-opacity hover:opacity-70"
                    style={{
                      fontFamily: "var(--font-poster)",
                      fontSize: "var(--text-xs)",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "var(--color-stage)",
                    }}
                  >
                    {showAllHistory
                      ? "Ver menos"
                      : `Ver historial completo (${historical.length})`}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Nota institucional */}
          <div
            className="mt-8 flex items-start gap-3 border-2 p-4"
            style={{
              background: "var(--color-cream)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <Trophy
              className="h-5 w-5 shrink-0"
              style={{ color: "var(--color-marquee)" }}
              aria-hidden
            />
            <p
              className="text-sm leading-6"
              style={{ fontFamily: "var(--font-body)", color: "#3a3a3a" }}
            >
              <strong
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                Lunes de ajedrez.
              </strong>{" "}
              Los torneos oficiales son publicados por el restaurante; los
              casuales por link se mantienen separados.
            </p>
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
