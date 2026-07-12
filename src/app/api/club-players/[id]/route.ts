import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteClubPlayer, updateClubPlayer } from "@/lib/club-players-store";
import { requireApiSession } from "@/lib/auth/api";
import { clubPlayerUpdateSchema } from "@/modules/chess/club-player-validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const parsed = clubPlayerUpdateSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  const body = parsed.data;

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
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  await deleteClubPlayer(id);
  return NextResponse.json({ ok: true });
}
