import { describe, expect, it } from "vitest";

import {
  CLUB_AVATARS,
  clubAvatarPath,
  isClubAvatarId,
} from "./avatars";

describe("club avatar catalog", () => {
  it("ships exactly fifteen unique curated avatars", () => {
    const ids = CLUB_AVATARS.map((avatar) => avatar.id);
    expect(ids).toHaveLength(15);
    expect(new Set(ids).size).toBe(15);
  });

  it("keeps the planned masculine representation ratio", () => {
    expect(
      CLUB_AVATARS.filter((avatar) => avatar.group === "masculino"),
    ).toHaveLength(13);
    expect(
      CLUB_AVATARS.filter((avatar) => avatar.group === "femenino"),
    ).toHaveLength(2);
  });

  it("resolves only allowlisted local asset paths", () => {
    expect(isClubAvatarId("chessitos-m01")).toBe(true);
    expect(isClubAvatarId("../../private-file")).toBe(false);
    expect(clubAvatarPath("chessitos-f02")).toBe(
      "/images/chessitos/avatars/chessitos-f02.webp",
    );
    expect(clubAvatarPath("../../private-file")).toBeUndefined();
  });
});
