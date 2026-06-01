import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getTournament,
  storeTournament,
  deleteTournament,
} from "@/lib/tournament-store";
import { officialChessTournaments } from "@/modules/chess/public-data";
import type { ChessTournament } from "@/modules/chess/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const t =
    getTournament(id) ??
    officialChessTournaments.find((tournament) => tournament.id === id);

  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(t);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as ChessTournament;
  storeTournament({ ...body, id });
  return NextResponse.json({ ...body, id });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  deleteTournament(id);
  return NextResponse.json({ ok: true });
}
