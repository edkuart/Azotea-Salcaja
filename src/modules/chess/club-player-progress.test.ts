import { describe, expect, it } from "vitest";

import { computeClubPlayerProgress } from "./club-player-progress";
import { computeClubRanking } from "./club-ranking";
import type { ChessTournament, ClubPlayer } from "./types";

const CLUB: ClubPlayer[] = [
  { id: "c1", name: "Ana", rating: 1400, isActive: true },
  { id: "c2", name: "Beto", rating: 1400, isActive: true },
  { id: "c3", name: "Carla", rating: 1300, isActive: true },
  { id: "c9", name: "Nuevo", isActive: true },
];

function makeTournament(
  overrides: Partial<ChessTournament> = {},
): ChessTournament {
  return {
    id: "t1",
    kind: "official",
    visibility: "published",
    title: "Lunes 001",
    slug: "lunes-001",
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
      {
        id: "p1",
        name: "Ana",
        rating: 1400,
        seed: 1,
        status: "active",
        clubPlayerId: "c1",
      },
      {
        id: "p2",
        name: "Beto",
        rating: 1400,
        seed: 2,
        status: "active",
        clubPlayerId: "c2",
      },
      {
        id: "p3",
        name: "Carla",
        rating: 1300,
        seed: 3,
        status: "active",
        clubPlayerId: "c3",
      },
      { id: "p4", name: "Invitado", rating: 1500, seed: 4, status: "active" },
    ],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        status: "completed",
        games: [
          {
            id: "g1",
            boardNumber: 1,
            whitePlayerId: "p1",
            blackPlayerId: "p2",
            result: "white_win",
            whiteScore: 1,
            blackScore: 0,
          },
          {
            id: "g2",
            boardNumber: 2,
            whitePlayerId: "p3",
            blackPlayerId: "p4",
            result: "black_win",
            whiteScore: 0,
            blackScore: 1,
          },
        ],
      },
    ],
    ...overrides,
  };
}

describe("computeClubPlayerProgress", () => {
  it("keeps the profile current ELO synchronized with the club ranking", () => {
    const first = makeTournament();
    const second = makeTournament({
      id: "t2",
      title: "Lunes 002",
      slug: "lunes-002",
      startsAt: "2026-07-13",
      rounds: [
        {
          id: "r1",
          roundNumber: 1,
          status: "completed",
          games: [
            {
              id: "g1",
              boardNumber: 1,
              whitePlayerId: "p1",
              blackPlayerId: "p2",
              result: "black_win",
              whiteScore: 0,
              blackScore: 1,
            },
          ],
        },
      ],
    });

    const progress = computeClubPlayerProgress(
      [second, first],
      CLUB,
      "c1",
      new Date("2026-07-20"),
    );
    const rankingEntry = computeClubRanking([second, first], CLUB).find(
      (entry) => entry.player.id === "c1",
    )!;

    expect(progress).not.toBeNull();
    expect(progress!.currentElo).toBe(rankingEntry.elo);
    expect(progress!.eloGames).toBe(rankingEntry.eloGames);
    expect(progress!.tournamentsPlayed).toBe(2);
    expect(progress!.eloSeries).toHaveLength(2);
    expect(progress!.tournaments.map((entry) => entry.tournamentSlug)).toEqual([
      "lunes-001",
      "lunes-002",
    ]);
    expect(progress!.resultTotals).toMatchObject({
      wins: 1,
      draws: 0,
      losses: 1,
    });
    expect(progress!.games).toHaveLength(2);
    expect(progress!.games[0]!.tournamentSlug).toBe("lunes-002");
  });

  it("returns a useful empty profile for a player without tournaments", () => {
    const progress = computeClubPlayerProgress(
      [],
      CLUB,
      "c9",
      new Date("2026-07-20"),
    );

    expect(progress).not.toBeNull();
    expect(progress!.currentElo).toBe(1200);
    expect(progress!.tournamentsPlayed).toBe(0);
    expect(progress!.eloSeries).toEqual([]);
    expect(progress!.goal.kind).toBe("first_tournament");
  });

  it("ignores tournaments that are not eligible for club ranking", () => {
    const notRanked = makeTournament({ id: "x1", clubRanked: undefined });
    const notFinished = makeTournament({
      id: "x2",
      status: "active",
      roundsPlanned: 3,
    });

    const progress = computeClubPlayerProgress(
      [notRanked, notFinished],
      CLUB,
      "c1",
      new Date("2026-07-20"),
    );

    expect(progress!.tournamentsPlayed).toBe(0);
    expect(progress!.eloGames).toBe(0);
    expect(progress!.currentElo).toBe(1400);
  });

  it("tracks activity windows and participation streaks from played club tournaments", () => {
    const first = makeTournament({ id: "t1", startsAt: "2026-05-04" });
    const second = makeTournament({
      id: "t2",
      title: "Lunes 002",
      slug: "lunes-002",
      startsAt: "2026-07-06",
    });
    const third = makeTournament({
      id: "t3",
      title: "Lunes 003",
      slug: "lunes-003",
      startsAt: "2026-07-13",
      players: makeTournament().players.filter(
        (player) => player.clubPlayerId !== "c1",
      ),
    });

    const progress = computeClubPlayerProgress(
      [first, second, third],
      CLUB,
      "c1",
      new Date("2026-07-20"),
    );

    expect(progress!.activity.tournaments30d).toBe(1);
    expect(progress!.activity.tournaments90d).toBe(2);
    expect(progress!.streaks.best).toBe(2);
    expect(progress!.streaks.current).toBe(0);
  });
});
