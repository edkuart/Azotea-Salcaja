import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteClubPlayer, updateClubPlayer } from "@/lib/club-players-store";
import type { ClubPlayer } from "@/modules/chess/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as Partial<ClubPlayer>;

  if (body.name !== undefined && !body.name.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  try {
    const player = await updateClubPlayer(id, {
      ...body,
      ...(body.name !== undefined ? { name: body.name.trim() } : {}),
    });
    return NextResponse.json(player);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteClubPlayer(id);
  return NextResponse.json({ ok: true });
}
