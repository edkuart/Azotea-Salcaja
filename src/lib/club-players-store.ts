import type { ClubPlayer } from "@/modules/chess/types";
import { db } from "@/lib/db";

type ClubPlayerRow = {
  id: string;
  name: string;
  rating: number | null;
  fideId: string | null;
  title: string | null;
  sex: string | null;
  birthDate: string | null;
  photoUrl: string | null;
  notes: string | null;
  isActive: boolean;
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
    notes: row.notes ?? undefined,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toRowData(player: Partial<ClubPlayer>) {
  return {
    ...(player.name !== undefined ? { name: player.name } : {}),
    rating: player.rating ?? null,
    fideId: player.fideId ?? null,
    title: player.title ?? null,
    sex: player.sex ?? null,
    birthDate: player.birthDate ?? null,
    photoUrl: player.photoUrl ?? null,
    notes: player.notes ?? null,
    ...(player.isActive !== undefined ? { isActive: player.isActive } : {}),
  };
}

export async function listClubPlayers(): Promise<ClubPlayer[]> {
  const rows = await db().clubPlayer.findMany({
    orderBy: [{ isActive: "desc" }, { rating: { sort: "desc", nulls: "last" } }, { name: "asc" }],
  });
  return rows.map(rowToClubPlayer);
}

export async function createClubPlayer(
  player: Omit<ClubPlayer, "id" | "createdAt" | "updatedAt">,
): Promise<ClubPlayer> {
  const row = await db().clubPlayer.create({
    data: { name: player.name, ...toRowData(player) },
  });
  return rowToClubPlayer(row);
}

export async function updateClubPlayer(
  id: string,
  player: Partial<ClubPlayer>,
): Promise<ClubPlayer> {
  const row = await db().clubPlayer.update({
    where: { id },
    data: toRowData(player),
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
