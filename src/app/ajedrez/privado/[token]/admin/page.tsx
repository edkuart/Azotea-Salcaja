import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, LockKeyhole } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { getPlayerName } from "@/modules/chess/public-data";
import { generateNextRoundPreview } from "@/modules/chess/pairings";
import {
  decodePrivateTournamentToken,
  privateDraftToTournament,
} from "@/modules/chess/private-tournaments";
import { calculateStandings } from "@/modules/chess/standings";

export const metadata: Metadata = {
  title: "Admin torneo privado",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PrivateTournamentAdminPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const draft = decodePrivateTournamentToken(token);

  if (!draft) {
    notFound();
  }

  const tournament = privateDraftToTournament(draft, token);
  const standings = calculateStandings(tournament);
  const nextRoundPreview = generateNextRoundPreview(tournament);

  return (
    <PublicLayout>
      <main>
        <Section>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
            href={`/ajedrez/privado/${token}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Vista compartida
          </Link>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="flex items-center gap-2 font-semibold">
              <LockKeyhole className="h-4 w-4" aria-hidden />
              Administracion casual
            </p>
            <p className="mt-2 leading-6">
              Este prototipo genera el torneo desde el link. La edicion
              persistente de resultados se conectara a base de datos/localStorage
              en el pulido de privados.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Torneo privado
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-stone-950">
                {tournament.title}
              </h1>
              <p className="mt-3 text-sm text-stone-600">
                {tournament.players.length} jugadores ·{" "}
                {tournament.system === "swiss" ? "Sistema suizo" : "Round robin"} ·{" "}
                {tournament.roundsPlanned} rondas
              </p>
            </div>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white">
              <Copy className="h-4 w-4" aria-hidden />
              Copiar link
            </button>
          </div>
        </Section>

        <Section className="pt-0">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-950">
                Jugadores
              </h2>
              <div className="mt-4 divide-y divide-stone-200">
                {standings.map((standing, index) => (
                  <div
                    className="grid grid-cols-[40px_1fr_60px] items-center gap-3 py-3 text-sm"
                    key={standing.playerId}
                  >
                    <span className="font-semibold text-stone-500">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-stone-950">
                      {standing.name}
                    </span>
                    <span className="text-right font-semibold text-emerald-800">
                      {standing.points}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-stone-950">
                  Pareos
                </h2>
                <button className="h-9 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white">
                  Generar ronda
                </button>
              </div>

              {nextRoundPreview.warnings.length > 0 ? (
                <div className="mt-4 grid gap-2">
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

              <div className="mt-4 divide-y divide-stone-200">
                {nextRoundPreview.round.games.map((game) => (
                  <div
                    className="grid gap-2 py-3 text-sm lg:grid-cols-[70px_1fr_120px]"
                    key={game.id}
                  >
                    <span className="font-semibold text-stone-500">
                      Mesa {game.boardNumber}
                    </span>
                    <span>
                      {getPlayerName(tournament, game.whitePlayerId)} vs{" "}
                      {getPlayerName(tournament, game.blackPlayerId)}
                    </span>
                    <div className="flex gap-1">
                      {game.isBye ? (
                        <span className="font-semibold text-emerald-800">
                          BYE
                        </span>
                      ) : (
                        ["1-0", "0.5", "0-1"].map((label) => (
                          <button
                            className="h-8 rounded-md border border-stone-300 px-2 text-xs font-semibold text-stone-700"
                            key={label}
                          >
                            {label}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
