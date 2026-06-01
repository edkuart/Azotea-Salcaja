import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ListChecks,
  MapPin,
  Medal,
  Trophy,
  Users,
} from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { listTournaments } from "@/lib/tournament-store";
import {
  formatGameResult,
  getEffectiveTournamentStatus,
  formatTournamentStatus,
  formatTournamentSystem,
  getPlayerName,
  getPublishedOfficialTournaments,
  getTournamentSummary,
  officialChessTournaments,
} from "@/modules/chess/public-data";
import type { ChessTournament } from "@/modules/chess/types";
import { generateNextRoundPreview } from "@/modules/chess/pairings";
import {
  getTournamentCoverImage,
  getTournamentPodium,
  getTournamentShareText,
} from "@/modules/chess/publication";
import { calculateStandings } from "@/modules/chess/standings";
import { formatTieBreakLabel } from "@/modules/chess/tiebreaks";

export function generateStaticParams() {
  return getPublishedOfficialTournaments().map((tournament) => ({
    slug: tournament.slug,
  }));
}

export const dynamic = "force-dynamic";

function findTournamentBySlug(slug: string): ChessTournament | undefined {
  return (
    listTournaments().find((item) => item.slug === slug) ??
    officialChessTournaments.find((item) => item.slug === slug)
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tournament = findTournamentBySlug(slug);

  if (!tournament) {
    return {
      title: "Torneo de ajedrez",
    };
  }

  const image = getTournamentCoverImage(tournament);

  return {
    title: tournament.title,
    description: tournament.recap ?? tournament.description,
    openGraph: {
      title: getTournamentShareText(tournament),
      description: tournament.recap ?? tournament.description,
      images: [{ url: image }],
      type: "article",
    },
  };
}

export default async function ChessTournamentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = findTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  const summary = getTournamentSummary(tournament);
  const status = getEffectiveTournamentStatus(tournament);
  const standings = calculateStandings(tournament);
  const podium = getTournamentPodium(tournament);
  const nextRoundPreview = generateNextRoundPreview(tournament);
  const coverImage = getTournamentCoverImage(tournament);

  return (
    <PublicLayout>
      <main>
        <section
          className="bg-stone-950 text-white"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(28,25,23,0.88), rgba(28,25,23,0.4)), url(${coverImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200"
              href="/ajedrez/torneos"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Volver a torneos
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
              Torneo oficial
            </p>
            <div className="mt-4 max-w-4xl">
              <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
                {tournament.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100">
                {tournament.recap ?? tournament.description}
              </p>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-stone-100 sm:grid-cols-2 lg:grid-cols-4">
              <p className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-200" />
                {formatTournamentStatus(status)}
              </p>
              <p className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-amber-200" />
                {formatTournamentSystem(tournament.system)}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-amber-200" />
                {tournament.startsAt}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-200" />
                {tournament.locationLabel}
              </p>
            </div>
          </div>
        </section>

        <Section>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Jugadores", `${summary.players}`, Users],
              ["Rondas", `${tournament.roundsPlanned}`, ListChecks],
              ["Partidas", `${summary.completedGames}/${summary.games}`, Trophy],
              ["Actual", `${tournament.currentRoundNumber}`, CalendarDays],
            ].map(([label, value, Icon]) => (
              <article
                className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
                key={label as string}
              >
                <Icon className="h-5 w-5 text-emerald-700" aria-hidden />
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  {label as string}
                </p>
                <p className="mt-2 text-xl font-semibold text-stone-950">
                  {value as string}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <div className="bg-white">
          <Section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Podio
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                  Posiciones destacadas
                </h2>
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
                {status === "closed" ? "Final" : "Provisional"}
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {podium.map((standing, index) => (
                <article
                  className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-5"
                  key={standing.playerId}
                >
                  <Medal className="h-6 w-6 text-amber-600" aria-hidden />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Lugar {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-stone-950">
                    {standing.name}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">
                    {standing.points} puntos · {standing.wins} victorias
                  </p>
                </article>
              ))}
            </div>
          </Section>
        </div>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <section>
              <h2 className="text-2xl font-semibold text-stone-950">
                Tabla de posiciones
              </h2>
              <div className="mt-4 overflow-x-auto rounded-lg border border-stone-200 bg-white">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-[0.12em] text-stone-500">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Jugador</th>
                      {tournament.tieBreakOrder.slice(0, 5).map((code) => (
                        <th className="px-4 py-3" key={code}>
                          {formatTieBreakLabel(code)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {standings.map((standing, index) => (
                      <tr key={standing.playerId}>
                        <td className="px-4 py-3 font-semibold text-stone-500">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-stone-950">
                            {standing.name}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            {standing.wins}G {standing.draws}T{" "}
                            {standing.losses}P
                          </p>
                        </td>
                        {tournament.tieBreakOrder.slice(0, 5).map((code) => (
                          <td
                            className="px-4 py-3 font-semibold text-emerald-800"
                            key={code}
                          >
                            {standing.tieBreaks[code] ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-950">
                Historial de rondas
              </h2>
              <div className="mt-4 grid gap-4">
                {tournament.rounds.length > 0 ? (
                  tournament.rounds.map((round) => (
                    <article
                      className="rounded-lg border border-stone-200 bg-white p-4"
                      key={round.id}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-semibold text-stone-950">
                          Ronda {round.roundNumber}
                        </h3>
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                          {round.status}
                        </span>
                      </div>
                      <div className="mt-4 divide-y divide-stone-200">
                        {round.games.map((game) => (
                          <div
                            className="grid gap-2 py-3 text-sm sm:grid-cols-[70px_1fr_90px]"
                            key={game.id}
                          >
                            <span className="font-semibold text-stone-500">
                              Mesa {game.boardNumber}
                            </span>
                            <span className="text-stone-800">
                              {getPlayerName(tournament, game.whitePlayerId)} vs{" "}
                              {getPlayerName(tournament, game.blackPlayerId)}
                            </span>
                            <span className="font-semibold text-emerald-800">
                              {formatGameResult(game.result)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-600">
                    Este torneo aun no tiene rondas generadas.
                  </p>
                )}
              </div>
            </section>
          </div>
        </Section>

        <div className="bg-white">
          <Section>
            <h2 className="text-2xl font-semibold text-stone-950">
              Siguiente ronda
            </h2>
            <div className="mt-4 rounded-lg border border-stone-200 p-4">
              {nextRoundPreview.warnings.length > 0 ? (
                <div className="mb-4 grid gap-2">
                  {nextRoundPreview.warnings.map((warning) => (
                    <p
                      className="rounded-md bg-amber-50 p-3 text-sm text-amber-900"
                      key={warning.code}
                    >
                      {warning.message}
                    </p>
                  ))}
                </div>
              ) : null}

              {nextRoundPreview.round.games.length > 0 ? (
                <div className="divide-y divide-stone-200">
                  {nextRoundPreview.round.games.map((game) => (
                    <div
                      className="grid gap-2 py-3 text-sm sm:grid-cols-[70px_1fr_90px]"
                      key={game.id}
                    >
                      <span className="font-semibold text-stone-500">
                        Mesa {game.boardNumber}
                      </span>
                      <span>
                        {getPlayerName(tournament, game.whitePlayerId)} vs{" "}
                        {getPlayerName(tournament, game.blackPlayerId)}
                      </span>
                      <span className="font-semibold text-emerald-800">
                        {game.isBye ? "BYE" : "Preview"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-600">
                  No hay pareo disponible por ahora.
                </p>
              )}
            </div>
          </Section>
        </div>

        {tournament.gallery && tournament.gallery.length > 0 ? (
          <Section>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Galeria
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-stone-950">
              Fotos del evento
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tournament.gallery.map((image) => (
                <figure
                  className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
                  key={image.src}
                >
                  <div
                    className="h-56 bg-stone-200"
                    style={{
                      backgroundImage: `url(${image.src})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                    role="img"
                    aria-label={image.alt}
                  />
                  <figcaption className="p-4 text-sm text-stone-600">
                    {image.alt}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>
        ) : null}
      </main>
    </PublicLayout>
  );
}
