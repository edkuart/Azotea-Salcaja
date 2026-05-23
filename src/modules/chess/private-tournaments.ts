import type {
  ChessPlayer,
  ChessTournament,
  PrivateTournamentDraft,
  TournamentSystem,
} from "./types";
import {
  privateTournamentDraftSchema,
  sanitizePrivatePlayerNames,
} from "./validation";

const maxTokenLength = 12_000;

const defaultTieBreaks = {
  swiss: ["points", "progressive", "buchholz", "median_buchholz"],
  round_robin: ["points", "sonneborn_berger", "direct_encounter", "wins"],
} as const;

function base64UrlEncode(value: string) {
  if (typeof window !== "undefined") {
    return window
      .btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  if (typeof window !== "undefined") {
    return decodeURIComponent(escape(window.atob(padded)));
  }

  return Buffer.from(padded, "base64").toString("utf8");
}

export function createPrivateTournamentToken(draft: PrivateTournamentDraft) {
  const payload = privateTournamentDraftSchema.parse({
    ...draft,
    playerNames: sanitizePrivatePlayerNames(draft.playerNames),
  });

  return base64UrlEncode(JSON.stringify(payload));
}

export function decodePrivateTournamentToken(token: string) {
  try {
    if (!token || token.length > maxTokenLength) {
      return null;
    }

    const parsed = JSON.parse(base64UrlDecode(token)) as unknown;
    const result = privateTournamentDraftSchema.safeParse(parsed);

    if (!result.success) {
      return null;
    }

    return result.data satisfies PrivateTournamentDraft;
  } catch {
    return null;
  }
}

export function privateDraftToTournament(
  draft: PrivateTournamentDraft,
  token: string,
): ChessTournament {
  const players: ChessPlayer[] = draft.playerNames.map((name, index) => ({
    id: `private-p${index + 1}`,
    name,
    seed: index + 1,
    status: "active",
  }));

  return {
    id: `private-${token.slice(0, 12)}`,
    kind: "private",
    visibility: "unlisted",
    title: draft.title,
    slug: token,
    description:
      "Torneo casual creado por link. No es un evento oficial publicado por Azotea Salcaja.",
    recap:
      "Torneo privado/no oficial para uso rapido entre amigos o grupos pequenos.",
    system: draft.system as TournamentSystem,
    roundsPlanned: draft.roundsPlanned,
    currentRoundNumber: 0,
    status: "setup",
    startsAt: draft.createdAt,
    locationLabel: "Torneo privado",
    tieBreakOrder: [...defaultTieBreaks[draft.system]],
    players,
    rounds: [],
  };
}
