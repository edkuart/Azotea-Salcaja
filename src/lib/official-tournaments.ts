import { listClubPlayers } from "@/lib/club-players-store";
import { listTournaments } from "@/lib/tournament-store";
import { isClubAvatarId } from "@/modules/chess/avatars";
import { officialChessTournaments } from "@/modules/chess/public-data";
import type { ChessPlayer, ChessTournament } from "@/modules/chess/types";

function normalizedPlayerName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function setUniqueNameMatch(
  matches: Map<string, string | null>,
  name: string,
  playerId: string,
) {
  const key = normalizedPlayerName(name);
  if (!key) return;
  const current = matches.get(key);
  matches.set(key, current === undefined ? playerId : null);
}

function publicPhotoUrl(
  player: Awaited<ReturnType<typeof listClubPlayers>>[number],
) {
  return player.profileVisibility !== "private" &&
    player.profileVisibility !== "initials" &&
    player.showPhoto
    ? player.photoUrl
    : undefined;
}

type ClubPlayerIdentity = Pick<ChessPlayer, "photoUrl" | "avatarId">;

export async function withCurrentClubAvatars(
  tournaments: ChessTournament[],
): Promise<ChessTournament[]> {
  const clubPlayers = await listClubPlayers();
  const identityByClubPlayerId = new Map<string, ClubPlayerIdentity>();
  const uniqueClubPlayerIdByName = new Map<string, string | null>();

  for (const player of clubPlayers) {
    const identity: ClubPlayerIdentity = {
      photoUrl: publicPhotoUrl(player),
      avatarId: isClubAvatarId(player.avatarId) ? player.avatarId : undefined,
    };
    if (identity.photoUrl || identity.avatarId) {
      identityByClubPlayerId.set(player.id, identity);
      setUniqueNameMatch(uniqueClubPlayerIdByName, player.name, player.id);
      if (player.publicName) {
        setUniqueNameMatch(
          uniqueClubPlayerIdByName,
          player.publicName,
          player.id,
        );
      }
    }
  }

  return tournaments.map((tournament) => ({
    ...tournament,
    players: tournament.players.map((player) => {
      const matchedClubPlayerId =
        player.clubPlayerId ??
        uniqueClubPlayerIdByName.get(normalizedPlayerName(player.name)) ??
        undefined;
      const identity = matchedClubPlayerId
        ? identityByClubPlayerId.get(matchedClubPlayerId)
        : undefined;
      return identity ? { ...player, ...identity } : player;
    }),
  }));
}

/**
 * Fuente única de torneos OFICIALES para páginas públicas (agenda, palmarés,
 * listado de torneos, home). Combina el store con los estáticos de
 * `officialChessTournaments` y descarta torneos privados/casuales, que nunca
 * deben aparecer en superficies oficiales aunque lleguen al store.
 */
export async function listOfficialTournaments(): Promise<ChessTournament[]> {
  const stored = await listTournaments();
  const official = [
    ...stored,
    ...officialChessTournaments.filter(
      (ot) => !stored.some((s) => s.id === ot.id),
    ),
  ].filter((t) => t.kind === "official");

  return withCurrentClubAvatars(official);
}
