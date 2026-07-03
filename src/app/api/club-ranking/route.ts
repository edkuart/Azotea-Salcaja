import { NextResponse } from "next/server";
import { listClubPlayers } from "@/lib/club-players-store";
import { listTournaments } from "@/lib/tournament-store";
import { computeClubRanking } from "@/modules/chess/club-ranking";

/** Ranking del club calculado al vuelo (ELO actual + puntos por año). */
export async function GET() {
  const [tournaments, clubPlayers] = await Promise.all([
    listTournaments(),
    listClubPlayers(),
  ]);
  return NextResponse.json(computeClubRanking(tournaments, clubPlayers));
}
