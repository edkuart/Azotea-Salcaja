import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { listTournaments } from "@/lib/tournament-store";
import { updateEvent } from "@/app/actions/events";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [event, allTournaments] = await Promise.all([
    db().event.findUnique({ where: { id } }),
    listTournaments(),
  ]);

  const tournaments = allTournaments.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
  }));

  if (!event) notFound();

  const action = updateEvent.bind(null, id);

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Eventos"
        title={event.title}
        description="Edita los datos del evento."
        action={
          event.status === "published" ? (
            <Link
              href={`/eventos/${event.slug}`}
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Ver público
            </Link>
          ) : undefined
        }
      />
      <div className="mt-8 max-w-2xl">
        <EventForm action={action} tournaments={tournaments} event={event} />
      </div>
    </AdminShell>
  );
}
