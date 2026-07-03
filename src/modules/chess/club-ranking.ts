import { getEffectiveTournamentStatus } from "./public-data";
import { calculateStandings } from "./standings";
import type { ChessTournament, ClubPlayer } from "./types";

/**
 * Ranking del club — todo DERIVADO de los blobs de torneos, nunca almacenado.
 * Recalcular siempre desde cero evita dobles aplicaciones de ELO/puntos y
 * mantiene la consistencia si un torneo se edita o elimina después.
 *
 * Reglas:
 * - Solo cuentan torneos con `clubRanked: true` (por defecto los de lunes)
 *   y ya FINALIZADOS (status efectivo "closed", no cancelados).
 * - Los jugadores se vinculan por `clubPlayerId`; si falta (agregados a mitad
 *   de torneo escribiendo el nombre), se intenta por nombre exacto.
 * - ELO: arranca del rating base del roster (o 1200) y se recalcula partida a
 *   partida en orden cronológico. Solo partidas jugadas (no byes ni forfeits).
 * - Puntos tipo circuito (ATP): por posición final en cada torneo, acumulados
 *   por año calendario. Premia la constancia: participar siempre suma.
 */

/** Puntos por posición final (1.º, 2.º, 3.º…). Debajo de la tabla: participación. */
export const POSITION_POINTS = [100, 70, 50, 40, 30, 25, 20, 15] as const;
export const PARTICIPATION_POINTS = 10;

export const DEFAULT_ELO = 1200;
const ELO_K = 24;

/** Días sin jugar torneo del club para considerarse "inactivo" en el ranking. */
export const INACTIVITY_DAYS = 120;

export type ClubRankingEntry = {
  player: ClubPlayer;
  /** ELO actual calculado (base del roster + partidas de torneos del club). */
  elo: number;
  /** Partidas valoradas para ELO. */
  eloGames: number;
  /** Diferencia contra el rating base del roster. */
  eloDelta: number;
  tournamentsPlayed: number;
  /** Primeros lugares en torneos del club. */
  tournamentWins: number;
  lifetimePoints: number;
  /** Año ("2026") → puntos acumulados ese año. */
  yearlyPoints: Record<string, number>;
  /** Año → primeros lugares ese año. */
  yearlyWins: Record<string, number>;
  /** startsAt del último torneo del club en que jugó. */
  lastPlayedAt?: string;
};

export function pointsForPosition(index: number): number {
  return POSITION_POINTS[index] ?? PARTICIPATION_POINTS;
}

export function isClubRankedFinished(tournament: ChessTournament): boolean {
  return (
    tournament.clubRanked === true &&
    getEffectiveTournamentStatus(tournament) === "closed" &&
    tournament.rounds.some((round) => round.games.length > 0)
  );
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function tournamentYear(tournament: ChessTournament): string {
  const match = tournament.startsAt?.match(/\d{4}/);
  return match ? match[0] : "sin fecha";
}

/** Resultados que cuentan para ELO: partidas realmente jugadas. */
const ELO_RESULTS: Record<string, [number, number]> = {
  white_win: [1, 0],
  black_win: [0, 1],
  draw: [0.5, 0.5],
};

function expectedScore(own: number, opponent: number) {
  return 1 / (1 + 10 ** ((opponent - own) / 400));
}

export function computeClubRanking(
  tournaments: ChessTournament[],
  clubPlayers: ClubPlayer[],
): ClubRankingEntry[] {
  const entries = new Map<string, ClubRankingEntry>();
  for (const player of clubPlayers) {
    entries.set(player.id, {
      player,
      elo: player.rating ?? DEFAULT_ELO,
      eloGames: 0,
      eloDelta: 0,
      tournamentsPlayed: 0,
      tournamentWins: 0,
      lifetimePoints: 0,
      yearlyPoints: {},
      yearlyWins: {},
    });
  }

  const byName = new Map<string, ClubRankingEntry>();
  for (const entry of entries.values()) {
    byName.set(normalizeName(entry.player.name), entry);
  }

  const counted = tournaments
    .filter(isClubRankedFinished)
    .sort(
      (a, b) =>
        (a.startsAt ?? "").localeCompare(b.startsAt ?? "") ||
        a.id.localeCompare(b.id),
    );

  for (const tournament of counted) {
    // Vincular jugadores del torneo con el roster del club.
    const entryByTournamentPlayer = new Map<string, ClubRankingEntry>();
    for (const player of tournament.players) {
      const entry =
        (player.clubPlayerId && entries.get(player.clubPlayerId)) ||
        byName.get(normalizeName(player.name));
      if (entry) entryByTournamentPlayer.set(player.id, entry);
    }

    // Rating de referencia para cada jugador del torneo (para rivales
    // invitados se usa su rating inscrito o el default).
    const ratingOf = (playerId: string): number => {
      const clubEntry = entryByTournamentPlayer.get(playerId);
      if (clubEntry) return clubEntry.elo;
      const player = tournament.players.find((p) => p.id === playerId);
      return player?.rating ?? DEFAULT_ELO;
    };

    // ── ELO partida a partida, en orden de rondas y mesas ──
    for (const round of tournament.rounds) {
      for (const game of round.games) {
        const scores = ELO_RESULTS[game.result];
        if (!scores || !game.whitePlayerId || !game.blackPlayerId) continue;

        const whiteEntry = entryByTournamentPlayer.get(game.whitePlayerId);
        const blackEntry = entryByTournamentPlayer.get(game.blackPlayerId);
        if (!whiteEntry && !blackEntry) continue;

        const whiteRating = ratingOf(game.whitePlayerId);
        const blackRating = ratingOf(game.blackPlayerId);

        if (whiteEntry) {
          whiteEntry.elo += ELO_K * (scores[0] - expectedScore(whiteRating, blackRating));
          whiteEntry.eloGames += 1;
        }
        if (blackEntry) {
          blackEntry.elo += ELO_K * (scores[1] - expectedScore(blackRating, whiteRating));
          blackEntry.eloGames += 1;
        }
      }
    }

    // ── Puntos por posición final ──
    const year = tournamentYear(tournament);
    const standings = calculateStandings(tournament);

    standings.forEach((standing, index) => {
      const entry = entryByTournamentPlayer.get(standing.playerId);
      if (!entry) return;
      // Sin partidas ni byes no hay participación (p. ej. retirado antes de jugar).
      if (standing.played === 0 && standing.byes === 0) return;

      const points = pointsForPosition(index);
      entry.lifetimePoints += points;
      entry.yearlyPoints[year] = (entry.yearlyPoints[year] ?? 0) + points;
      entry.tournamentsPlayed += 1;
      if (index === 0) {
        entry.tournamentWins += 1;
        entry.yearlyWins[year] = (entry.yearlyWins[year] ?? 0) + 1;
      }
      if (!entry.lastPlayedAt || (tournament.startsAt ?? "") > entry.lastPlayedAt) {
        entry.lastPlayedAt = tournament.startsAt;
      }
    });
  }

  const result = [...entries.values()];
  for (const entry of result) {
    entry.elo = Math.round(entry.elo);
    entry.eloDelta = entry.elo - (entry.player.rating ?? DEFAULT_ELO);
  }

  return result.sort(
    (a, b) =>
      b.elo - a.elo ||
      b.lifetimePoints - a.lifetimePoints ||
      a.player.name.localeCompare(b.player.name, "es"),
  );
}

/** Años con actividad, más reciente primero. */
export function getRankingYears(entries: ClubRankingEntry[]): string[] {
  const years = new Set<string>();
  for (const entry of entries) {
    for (const year of Object.keys(entry.yearlyPoints)) years.add(year);
  }
  return [...years].sort().reverse();
}

/** Tabla anual (tipo circuito de tenis): puntos y victorias de un año. */
export function getAnnualTable(entries: ClubRankingEntry[], year: string) {
  return entries
    .filter((entry) => (entry.yearlyPoints[year] ?? 0) > 0)
    .map((entry) => ({
      entry,
      points: entry.yearlyPoints[year] ?? 0,
      wins: entry.yearlyWins[year] ?? 0,
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.wins - a.wins ||
        a.entry.player.name.localeCompare(b.entry.player.name, "es"),
    );
}

/** Tabla de por vida, ordenada por puntos acumulados. */
export function getLifetimeTable(entries: ClubRankingEntry[]) {
  return entries
    .filter((entry) => entry.tournamentsPlayed > 0)
    .sort(
      (a, b) =>
        b.lifetimePoints - a.lifetimePoints ||
        b.tournamentWins - a.tournamentWins ||
        a.player.name.localeCompare(b.player.name, "es"),
    );
}

/** Un jugador se considera inactivo si no juega torneo del club hace más de
 *  INACTIVITY_DAYS días. Sirve para señalarlo en el ranking sin borrar su
 *  historial; si además se desactiva en el roster, sale del ranking ELO. */
export function isEntryInactive(entry: ClubRankingEntry, now = new Date()): boolean {
  if (!entry.lastPlayedAt) return true;
  const last = new Date(entry.lastPlayedAt.slice(0, 10));
  if (Number.isNaN(last.getTime())) return true;
  const days = (now.getTime() - last.getTime()) / 86_400_000;
  return days > INACTIVITY_DAYS;
}
