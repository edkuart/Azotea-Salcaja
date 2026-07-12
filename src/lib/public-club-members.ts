import "server-only";

import { listClubPlayers } from "@/lib/club-players-store";
import { listTournaments } from "@/lib/tournament-store";
import { clubCategoryFromBirthDate } from "@/modules/chess/club-player-categories";
import {
  type ClubRankingEntry,
  computeClubRanking,
  isEntryInactive,
} from "@/modules/chess/club-ranking";
import {
  type ClubPlayerProgress,
  computeClubPlayerProgress,
} from "@/modules/chess/club-player-progress";
import type { ClubPlayer } from "@/modules/chess/types";
import type { ClubAvatarId } from "@/modules/chess/avatars";

export type PublicClubMember = {
  clubPlayerId: string;
  slug: string;
  displayName: string;
  photoUrl?: string;
  avatarId?: ClubAvatarId;
  title?: string;
  category?: string;
  memberSince?: string;
  ageBand?: string;
  allowSharing: boolean;
  stats?: {
    elo: number;
    eloDelta: number;
    eloGames: number;
    tournamentsPlayed: number;
    tournamentWins: number;
    lifetimePoints: number;
    inactive: boolean;
  };
};

export type PublicClubMemberProfile = PublicClubMember & {
  progress?: {
    currentElo: number;
    baseElo: number;
    eloDelta: number;
    peakElo: number;
    lowestElo: number;
    lastPlayedAt?: string;
    resultTotals: ClubPlayerProgress["resultTotals"];
    activity: ClubPlayerProgress["activity"];
    streaks: ClubPlayerProgress["streaks"];
    bestMarks: ClubPlayerProgress["bestMarks"];
    goal: ClubPlayerProgress["goal"];
    eloSeries: ClubPlayerProgress["eloSeries"];
    tournaments: ClubPlayerProgress["tournaments"];
    games: Array<
      Pick<
        ClubPlayerProgress["games"][number],
        | "tournamentId"
        | "tournamentSlug"
        | "tournamentTitle"
        | "startsAt"
        | "roundNumber"
        | "boardNumber"
        | "color"
        | "result"
        | "ratedForElo"
        | "eloDelta"
      >
    >;
  };
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}.`)
    .join(" ");
}

function ageBand(birthDate?: string) {
  if (!birthDate) return undefined;
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  )
    age -= 1;
  if (age < 0) return undefined;
  if (age <= 8) return "Hasta 8 años";
  if (age <= 12) return "9 a 12 años";
  if (age <= 17) return "13 a 17 años";
  return "Adulto";
}

function toPublicClubMember(
  player: ClubPlayer,
  entry: ClubRankingEntry | undefined,
): PublicClubMember {
  const anonymous = player.profileVisibility === "initials";
  return {
    clubPlayerId: player.id,
    slug: player.publicSlug!,
    displayName: anonymous
      ? initials(player.publicName || player.name)
      : player.publicName || player.name,
    photoUrl: !anonymous && player.showPhoto ? player.photoUrl : undefined,
    avatarId: player.avatarId ?? undefined,
    title: !anonymous ? player.title : undefined,
    category: clubCategoryFromBirthDate(player.birthDate),
    memberSince: player.memberSince,
    ageBand: player.showAgeBand ? ageBand(player.birthDate) : undefined,
    allowSharing: !anonymous && Boolean(player.allowSharing),
    stats:
      player.showStats && entry
        ? {
            elo: entry.elo,
            eloDelta: entry.eloDelta,
            eloGames: entry.eloGames,
            tournamentsPlayed: entry.tournamentsPlayed,
            tournamentWins: entry.tournamentWins,
            lifetimePoints: entry.lifetimePoints,
            inactive: isEntryInactive(entry),
          }
        : undefined,
  };
}

function toPublicProgress(
  progress: ClubPlayerProgress,
): PublicClubMemberProfile["progress"] {
  return {
    currentElo: progress.currentElo,
    baseElo: progress.baseElo,
    eloDelta: progress.eloDelta,
    peakElo: progress.peakElo,
    lowestElo: progress.lowestElo,
    lastPlayedAt: progress.lastPlayedAt,
    resultTotals: progress.resultTotals,
    activity: progress.activity,
    streaks: progress.streaks,
    bestMarks: progress.bestMarks,
    goal: progress.goal,
    eloSeries: progress.eloSeries,
    tournaments: progress.tournaments,
    games: progress.games.slice(0, 6).map((game) => ({
      tournamentId: game.tournamentId,
      tournamentSlug: game.tournamentSlug,
      tournamentTitle: game.tournamentTitle,
      startsAt: game.startsAt,
      roundNumber: game.roundNumber,
      boardNumber: game.boardNumber,
      color: game.color,
      result: game.result,
      ratedForElo: game.ratedForElo,
      eloDelta: game.eloDelta,
    })),
  };
}

export async function listPublicClubMembers(): Promise<PublicClubMember[]> {
  const [players, tournaments] = await Promise.all([
    listClubPlayers(),
    listTournaments(),
  ]);
  const rankingById = new Map(
    computeClubRanking(tournaments, players).map((entry) => [
      entry.player.id,
      entry,
    ]),
  );

  return players
    .filter(
      (player) =>
        player.isActive &&
        player.profileVisibility !== "private" &&
        player.publicSlug,
    )
    .map((player) => toPublicClubMember(player, rankingById.get(player.id)))
    .sort(
      (a, b) =>
        (b.stats?.elo ?? 0) - (a.stats?.elo ?? 0) ||
        a.displayName.localeCompare(b.displayName, "es"),
    );
}

export async function getPublicClubMember(slug: string) {
  const members = await listPublicClubMembers();
  return members.find((member) => member.slug === slug);
}

export async function getPublicClubMemberProfile(
  slug: string,
): Promise<PublicClubMemberProfile | undefined> {
  const [players, tournaments] = await Promise.all([
    listClubPlayers(),
    listTournaments(),
  ]);
  const player = players.find(
    (entry) =>
      entry.isActive &&
      entry.profileVisibility !== "private" &&
      entry.publicSlug === slug,
  );
  if (!player) return undefined;

  const rankingEntry = computeClubRanking(tournaments, players).find(
    (entry) => entry.player.id === player.id,
  );
  const member = toPublicClubMember(player, rankingEntry);
  const progress = player.showStats
    ? computeClubPlayerProgress(tournaments, players, player.id)
    : null;

  return {
    ...member,
    progress: progress ? toPublicProgress(progress) : undefined,
  };
}
