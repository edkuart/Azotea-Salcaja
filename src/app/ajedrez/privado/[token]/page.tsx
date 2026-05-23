import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LockKeyhole, Users } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { formatGameResult, getPlayerName } from "@/modules/chess/public-data";
import { generateNextRoundPreview } from "@/modules/chess/pairings";
import {
  decodePrivateTournamentToken,
  privateDraftToTournament,
} from "@/modules/chess/private-tournaments";
import { calculateStandings } from "@/modules/chess/standings";
import { formatTieBreakLabel } from "@/modules/chess/tiebreaks";

export const metadata: Metadata = {
  title: "Torneo privado",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PrivateTournamentPage({
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
            href="/ajedrez/crear"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Crear otro torneo
          </Link>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="flex items-center gap-2 font-semibold">
              <LockKeyhole className="h-4 w-4" aria-hidden />
              Torneo privado casual
            </p>
            <p className="mt-2 leading-6">
              Este link no pertenece a un torneo oficial de Azotea Salcaja y no
              aparece en listados publicos.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Vista compartida
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-stone-950">
                {tournament.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-700">
                {tournament.description}
              </p>
            </div>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
              href={`/ajedrez/privado/${token}/admin`}
            >
              Administrar
            </Link>
          </div>
        </Section>

        <Section className="pt-0">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-stone-950">
                <Users className="h-5 w-5 text-emerald-700" aria-hidden />
                Tabla
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[540px] text-left text-sm">
                  <thead className="border-b border-stone-200 text-xs uppercase tracking-[0.12em] text-stone-500">
                    <tr>
                      <th className="py-3 pr-4">#</th>
                      <th className="py-3 pr-4">Jugador</th>
                      {tournament.tieBreakOrder.slice(0, 3).map((code) => (
                        <th className="py-3 pr-4" key={code}>
                          {formatTieBreakLabel(code)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {standings.map((standing, index) => (
                      <tr key={standing.playerId}>
                        <td className="py-3 pr-4 font-semibold text-stone-500">
                          {index + 1}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-stone-950">
                          {standing.name}
                        </td>
                        {tournament.tieBreakOrder.slice(0, 3).map((code) => (
                          <td
                            className="py-3 pr-4 font-semibold text-emerald-800"
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

            <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-950">
                Ronda inicial
              </h2>
              <div className="mt-4 divide-y divide-stone-200">
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
                      {game.isBye ? "BYE" : formatGameResult(game.result)}
                    </span>
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
