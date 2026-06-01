import { describe, expect, it } from "vitest";

import { officialChessTournaments } from "./public-data";
import { calculateStandings, getColorBalance, getNextRoundBlocker } from "./standings";
import type { ChessTournament } from "./types";

describe("calculateStandings", () => {
  it("calculates points, wins, draws and losses from completed games", () => {
    const tournament = officialChessTournaments[0];
    const standings = calculateStandings(tournament);

    expect(standings[0]).toMatchObject({
      name: "Carlos Mendez",
      points: 1,
      wins: 1,
    });
    expect(standings[1]).toMatchObject({
      name: "Sofia Perez",
      points: 1,
      wins: 1,
      blackWins: 1,
    });
    expect(standings.find((standing) => standing.name === "Ana Lopez")).toMatchObject({
      points: 0.5,
      draws: 1,
    });
    expect(standings[0].tieBreaks.points).toBe(1);
    expect(standings[0].tieBreaks.buchholz_cut_1).toBeDefined();
  });

  it("counts bye points without affecting color balance", () => {
    const tournament: ChessTournament = {
      id: "bye-test",
      kind: "official",
      visibility: "published",
      title: "Bye test",
      slug: "bye-test",
      description: "Test",
      system: "swiss",
      roundsPlanned: 3,
      currentRoundNumber: 1,
      status: "active",
      startsAt: "2026-01-01",
      locationLabel: "Azotea",
      tieBreakOrder: ["points", "wins"],
      players: [
        { id: "p1", name: "Player 1", seed: 1, status: "active" },
        { id: "p2", name: "Player 2", seed: 2, status: "active" },
        { id: "p3", name: "Player 3", seed: 3, status: "active" },
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
              whitePlayerId: "p3",
              result: "bye",
              whiteScore: 1,
              blackScore: 0,
              isBye: true,
            },
          ],
        },
      ],
    };

    const byeStanding = calculateStandings(tournament).find(
      (standing) => standing.playerId === "p3",
    );

    expect(byeStanding).toMatchObject({
      points: 1,
      played: 0,
      byes: 1,
      colorHistory: ["bye"],
    });
    expect(getColorBalance(byeStanding!)).toBe(0);
  });
});

describe("getNextRoundBlocker", () => {
  it("blocks next round generation when the latest round has pending games", () => {
    const tournament = officialChessTournaments[0];

    expect(getNextRoundBlocker(tournament)).toContain("Faltan 3 resultado");
  });

  it("allows first round generation when no rounds exist", () => {
    const tournament = officialChessTournaments[1];

    expect(getNextRoundBlocker(tournament)).toBeNull();
  });
});
