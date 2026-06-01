import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listTournaments, storeTournament } from "@/lib/tournament-store";
import type { ChessTournament } from "@/modules/chess/types";

export async function GET() {
  return NextResponse.json(await listTournaments());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChessTournament;
  await storeTournament(body);
  return NextResponse.json(body, { status: 201 });
}
