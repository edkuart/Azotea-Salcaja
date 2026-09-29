import { describe, expect, it } from "vitest";

import {
  clubPlayerInputSchema,
  clubPlayerUpdateSchema,
} from "./club-player-validation";

describe("clubPlayerInputSchema", () => {
  it("accepts a player without optional profile fields", () => {
    const result = clubPlayerInputSchema.safeParse({
      name: "Pablo Batz",
      avatarId: null,
      profileVisibility: "private",
      showPhoto: false,
      showAgeBand: false,
      showStats: true,
      allowSharing: false,
    });

    expect(result.success).toBe(true);
  });

  it("accepts the tournament data used to register Miguel Mazariegos", () => {
    const result = clubPlayerInputSchema.safeParse({
      name: "Miguel Mazariegos",
      rating: 1770,
      sex: "M",
      birthDate: "1994-07-22",
      avatarId: null,
      profileVisibility: "private",
      showPhoto: false,
      showAgeBand: false,
      showStats: true,
      allowSharing: false,
    });

    expect(result.success).toBe(true);
  });

  it("normalizes blank and null optional text fields", () => {
    const result = clubPlayerInputSchema.parse({
      name: "Pablo Batz",
      fideId: "",
      title: null,
      notes: "   ",
    });

    expect(result).toMatchObject({
      name: "Pablo Batz",
      fideId: undefined,
      title: undefined,
      notes: undefined,
    });
  });
});

describe("clubPlayerUpdateSchema", () => {
  it("accepts an update containing only one field", () => {
    expect(clubPlayerUpdateSchema.safeParse({ isActive: false }).success).toBe(
      true,
    );
  });
});
