import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, ListChecks, Trophy, Users } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { listTournaments } from "@/lib/tournament-store";
import {
  formatTournamentStatus,
  formatTournamentSystem,
  getEffectiveTournamentStatus,
  getTournamentSummary,
  isTournamentHistorical,
} from "@/modules/chess/public-data";
import type { ChessTournament } from "@/modules/chess/types";
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
        <section
          className="bg-stone-950 text-white"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(28,25,23,0.88), rgba(28,25,23,0.42)), url(https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1800&q=80)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
              Ajedrez oficial
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">
              Torneos de la comunidad
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100">
              Resultados, pareos e historias de las noches de ajedrez en Azotea
              Salcajá, listos para compartir con jugadores y visitantes.
            </p>
          </div>
        </section>

        <Section>
          <div className="grid gap-5 md:grid-cols-2">
            {tournaments.map((tournament) => {
              const summary = getTournamentSummary(tournament);
              const isHistorical = isTournamentHistorical(tournament);
              const status = getEffectiveTournamentStatus(tournament);

              return (
                <article
                  className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
                  key={tournament.id}
                >
                  <div
                    className="h-56 bg-stone-200"
                    style={{
                      backgroundImage: `url(${getTournamentCoverImage(tournament)})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                  <div className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                          {formatTournamentSystem(tournament.system)}
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold text-stone-950">
                          {tournament.title}
                        </h2>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        {formatTournamentStatus(status)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {tournament.recap ?? tournament.description}
                    </p>

                    <div className="mt-5 grid gap-3 text-sm text-stone-700 sm:grid-cols-3">
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-700" />
                        {summary.players} jugadores
                      </p>
                      <p className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-emerald-700" />
                        {tournament.roundsPlanned} rondas
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-emerald-700" />
                        {tournament.startsAt}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4">
                      {isHistorical ? (
                        <Link
                          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
                          href={`/ajedrez/torneos/${tournament.slug}`}
                        >
                          Ver torneo
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      ) : (
                        <Link
                          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700"
                          href={`/ajedrez/torneos/live/${tournament.id}`}
                        >
                          Ver en vivo
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6">
            <Trophy className="h-5 w-5 text-emerald-700" aria-hidden />
            <h2 className="mt-3 text-2xl font-semibold text-stone-950">
              Lunes de ajedrez
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
              Los torneos oficiales son publicados por el restaurante. Los
              torneos casuales por link se mantendran separados para no
              confundirse con eventos oficiales de Azotea Salcajá.
            </p>
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
