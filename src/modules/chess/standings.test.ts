import { describe, expect, it } from "vitest";

import { officialChessTournaments } from "./public-data";
import { calculateStandings, getNextRoundBlocker } from "./standings";

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
