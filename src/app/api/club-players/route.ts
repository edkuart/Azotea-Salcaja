import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClubPlayer, listClubPlayers } from "@/lib/club-players-store";
import { requireApiSession } from "@/lib/auth/api";
import { clubPlayerInputSchema } from "@/modules/chess/club-player-validation";

export async function GET() {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  return NextResponse.json(await listClubPlayers());
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const parsed = clubPlayerInputSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  const body = parsed.data;

  const player = await createClubPlayer({
    ...body,
    name: body.name.trim(),
    isActive: body.isActive ?? true,
    profileVisibility: body.profileVisibility ?? "private",
    showPhoto: body.showPhoto ?? false,
    showAgeBand: body.showAgeBand ?? false,
    showStats: body.showStats ?? true,
    allowSharing: body.allowSharing ?? false,
  });
  return NextResponse.json(player, { status: 201 });
}
