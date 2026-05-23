import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { ChessTournamentForm } from "@/components/admin/ChessTournamentForm";
import { StatusPill } from "@/components/admin/StatusPill";
import {
  getPlayerName,
  officialChessTournaments,
} from "@/modules/chess/public-data";
import { generateNextRoundPreview } from "@/modules/chess/pairings";
import { calculateStandings, getNextRoundBlocker } from "@/modules/chess/standings";
import { formatTieBreakLabel } from "@/modules/chess/tiebreaks";

export function generateStaticParams() {
  return officialChessTournaments.map((tournament) => ({ id: tournament.id }));
}

export default async function AdminChessTournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament = officialChessTournaments.find((item) => item.id === id);

  if (!tournament) {
    notFound();
  }

  const standings = calculateStandings(tournament);
  const nextRoundPreview = generateNextRoundPreview(tournament);
  const nextRoundBlocker = getNextRoundBlocker(tournament);

  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white"
              href="/admin/ajedrez/torneos"
            >
              Volver
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              href={`/admin/ajedrez/torneos/${tournament.id}/publicacion`}
            >
              Publicacion
            </Link>
          </div>
        }
        description="Base administrativa para editar torneo, jugadores, rondas, partidas y resultados."
        eyebrow="Ajedrez"
        title={tournament.title}
      />

      <div className="mt-8 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminCard>
          <h2 className="text-lg font-semibold">Configuracion</h2>
          <div className="mt-5">
            <ChessTournamentForm tournament={tournament} />
          </div>
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard>
            <h2 className="text-lg font-semibold">Tabla calculada</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-stone-200 text-xs uppercase tracking-[0.12em] text-stone-500">
                  <tr>
                    <th className="py-3 pr-4">#</th>
                    <th className="py-3 pr-4">Jugador</th>
                    {tournament.tieBreakOrder.slice(0, 5).map((code) => (
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
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-stone-950">
                          {standing.name}
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          {standing.wins}G {standing.draws}T {standing.losses}P
                        </p>
                      </td>
                      {tournament.tieBreakOrder.slice(0, 5).map((code) => (
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
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Jugadores</h2>
              <button className="h-9 rounded-md bg-stone-950 px-3 text-sm font-semibold text-white">
                Agregar
              </button>
            </div>
            <div className="mt-4 divide-y divide-stone-200">
              {tournament.players.map((player) => (
                <div
                  className="grid gap-2 py-3 text-sm sm:grid-cols-[48px_1fr_auto]"
                  key={player.id}
                >
                  <span className="font-semibold text-stone-500">
                    #{player.seed}
                  </span>
                  <span>
                    <span className="font-semibold text-stone-950">
                      {player.name}
                    </span>
                    <span className="ml-2 text-stone-500">
                      {player.rating ?? "Sin rating"}
                    </span>
                  </span>
                  <StatusPill label={player.status} />
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Rondas y resultados</h2>
              <button
                className={[
                  "h-9 rounded-md px-3 text-sm font-semibold text-white",
                  nextRoundBlocker
                    ? "bg-stone-400"
                    : "bg-emerald-700 hover:bg-emerald-800",
                ].join(" ")}
                disabled={Boolean(nextRoundBlocker)}
              >
                Generar ronda
              </button>
            </div>
            {nextRoundBlocker ? (
              <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                {nextRoundBlocker}
              </p>
            ) : null}
            <div className="mt-4 grid gap-4">
              {tournament.rounds.length > 0 ? (
                tournament.rounds.map((round) => (
                  <article
                    className="rounded-lg border border-stone-200 p-4"
                    key={round.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">
                        Ronda {round.roundNumber}
                      </h3>
                      <StatusPill label={round.status} />
                    </div>
                    <div className="mt-3 divide-y divide-stone-200">
                      {round.games.map((game) => (
                        <div
                          className="grid gap-2 py-3 text-sm lg:grid-cols-[70px_1fr_96px_92px]"
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
                            {game.result === "unplayed"
                              ? "Pendiente"
                              : `${game.whiteScore} - ${game.blackScore}`}
                          </span>
                          <button className="h-8 rounded-md border border-stone-300 px-3 text-xs font-semibold text-stone-700">
                            Resultado
                          </button>
                        </div>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-lg border border-stone-200 p-4 text-sm text-stone-600">
                  Todavia no hay rondas. En Fase 5 se conectara la generacion
                  de pareos.
                </p>
              )}
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="text-lg font-semibold">
              Vista previa de siguiente ronda
            </h2>
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
              {nextRoundPreview.round.games.length > 0 ? (
                nextRoundPreview.round.games.map((game) => (
                  <div
                    className="grid gap-2 py-3 text-sm lg:grid-cols-[70px_1fr_80px]"
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
                ))
              ) : (
                <p className="py-3 text-sm text-stone-600">
                  No hay una ronda nueva disponible.
                </p>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
