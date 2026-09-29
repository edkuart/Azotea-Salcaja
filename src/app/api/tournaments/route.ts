import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listTournaments, storeTournament } from "@/lib/tournament-store";
import { roundRobinRoundCount } from "@/modules/chess/round-robin";
import type { ChessTournament } from "@/modules/chess/types";

export async function GET() {
  return NextResponse.json(await listTournaments());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChessTournament;
  const tournament =
    body.system === "round_robin"
      ? {
          ...body,
          roundsPlanned: roundRobinRoundCount(
            body.players.filter((player) => player.status === "active").length,
          ),
        }
      : body;
  await storeTournament(tournament);
  return NextResponse.json(tournament, { status: 201 });
}
