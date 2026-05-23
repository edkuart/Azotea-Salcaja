import { describe, expect, it } from "vitest";

import {
  createPrivateTournamentToken,
  decodePrivateTournamentToken,
  privateDraftToTournament,
} from "./private-tournaments";

describe("private tournament tokens", () => {
  it("encodes and decodes a private tournament draft", () => {
    const token = createPrivateTournamentToken({
      title: "Torneo de amigos",
      system: "swiss",
      roundsPlanned: 3,
      playerNames: ["Ana", "Luis", "Sofia"],
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(decodePrivateTournamentToken(token)).toMatchObject({
      title: "Torneo de amigos",
      system: "swiss",
      roundsPlanned: 3,
      playerNames: ["Ana", "Luis", "Sofia"],
    });
  });

  it("converts a private draft into an unlisted tournament", () => {
    const draft = {
      title: "Rapido casual",
      system: "round_robin" as const,
      roundsPlanned: 3,
      playerNames: ["A", "B", "C", "D"],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
    const tournament = privateDraftToTournament(draft, "abc123");

    expect(tournament).toMatchObject({
      kind: "private",
      visibility: "unlisted",
      system: "round_robin",
    });
    expect(tournament.players).toHaveLength(4);
  });

  it("rejects malformed or oversized private tokens", () => {
    expect(decodePrivateTournamentToken("not-json")).toBeNull();
    expect(decodePrivateTournamentToken("x".repeat(12_001))).toBeNull();
  });

  it("sanitizes duplicate, blank and overlong player names", () => {
    const token = createPrivateTournamentToken({
      title: "Torneo",
      system: "swiss",
      roundsPlanned: 99,
      playerNames: ["Ana", "Ana", "", "Luis".repeat(30)],
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    const draft = decodePrivateTournamentToken(token);

    expect(draft?.roundsPlanned).toBe(15);
    expect(draft?.playerNames).toHaveLength(2);
    expect(draft?.playerNames[1].length).toBe(60);
  });
});
