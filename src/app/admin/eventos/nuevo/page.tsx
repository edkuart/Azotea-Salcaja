import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { listTournaments } from "@/lib/tournament-store";
import { createEvent } from "@/app/actions/events";
import { EventForm } from "@/components/admin/EventForm";

export default async function NewEventPage() {
  const allTournaments = await listTournaments();
  const tournaments = allTournaments.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
  }));

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Eventos"
        title="Nuevo evento"
        description="Crea un evento para el restaurante o un evento con torneo de ajedrez."
      />
      <div className="mt-8 max-w-2xl">
        <EventForm action={createEvent} tournaments={tournaments} />
      </div>
    </AdminShell>
  );
}
