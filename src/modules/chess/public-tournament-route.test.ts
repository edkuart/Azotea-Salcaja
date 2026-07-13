import { describe, expect, it } from "vitest";

import {
  getTournamentArchiveSlug,
  getTournamentPublicHref,
  resolveTournamentArchiveSlug,
} from "./public-tournament-route";

const june = {
  id: "official-june-29",
  slug: "rapid-nocturno-de-lunes",
  startsAt: "2026-06-29T19:30:00-06:00",
};

const july = {
  id: "official-july-06",
  slug: "rapid-nocturno-de-lunes",
  startsAt: "2026-07-06T19:30:00-06:00",
};

describe("public tournament routes", () => {
  it("creates distinct archive routes for repeated tournament titles", () => {
    expect(getTournamentArchiveSlug(june)).toBe(
      "rapid-nocturno-de-lunes-2026-06-29",
    );
    expect(getTournamentArchiveSlug(july)).toBe(
      "rapid-nocturno-de-lunes-2026-07-06",
    );
  });

  it("resolves each dated route to its tournament", () => {
    expect(
      resolveTournamentArchiveSlug(
        [july, june],
        "rapid-nocturno-de-lunes-2026-06-29",
      )?.id,
    ).toBe(june.id);
  });

  it("keeps the legacy ambiguous route pointing to the newest tournament", () => {
    expect(
      resolveTournamentArchiveSlug([june, july], "rapid-nocturno-de-lunes")?.id,
    ).toBe(july.id);
  });

  it("keeps live tournaments on their id route", () => {
    expect(getTournamentPublicHref({ ...july, id: "t123" })).toBe(
      "/ajedrez/torneos/live/t123",
    );
  });
});
