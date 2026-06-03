import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const rows = await db().chessEnrollment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { childName, childAge, parentName, phone, email, experience, message } = body;

  if (!childName?.trim() || !parentName?.trim() || !phone?.trim() || !childAge) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const enrollment = await db().chessEnrollment.create({
    data: {
      childName:  childName.trim(),
      childAge:   Number(childAge),
      parentName: parentName.trim(),
      phone:      phone.trim(),
      email:      email?.trim() || null,
      experience: experience ?? "none",
      message:    message?.trim() || null,
    },
  });

  return NextResponse.json(enrollment, { status: 201 });
}
