import "server-only";

import type { ClubPlayer, ClubProfileVisibility } from "@/modules/chess/types";
import { db } from "@/lib/db";
import {
  clubCategoryFromBirthDate,
  localDateInputValue,
} from "@/modules/chess/club-player-categories";
import { isClubAvatarId } from "@/modules/chess/avatars";

type ClubPlayerRow = {
  id: string;
  name: string;
  rating: number | null;
  fideId: string | null;
  title: string | null;
  sex: string | null;
  birthDate: string | null;
  photoUrl: string | null;
  avatarId: string | null;
  notes: string | null;
  isActive: boolean;
  publicSlug: string | null;
  publicName: string | null;
  memberSince: string | null;
  clubCategory: string | null;
  profileVisibility: string;
  showPhoto: boolean;
  showAgeBand: boolean;
  showStats: boolean;
  allowSharing: boolean;
  consentRecordedAt: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function rowToClubPlayer(row: ClubPlayerRow): ClubPlayer {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating ?? undefined,
    fideId: row.fideId ?? undefined,
    title: row.title ?? undefined,
    sex: row.sex === "M" || row.sex === "F" ? row.sex : undefined,
    birthDate: row.birthDate ?? undefined,
    photoUrl: row.photoUrl ?? undefined,
    avatarId: isClubAvatarId(row.avatarId) ? row.avatarId : undefined,
    notes: row.notes ?? undefined,
    isActive: row.isActive,
    publicSlug: row.publicSlug ?? undefined,
    publicName: row.publicName ?? undefined,
    memberSince: row.memberSince ?? undefined,
    clubCategory: clubCategoryFromBirthDate(row.birthDate ?? undefined),
    profileVisibility: (["private", "initials", "public"] as const).includes(
      row.profileVisibility as ClubProfileVisibility,
    )
      ? (row.profileVisibility as ClubProfileVisibility)
      : "private",
    showPhoto: row.showPhoto,
    showAgeBand: row.showAgeBand,
    showStats: row.showStats,
    allowSharing: row.allowSharing,
    consentRecordedAt: row.consentRecordedAt ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toRowData(player: Partial<ClubPlayer>) {
  const nextBirthDate = player.birthDate;
  return {
    ...(player.name !== undefined ? { name: player.name } : {}),
    ...(player.rating !== undefined ? { rating: player.rating ?? null } : {}),
    ...(player.fideId !== undefined ? { fideId: player.fideId ?? null } : {}),
    ...(player.title !== undefined ? { title: player.title ?? null } : {}),
    ...(player.sex !== undefined ? { sex: player.sex ?? null } : {}),
    ...(player.birthDate !== undefined
      ? { birthDate: player.birthDate ?? null }
      : {}),
    ...(player.photoUrl !== undefined
      ? { photoUrl: player.photoUrl ?? null }
      : {}),
    ...(player.avatarId !== undefined
      ? { avatarId: player.avatarId ?? null }
      : {}),
    ...(player.notes !== undefined ? { notes: player.notes ?? null } : {}),
    ...(player.publicName !== undefined
      ? { publicName: player.publicName ?? null }
      : {}),
    ...(player.memberSince !== undefined
      ? { memberSince: player.memberSince ?? null }
      : {}),
    ...(nextBirthDate !== undefined
      ? { clubCategory: clubCategoryFromBirthDate(nextBirthDate) }
      : {}),
    ...(player.profileVisibility !== undefined
      ? { profileVisibility: player.profileVisibility }
      : {}),
    ...(player.showPhoto !== undefined ? { showPhoto: player.showPhoto } : {}),
    ...(player.showAgeBand !== undefined
      ? { showAgeBand: player.showAgeBand }
      : {}),
    ...(player.showStats !== undefined ? { showStats: player.showStats } : {}),
    ...(player.allowSharing !== undefined
      ? { allowSharing: player.allowSharing }
      : {}),
    ...(player.consentRecordedAt !== undefined
      ? { consentRecordedAt: player.consentRecordedAt ?? null }
      : {}),
    ...(player.isActive !== undefined ? { isActive: player.isActive } : {}),
  };
}

function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "miembro"
  );
}

async function uniquePublicSlug(name: string, excludingId?: string) {
  const base = slugify(name);
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? base : `${base}-${suffix + 1}`;
    const existing = await db().clubPlayer.findUnique({
      where: { publicSlug: candidate },
    });
    if (!existing || existing.id === excludingId) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function listClubPlayers(): Promise<ClubPlayer[]> {
  const rows = await db().clubPlayer.findMany({
    orderBy: [
      { isActive: "desc" },
      { rating: { sort: "desc", nulls: "last" } },
      { name: "asc" },
    ],
  });
  return rows.map(rowToClubPlayer);
}

export async function createClubPlayer(
  player: Omit<ClubPlayer, "id" | "createdAt" | "updatedAt">,
): Promise<ClubPlayer> {
  const row = await db().clubPlayer.create({
    data: {
      name: player.name,
      ...toRowData(player),
      memberSince: player.memberSince ?? localDateInputValue(),
      clubCategory: clubCategoryFromBirthDate(player.birthDate),
      publicSlug: await uniquePublicSlug(player.publicName || player.name),
    },
  });
  return rowToClubPlayer(row);
}

export async function updateClubPlayer(
  id: string,
  player: Partial<ClubPlayer>,
): Promise<ClubPlayer> {
  const current = await db().clubPlayer.findUniqueOrThrow({ where: { id } });
  const row = await db().clubPlayer.update({
    where: { id },
    data: {
      ...toRowData(player),
      ...(!current.publicSlug
        ? {
            publicSlug: await uniquePublicSlug(
              player.publicName || player.name || current.name,
              id,
            ),
          }
        : {}),
    },
  });
  return rowToClubPlayer(row);
}

export async function deleteClubPlayer(id: string): Promise<void> {
  try {
    await db().clubPlayer.delete({ where: { id } });
  } catch {
    /* already deleted */
  }
}
