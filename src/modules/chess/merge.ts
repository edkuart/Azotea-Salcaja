import type { ChessGame, ChessTournament } from "./types";

/**
 * Combina dos versiones del torneo conservando los resultados ya decididos,
 * para soportar a varios árbitros editando en paralelo sin pisarse.
 *
 * `base` aporta la estructura (rondas, jugadores, mesas). Para cada partida se
 * conserva el resultado "más avanzado": si una versión la tiene decidida y la
 * otra en "unplayed", gana la decidida. Así ningún árbitro borra el resultado
 * que registró otro.
 *
 * `conflictWinner` decide quién gana cuando AMBAS versiones tienen un resultado
 * decidido pero distinto (conflicto real, poco frecuente).
 *
 * Usos:
 *  - Servidor (PUT): merge(incoming, stored, "base")  → conserva lo guardado por
 *    otro árbitro; ante conflicto gana quien guarda ahora.
 *  - Cliente (polling): merge(server, local, "overlay") → adopta lo nuevo del
 *    servidor sin borrar lo que el árbitro local acaba de registrar.
 */
export function mergeTournamentResults(
  base: ChessTournament,
  overlay: ChessTournament | null | undefined,
  conflictWinner: "base" | "overlay" = "base",
): ChessTournament {
  if (!overlay) return base;

  const overlayGames = new Map<string, ChessGame>();
  for (const round of overlay.rounds) {
    for (const game of round.games) {
      overlayGames.set(`${round.id}::${game.id}`, game);
    }
  }

  const rounds = base.rounds.map((round) => ({
    ...round,
    games: round.games.map((game) => {
      const other = overlayGames.get(`${round.id}::${game.id}`);
      if (!other) return game;

      const baseDecided = game.result !== "unplayed";
      const otherDecided = other.result !== "unplayed";

      if (otherDecided && !baseDecided) return other;
      if (baseDecided && !otherDecided) return game;
      if (otherDecided && baseDecided) {
        return conflictWinner === "base" ? game : other;
      }
      return game;
    }),
  }));

  return { ...base, rounds };
}

/** ¿Difieren los resultados de partidas entre dos versiones? (para evitar
 *  renders/guardados innecesarios al hacer polling). */
export function tournamentResultsEqual(
  a: ChessTournament,
  b: ChessTournament,
): boolean {
  const key = (t: ChessTournament) =>
    JSON.stringify({
      rounds: t.rounds.map((r) => ({
        id: r.id,
        games: r.games.map((g) => [g.id, g.result, g.whiteScore, g.blackScore]),
      })),
      players: t.players.map((p) => [p.id, p.status, p.seed]),
    });
  return key(a) === key(b);
}
