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

const CARD_BASE = {
  background: "var(--color-cream)",
  borderColor: "var(--color-ink)",
  boxShadow: "var(--shadow-card)",
} as const;

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
  const tieBreaks = tournament.tieBreakOrder.slice(0, 3);

  return (
    <PublicLayout>
      <main>
        <Section>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold no-underline"
            href="/ajedrez/crear"
            style={{ color: "var(--color-navy)" }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Crear otro torneo
          </Link>

          <div
            className="mt-6 border-l-[3px] p-4 text-sm"
            style={{ background: "rgba(212,160,23,0.12)", borderColor: "var(--color-marquee)", color: "#5a4410" }}
          >
            <p className="flex items-center gap-2 font-semibold" style={{ color: "var(--color-ink)" }}>
              <LockKeyhole className="h-4 w-4" aria-hidden />
              Torneo privado casual
            </p>
            <p className="mt-2 leading-6">
              Este link no pertenece a un torneo oficial de Azotea Salcajá y no
              aparece en listados públicos.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span
                className="text-xs uppercase"
                style={{ fontFamily: "var(--font-poster)", letterSpacing: "0.2em", color: "var(--color-stage)" }}
              >
                Vista compartida
              </span>
              <h1
                className="mt-3"
                style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", lineHeight: 0.97 }}
              >
                {tournament.title}
              </h1>
              <p
                className="mt-3 max-w-2xl leading-7"
                style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "#3a3a3a" }}
              >
                {tournament.description}
              </p>
            </div>
            <Link
              className="inline-flex h-11 shrink-0 items-center justify-center px-5 text-sm font-semibold uppercase tracking-[0.1em] no-underline"
              href={`/ajedrez/privado/${token}/admin`}
              style={{
                fontFamily: "var(--font-poster)",
                background: "var(--color-navy)",
                color: "var(--color-cream)",
              }}
            >
              Administrar
            </Link>
          </div>
        </Section>

        <Section className="pt-0">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="border-2 p-5" style={CARD_BASE}>
              <h2
                className="flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)", fontSize: "22px" }}
              >
                <Users className="h-5 w-5" style={{ color: "var(--color-navy)" }} aria-hidden />
                Tabla
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[540px] text-left text-sm">
                  <thead
                    className="text-xs uppercase tracking-[0.12em]"
                    style={{ fontFamily: "var(--font-poster)", color: "#5a5a5a" }}
                  >
                    <tr style={{ borderBottom: "2px solid var(--color-ink)" }}>
                      <th className="py-3 pr-4">#</th>
                      <th className="py-3 pr-4">Jugador</th>
                      {tieBreaks.map((code) => (
                        <th className="py-3 pr-4" key={code}>
                          {formatTieBreakLabel(code)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                    {standings.map((standing, index) => (
                      <tr key={standing.playerId}>
                        <td className="py-3 pr-4 font-semibold" style={{ color: "var(--color-navy)" }}>
                          {index + 1}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-stone-900">
                          {standing.name}
                        </td>
                        {tieBreaks.map((code) => (
                          <td className="py-3 pr-4 font-semibold" style={{ color: "var(--color-navy)" }} key={code}>
                            {standing.tieBreaks[code] ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="border-2 p-5" style={CARD_BASE}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px" }}>
                Ronda inicial
              </h2>
              <div className="mt-4 divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                {nextRoundPreview.round.games.map((game) => (
                  <div
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 text-sm"
                    key={game.id}
                  >
                    <span
                      className="text-[11px] font-semibold uppercase tracking-[0.1em]"
                      style={{ fontFamily: "var(--font-poster)", color: "#7a7a7a" }}
                    >
                      M{game.boardNumber}
                    </span>
                    <span className="min-w-0">
                      {getPlayerName(tournament, game.whitePlayerId)} vs{" "}
                      {getPlayerName(tournament, game.blackPlayerId)}
                    </span>
                    <span className="font-semibold" style={{ color: "var(--color-navy)" }}>
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
