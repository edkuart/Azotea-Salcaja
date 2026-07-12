import Link from "next/link";
import { Swords } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { ClubPlayersManager } from "@/components/admin/chess/ClubPlayersManager";
import { listClubPlayers } from "@/lib/club-players-store";
import { listTournaments } from "@/lib/tournament-store";
import { computeClubRanking } from "@/modules/chess/club-ranking";

export const dynamic = "force-dynamic";

export default async function AdminClubPlayersPage() {
  const [players, tournaments] = await Promise.all([
    listClubPlayers(),
    listTournaments(),
  ]);
  const rankingByPlayerId = new Map(
    computeClubRanking(tournaments, players).map((entry) => [
      entry.player.id,
      entry,
    ]),
  );
  const playersWithCurrentElo = players.map((player) => {
    const entry = rankingByPlayerId.get(player.id);
    return {
      ...player,
      currentElo: entry?.elo ?? player.rating,
      currentEloDelta: entry?.eloDelta ?? 0,
      currentEloGames: entry?.eloGames ?? 0,
    };
  });

  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
            href="/admin/ajedrez/torneos"
          >
            <Swords className="h-4 w-4" aria-hidden />
            Torneos
          </Link>
        }
        description="El roster permanente del club: ELO actual, foto, fecha de nacimiento y ficha ajedrecística. Desde aquí se inscriben en cada torneo nuevo."
        eyebrow="Ajedrez"
        title="Jugadores del club"
      />

      <div className="mt-8">
        <ClubPlayersManager initial={playersWithCurrentElo} />
      </div>
    </AdminShell>
  );
}
