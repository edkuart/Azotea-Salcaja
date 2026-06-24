import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, ListChecks, Trophy, Users } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { BrandMark } from "@/components/public/BrandMark";
import { listTournaments } from "@/lib/tournament-store";
import {
  formatTournamentStatus,
  formatTournamentSystem,
  getEffectiveTournamentStatus,
  getTournamentSummary,
  isTournamentHistorical,
} from "@/modules/chess/public-data";
import { getTournamentCoverImage } from "@/modules/chess/publication";

export const metadata: Metadata = {
  title: "Torneos de ajedrez",
  description: "Torneos oficiales de ajedrez publicados por Azotea Salcajá.",
};

export const dynamic = "force-dynamic";

export default async function ChessTournamentsPage() {
  const all = await listTournaments();
  const tournaments = all.filter((tournament) => tournament.kind === "official");

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

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <span className="section-label" style={{ color: "var(--color-marquee)" }}>
              Ajedrez oficial · Salcajá
            </span>
            <h1
              className="mt-5 max-w-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-5xl)",
                lineHeight: 0.95,
              }}
            >
              Torneos de la comunidad
            </h1>
            <p
              className="mt-5 max-w-2xl text-base leading-7"
              style={{ fontFamily: "var(--font-body)", opacity: 0.85 }}
            >
              Resultados, pareos e historias de las noches de ajedrez en Azotea
              Salcajá, listos para compartir con jugadores y visitantes.
            </p>
          </div>
        </section>

        <Section>
          <div className="grid gap-6 md:grid-cols-2">
            {tournaments.map((tournament) => {
              const summary = getTournamentSummary(tournament);
              const isHistorical = isTournamentHistorical(tournament);
              const status = getEffectiveTournamentStatus(tournament);
              const href = isHistorical
                ? `/ajedrez/torneos/${tournament.slug}`
                : `/ajedrez/torneos/live/${tournament.id}`;

              return (
                <Link
                  key={tournament.id}
                  href={href}
                  className="product-card group no-underline"
                  style={{ color: "var(--color-ink)" }}
                >
                  <div
                    className="card-img"
                    style={{
                      backgroundImage: `url(${getTournamentCoverImage(tournament)})`,
                    }}
                  />
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-3">
                      <span className="card-cat">
                        {formatTournamentSystem(tournament.system)}
                      </span>
                      <span
                        className="shrink-0 rounded-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                        style={{
                          fontFamily: "var(--font-poster)",
                          background: isHistorical
                            ? "var(--color-navy)"
                            : "var(--color-stage)",
                          color: "var(--color-cream)",
                        }}
                      >
                        {formatTournamentStatus(status)}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "28px",
                        lineHeight: 1.02,
                        margin: "2px 0 0",
                      }}
                    >
                      {tournament.title}
                    </h2>

                    <p
                      className="text-sm leading-6"
                      style={{ color: "#3a3a3a", margin: "2px 0 0" }}
                    >
                      {tournament.recap ?? tournament.description}
                    </p>

                    <div
                      className="mt-3 grid gap-2 border-t pt-3 text-sm sm:grid-cols-3"
                      style={{ borderColor: "rgba(26,26,26,0.12)" }}
                    >
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" style={{ color: "var(--color-navy)" }} />
                        {summary.players} jugadores
                      </span>
                      <span className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4" style={{ color: "var(--color-navy)" }} />
                        {tournament.roundsPlanned} rondas
                      </span>
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" style={{ color: "var(--color-navy)" }} />
                        {tournament.startsAt}
                      </span>
                    </div>

                    <span
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] transition-transform group-hover:gap-3"
                      style={{
                        fontFamily: "var(--font-poster)",
                        color: isHistorical
                          ? "var(--color-navy)"
                          : "var(--color-stage)",
                      }}
                    >
                      {isHistorical ? "Ver torneo" : "Ver en vivo"}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Nota institucional */}
          <div
            className="mt-8 border-2 p-6 sm:p-7"
            style={{
              background: "var(--color-cream)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <Trophy className="h-6 w-6" style={{ color: "var(--color-marquee)" }} aria-hidden />
            <h2
              className="mt-3"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                lineHeight: 1,
              }}
            >
              Lunes de ajedrez
            </h2>
            <p
              className="mt-3 max-w-3xl text-sm leading-6"
              style={{ fontFamily: "var(--font-body)", color: "#3a3a3a" }}
            >
              Los torneos oficiales son publicados por el restaurante. Los
              torneos casuales por link se mantendrán separados para no
              confundirse con eventos oficiales de Azotea Salcajá.
            </p>
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
