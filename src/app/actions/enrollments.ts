"use server";

import { revalidatePath } from "next/cache";
import type { EnrollmentStatus } from "@prisma/client";
import { db } from "@/lib/db";

export async function updateEnrollmentStatus(id: string, status: EnrollmentStatus) {
  await db().chessEnrollment.update({ where: { id }, data: { status } });
  revalidatePath("/admin/ajedrez/inscripciones");
}

export async function deleteEnrollment(id: string) {
  await db().chessEnrollment.delete({ where: { id } });
  revalidatePath("/admin/ajedrez/inscripciones");
}
