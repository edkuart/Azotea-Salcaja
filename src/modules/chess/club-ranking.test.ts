import { describe, expect, it } from "vitest";

import {
  PARTICIPATION_POINTS,
  POSITION_POINTS,
  computeClubRanking,
  getAnnualTable,
  getLifetimeTable,
  getRankingYears,
  isEntryInactive,
} from "./club-ranking";
import type { ChessTournament, ClubPlayer } from "./types";

const CLUB: ClubPlayer[] = [
  { id: "c1", name: "Ana", rating: 1400, isActive: true },
  { id: "c2", name: "Beto", rating: 1400, isActive: true },
  { id: "c3", name: "Carla", rating: 1300, isActive: true },
];

/** Torneo de 3 jugadores del club + 1 invitado, 1 ronda, todo jugado. */
function makeTournament(overrides: Partial<ChessTournament> = {}): ChessTournament {
  return {
    id: "t1",
    kind: "official",
    visibility: "published",
    title: "Lunes",
    slug: "lunes",
    description: "",
    system: "swiss",
    roundsPlanned: 1,
    currentRoundNumber: 1,
    status: "closed",
    startsAt: "2026-07-06",
    locationLabel: "Azotea",
    tieBreakOrder: ["points", "wins"],
    clubRanked: true,
    players: [
      { id: "p1", name: "Ana", rating: 1400, seed: 1, status: "active", clubPlayerId: "c1" },
      { id: "p2", name: "Beto", rating: 1400, seed: 2, status: "active", clubPlayerId: "c2" },
      // Sin clubPlayerId: debe vincularse por nombre (agregada a mitad de torneo).
      { id: "p3", name: "Carla", rating: 1300, seed: 3, status: "active" },
      { id: "p4", name: "Invitado", rating: 1500, seed: 4, status: "active" },
    ],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        status: "completed",
        games: [
          { id: "g1", boardNumber: 1, whitePlayerId: "p1", blackPlayerId: "p2", result: "white_win", whiteScore: 1, blackScore: 0 },
          { id: "g2", boardNumber: 2, whitePlayerId: "p3", blackPlayerId: "p4", result: "black_win", whiteScore: 0, blackScore: 1 },
        ],
      },
    ],
    ...overrides,
  };
}

describe("computeClubRanking", () => {
  it("only counts finished tournaments explicitly marked clubRanked", () => {
    const notRanked = makeTournament({ id: "t-nr", clubRanked: undefined });
    const notFinished = makeTournament({
      id: "t-nf",
      status: "active",
      roundsPlanned: 3,
    });

    const entries = computeClubRanking([notRanked, notFinished], CLUB);
    expect(entries.every((entry) => entry.tournamentsPlayed === 0)).toBe(true);
    expect(entries.every((entry) => entry.eloGames === 0)).toBe(true);
  });

  it("updates elo per game: winner gains, loser drops, guests untouched", () => {
    const entries = computeClubRanking([makeTournament()], CLUB);
    const byId = new Map(entries.map((entry) => [entry.player.id, entry]));

    // Ana (1400) le ganó a Beto (1400): mismo rating → +K/2 = +12.
    expect(byId.get("c1")!.elo).toBe(1412);
    expect(byId.get("c2")!.elo).toBe(1388);
    // Carla (1300) perdió contra invitado de 1500: pierde poco (era esperado).
    expect(byId.get("c3")!.elo).toBeGreaterThan(1300 - 12);
    expect(byId.get("c3")!.elo).toBeLessThan(1300);
    expect(byId.get("c3")!.eloGames).toBe(1);
  });

  it("links tournament players without clubPlayerId by name", () => {
    const entries = computeClubRanking([makeTournament()], CLUB);
    const carla = entries.find((entry) => entry.player.id === "c3")!;
    expect(carla.tournamentsPlayed).toBe(1);
  });

  it("awards circuit points by final position and accumulates per year", () => {
    const t2026 = makeTournament();
    const t2027 = makeTournament({ id: "t2", startsAt: "2027-01-05" });
    const entries = computeClubRanking([t2026, t2027], CLUB);
    const ana = entries.find((entry) => entry.player.id === "c1")!;

    // Ana ganó ambos torneos (única con 1 punto y mejor desempate).
    expect(ana.tournamentWins).toBe(2);
    expect(ana.yearlyPoints["2026"]).toBe(POSITION_POINTS[0]);
    expect(ana.yearlyPoints["2027"]).toBe(POSITION_POINTS[0]);
    expect(ana.lifetimePoints).toBe(POSITION_POINTS[0] * 2);
    expect(getRankingYears(entries)).toEqual(["2027", "2026"]);
  });

  it("gives participation points below the scale", () => {
    expect(POSITION_POINTS.length).toBeGreaterThan(0);
    const beyond = POSITION_POINTS.length + 3;
    // pointsForPosition indirecto: la tabla anual nunca da 0 a quien jugó.
    const entries = computeClubRanking([makeTournament()], CLUB);
    const annual = getAnnualTable(entries, "2026");
    expect(annual.every((row) => row.points >= PARTICIPATION_POINTS)).toBe(true);
    expect(beyond).toBeGreaterThan(POSITION_POINTS.length);
  });

  it("builds lifetime table only with players who actually played", () => {
    const club = [...CLUB, { id: "c9", name: "Nunca Juega", isActive: true }];
    const entries = computeClubRanking([makeTournament()], club);
    const lifetime = getLifetimeTable(entries);
    expect(lifetime.some((entry) => entry.player.id === "c9")).toBe(false);
    expect(lifetime[0]!.player.id).toBe("c1"); // Ana lidera por puntos
  });

  it("flags inactivity after the threshold and for players without tournaments", () => {
    const entries = computeClubRanking([makeTournament()], CLUB);
    const ana = entries.find((entry) => entry.player.id === "c1")!;

    expect(isEntryInactive(ana, new Date("2026-08-01"))).toBe(false);
    expect(isEntryInactive(ana, new Date("2027-06-01"))).toBe(true);

    const noTournaments = computeClubRanking([], CLUB);
    expect(isEntryInactive(noTournaments[0]!, new Date("2026-08-01"))).toBe(true);
  });
});
