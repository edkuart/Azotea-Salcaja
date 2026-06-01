"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteTournament } from "@/lib/tournament-store";

export async function deleteTournamentAction(id: string) {
  await deleteTournament(id);
  revalidatePath("/admin/ajedrez/torneos");
  redirect("/admin/ajedrez/torneos");
}
