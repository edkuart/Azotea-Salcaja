"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { EventType, PublishStatus } from "@prisma/client";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as EventType;
  const description = formData.get("description") as string;
  const startsAt = formData.get("startsAt") as string;
  const endsAt = formData.get("endsAt") as string;
  const locationLabel = formData.get("locationLabel") as string;
  const coverImageUrl = formData.get("coverImageUrl") as string;
  const status = (formData.get("status") as PublishStatus) ?? "draft";
  const linkedTournamentId = formData.get("linkedTournamentId") as string;

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let attempt = 0;
  while (true) {
    const existing = await db().event.findUnique({ where: { slug } });
    if (!existing) break;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const event = await db().event.create({
    data: {
      title,
      slug,
      type,
      description: description || null,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      locationLabel: locationLabel || null,
      coverImageUrl: coverImageUrl || null,
      status,
      linkedTournamentId: linkedTournamentId || null,
    },
  });

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  redirect(`/admin/eventos/${event.id}`);
}

export async function updateEvent(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as EventType;
  const description = formData.get("description") as string;
  const startsAt = formData.get("startsAt") as string;
  const endsAt = formData.get("endsAt") as string;
  const locationLabel = formData.get("locationLabel") as string;
  const coverImageUrl = formData.get("coverImageUrl") as string;
  const status = formData.get("status") as PublishStatus;
  const linkedTournamentId = formData.get("linkedTournamentId") as string;

  await db().event.update({
    where: { id },
    data: {
      title,
      type,
      description: description || null,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      locationLabel: locationLabel || null,
      coverImageUrl: coverImageUrl || null,
      status,
      linkedTournamentId: linkedTournamentId || null,
    },
  });

  revalidatePath("/admin/eventos");
  revalidatePath("/admin/eventos/" + id);
  revalidatePath("/eventos");
  redirect(`/admin/eventos/${id}`);
}

export async function deleteEvent(id: string) {
  await db().event.delete({ where: { id } });
  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  redirect("/admin/eventos");
}

export async function toggleEventStatus(id: string, currentStatus: PublishStatus) {
  const next: PublishStatus = currentStatus === "published" ? "draft" : "published";
  await db().event.update({ where: { id }, data: { status: next } });
  revalidatePath("/admin/eventos");
  revalidatePath("/admin/eventos/" + id);
  revalidatePath("/eventos");
}
