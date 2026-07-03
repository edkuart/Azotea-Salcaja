import { ChevronDown } from "lucide-react";

import { formatTieBreakLabel } from "@/modules/chess/tiebreaks";
import type { ChessRound, PlayerStanding, TieBreakCode } from "@/modules/chess/types";

/**
 * Tabla de posiciones responsive, sin JavaScript de cliente:
 * - En pantallas ≥ md se muestra la tabla completa (desempates + rondas).
 * - En móvil cada jugador es una fila compacta (# · nombre · pts) que se
 *   expande con <details> nativo para ver desempates y resultados por ronda.
 * Así no se pierde información: se resume y se entrega bajo demanda.
 */

type RoundCellTone = "win" | "draw" | "loss" | "bye" | "none";

const TONE_COLORS: Record<RoundCellTone, string> = {
  win: "var(--color-emerald)",
  draw: "var(--color-amber)",
  loss: "var(--color-stage)",
  bye: "var(--color-emerald)",
  none: "rgba(26,26,26,0.35)",
};

function roundCell(round: ChessRound, playerId: string): { label: string; tone: RoundCellTone } {
  const game = round.games.find(
    (g) => g.whitePlayerId === playerId || g.blackPlayerId === playerId,
  );
  if (!game) return { label: "–", tone: "none" };

  const isWhite = game.whitePlayerId === playerId;
  const score = isWhite ? game.whiteScore : game.blackScore;
  if (score === undefined) return { label: "·", tone: "none" };
  if (game.isBye || game.result === "bye") return { label: "B", tone: "bye" };
  if (score === 1) return { label: "1", tone: "win" };
  if (score === 0.5) return { label: "½", tone: "draw" };
  return { label: "0", tone: "loss" };
}

const HEADER_CELL: React.CSSProperties = {
  fontFamily: "var(--font-poster)",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontSize: 10,
  fontWeight: 400,
};

export function PlayerAvatar({
  name,
  photoUrl,
  size = 32,
}: {
  name: string;
  photoUrl?: string;
  size?: number;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt=""
        loading="lazy"
        className="shrink-0 rounded-full border-2 object-cover"
        style={{ width: size, height: size, borderColor: "var(--color-ink)" }}
      />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border-2"
      style={{
        width: size,
        height: size,
        borderColor: "rgba(26,26,26,0.35)",
        background: "var(--color-grain)",
        color: "var(--color-navy)",
        fontFamily: "var(--font-poster)",
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")}
    </span>
  );
}

export function StandingsTable({
  standings,
  tieBreakCodes,
  rounds = [],
}: {
  standings: PlayerStanding[];
  tieBreakCodes: TieBreakCode[];
  rounds?: ChessRound[];
}) {
  // "points" va en la columna/fila principal; el resto son desempates.
  const extraTieBreaks = tieBreakCodes.filter((code) => code !== "points");

  return (
    <div
      className="border-2"
      style={{
        background: "var(--color-cream)",
        borderColor: "var(--color-ink)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── Tabla completa (md en adelante) ── */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "var(--color-navy)", color: "var(--color-cream)" }}>
            <tr>
              <th className="px-4 py-3" style={HEADER_CELL}>#</th>
              <th className="px-4 py-3" style={HEADER_CELL}>Jugador</th>
              <th className="px-4 py-3 text-right" style={HEADER_CELL}>Pts</th>
              {extraTieBreaks.map((code) => (
                <th className="px-4 py-3 text-right" key={code} style={HEADER_CELL}>
                  {formatTieBreakLabel(code)}
                </th>
              ))}
              {rounds.map((round) => (
                <th className="px-2 py-3 text-center" key={round.id} style={HEADER_CELL}>
                  R{round.roundNumber}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
            {standings.map((standing, index) => (
              <tr key={standing.playerId}>
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-navy)" }}>
                  {index + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <PlayerAvatar name={standing.name} photoUrl={standing.photoUrl} />
                    <div>
                      <p className="font-semibold text-stone-900">{standing.name}</p>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {standing.wins}G {standing.draws}T {standing.losses}P
                        {standing.rating ? ` · ${standing.rating}` : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  className="px-4 py-3 text-right font-bold"
                  style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-navy)" }}
                >
                  {standing.points}
                </td>
                {extraTieBreaks.map((code) => (
                  <td
                    className="px-4 py-3 text-right font-semibold"
                    key={code}
                    style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-navy)" }}
                  >
                    {standing.tieBreaks[code] ?? 0}
                  </td>
                ))}
                {rounds.map((round) => {
                  const cell = roundCell(round, standing.playerId);
                  return (
                    <td className="px-2 py-3 text-center" key={round.id}>
                      <span
                        className="text-xs font-bold"
                        style={{ fontFamily: "ui-monospace, monospace", color: TONE_COLORS[cell.tone] }}
                      >
                        {cell.label}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Lista compacta expandible (móvil) ── */}
      <div className="md:hidden">
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ background: "var(--color-navy)", color: "var(--color-cream)" }}
        >
          <span className="w-6 text-center" style={HEADER_CELL}>#</span>
          <span className="flex-1" style={HEADER_CELL}>Jugador</span>
          <span style={HEADER_CELL}>Pts</span>
          <span className="w-4" aria-hidden />
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
          {standings.map((standing, index) => (
            <details className="group" key={standing.playerId}>
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span
                  className="w-6 text-center font-semibold"
                  style={{ color: "var(--color-navy)" }}
                >
                  {index + 1}
                </span>
                <PlayerAvatar name={standing.name} photoUrl={standing.photoUrl} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-stone-900">
                    {standing.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-stone-500">
                    {standing.wins}G {standing.draws}T {standing.losses}P
                    {standing.rating ? ` · ${standing.rating}` : ""}
                  </span>
                </span>
                <span
                  className="text-base font-bold"
                  style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-navy)" }}
                >
                  {standing.points}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>

              <div className="px-4 pb-4 pt-1" style={{ background: "var(--color-grain)" }}>
                {extraTieBreaks.length > 0 && (
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3">
                    {extraTieBreaks.map((code) => (
                      <div className="flex items-baseline justify-between gap-2" key={code}>
                        <dt
                          className="text-[10px] uppercase text-stone-500"
                          style={{ fontFamily: "var(--font-poster)", letterSpacing: "0.14em" }}
                        >
                          {formatTieBreakLabel(code)}
                        </dt>
                        <dd
                          className="text-sm font-semibold"
                          style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-navy)" }}
                        >
                          {standing.tieBreaks[code] ?? 0}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {rounds.length > 0 && (
                  <div className="mt-3">
                    <p
                      className="text-[10px] uppercase text-stone-500"
                      style={{ fontFamily: "var(--font-poster)", letterSpacing: "0.14em" }}
                    >
                      Rondas
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {rounds.map((round) => {
                        const cell = roundCell(round, standing.playerId);
                        return (
                          <span
                            className="inline-flex min-w-9 items-center justify-center gap-1 border px-1.5 py-1 text-[11px] font-bold"
                            key={round.id}
                            style={{
                              fontFamily: "ui-monospace, monospace",
                              borderColor: "rgba(26,26,26,0.18)",
                              background: "var(--color-cream)",
                              color: TONE_COLORS[cell.tone],
                            }}
                          >
                            <span className="font-normal text-stone-400">R{round.roundNumber}</span>
                            {cell.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
