import { describe, expect, it } from "vitest";

import {
  generateNextRoundPreview,
  generateRoundRobinRounds,
  generateSwissNextRound,
} from "./pairings";
import type { ChessTournament } from "./types";

const baseTournament: ChessTournament = {
  id: "test",
  kind: "official",
  visibility: "published",
  title: "Test tournament",
  slug: "test",
  description: "Test",
  system: "swiss",
  roundsPlanned: 3,
  currentRoundNumber: 0,
  status: "active",
  startsAt: "2026-01-01 19:30",
  locationLabel: "Azotea",
  tieBreakOrder: ["points", "wins"],
  players: [
    { id: "p1", name: "Player 1", seed: 1, status: "active" },
    { id: "p2", name: "Player 2", seed: 2, status: "active" },
    { id: "p3", name: "Player 3", seed: 3, status: "active" },
    { id: "p4", name: "Player 4", seed: 4, status: "active" },
  ],
  rounds: [],
};

describe("generateRoundRobinRounds", () => {
  it("generates n - 1 rounds for an even player count", () => {
    const rounds = generateRoundRobinRounds(baseTournament.players);

    expect(rounds).toHaveLength(3);
    expect(rounds.flatMap((round) => round.games)).toHaveLength(6);
  });

  it("adds a bye when player count is odd", () => {
    const rounds = generateRoundRobinRounds([
      ...baseTournament.players,
      { id: "p5", name: "Player 5", seed: 5, status: "active" },
    ]);

    expect(rounds).toHaveLength(5);
    expect(rounds.some((round) => round.games.some((game) => game.isBye))).toBe(true);
  });
});

describe("generateSwissNextRound", () => {
  it("pairs the first swiss round by seed order", () => {
    const result = generateSwissNextRound(baseTournament);

    expect(result.warnings).toHaveLength(0);
    expect(result.round.games).toMatchObject([
      { whitePlayerId: "p1", blackPlayerId: "p2" },
      { whitePlayerId: "p3", blackPlayerId: "p4" },
    ]);
  });

  it("assigns a bye to the lowest seed without previous bye", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
      players: [
        ...baseTournament.players,
        { id: "p5", name: "Player 5", seed: 5, status: "active" },
      ],
    });

    expect(result.round.games[0]).toMatchObject({
      whitePlayerId: "p5",
      result: "bye",
      isBye: true,
    });
  });

  it("warns when there are not enough active players", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
      players: [{ id: "p1", name: "Player 1", seed: 1, status: "active" }],
    });

    expect(result.round.games).toHaveLength(0);
    expect(result.warnings[0]).toMatchObject({ code: "not_enough_players" });
  });

  it("avoids repeated pairings when generating a later round", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
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
            },
            {
              id: "g2",
              boardNumber: 2,
              whitePlayerId: "p3",
              blackPlayerId: "p4",
              result: "white_win",
            },
          ],
        },
      ],
    });

    const pairs = result.round.games.map((game) =>
      [game.whitePlayerId, game.blackPlayerId].sort().join("-"),
    );

    expect(pairs).not.toContain("p1-p2");
    expect(pairs).not.toContain("p3-p4");
  });
});

describe("generateNextRoundPreview", () => {
  it("uses round robin generation for round robin tournaments", () => {
    const result = generateNextRoundPreview({
      ...baseTournament,
      system: "round_robin",
    });

    expect(result.round.games).toHaveLength(2);
  });
});
