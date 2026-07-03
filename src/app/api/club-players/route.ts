import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClubPlayer, listClubPlayers } from "@/lib/club-players-store";
import type { ClubPlayer } from "@/modules/chess/types";

export async function GET() {
  return NextResponse.json(await listClubPlayers());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<ClubPlayer, "id">;

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const player = await createClubPlayer({
    ...body,
    name: body.name.trim(),
    isActive: body.isActive ?? true,
  });
  return NextResponse.json(player, { status: 201 });
}
