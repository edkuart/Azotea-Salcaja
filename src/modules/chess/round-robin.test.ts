import { describe, expect, it } from "vitest";

import { roundRobinRoundCount } from "./round-robin";

describe("roundRobinRoundCount", () => {
  it("uses n - 1 rounds for an even number of players", () => {
    expect(roundRobinRoundCount(8)).toBe(7);
  });

  it("uses n rounds for an odd number of players because each one has a bye", () => {
    expect(roundRobinRoundCount(7)).toBe(7);
  });

  it("keeps a valid draft value until at least two players are selected", () => {
    expect(roundRobinRoundCount(0)).toBe(1);
    expect(roundRobinRoundCount(1)).toBe(1);
  });
});
