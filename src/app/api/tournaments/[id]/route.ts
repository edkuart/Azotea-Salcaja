import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getTournament,
  storeTournament,
  deleteTournament,
} from "@/lib/tournament-store";
import { officialChessTournaments } from "@/modules/chess/public-data";
import { mergeTournamentResults } from "@/modules/chess/merge";
import type { ChessTournament } from "@/modules/chess/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const t =
    (await getTournament(id)) ??
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

  // Merge con lo ya guardado: si otro árbitro registró un resultado que este
  // cliente no traía, se conserva (evita que el último en guardar lo borre).
  const existing = await getTournament(id);
  const merged = mergeTournamentResults({ ...body, id }, existing, "base");

  await storeTournament(merged);
  return NextResponse.json(merged);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteTournament(id);
  return NextResponse.json({ ok: true });
}
