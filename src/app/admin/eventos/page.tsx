import Link from "next/link";
import { CalendarDays, Plus, Trophy } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { db } from "@/lib/db";
import { deleteEvent, toggleEventStatus } from "@/app/actions/events";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  restaurant: "Restaurante",
  chess: "Ajedrez",
  community: "Comunidad",
};

const STATUS_COLOR: Record<string, string> = {
  published: "var(--color-emerald, #15803d)",
  draft: "#888",
  archived: "#aaa",
};

export default async function AdminEventsPage() {
  const events = await db().event.findMany({
    orderBy: { startsAt: "desc" },
  });

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Restaurante"
        title="Eventos"
        description="Publica actividades especiales, torneos y eventos comunitarios."
        action={
          <Link
            href="/admin/eventos/nuevo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nuevo evento
          </Link>
        }
      />

      <div className="mt-8 grid gap-4">
        {events.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-stone-200 p-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-400">
              Sin eventos
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Crea el primer evento para empezar.
            </p>
          </div>
        )}

        {events.map((event) => {
          const dateStr = event.startsAt.toLocaleDateString("es", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <article
              key={event.id}
              className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 md:grid-cols-[140px_1fr_auto] md:items-center"
            >
              {event.coverImageUrl ? (
                <div
                  className="h-24 rounded-md bg-stone-100 md:h-full md:min-h-[88px]"
                  style={{
                    backgroundImage: `url(${event.coverImageUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
              ) : (
                <div className="flex h-24 items-center justify-center rounded-md bg-stone-100 md:h-full md:min-h-[88px]">
                  <CalendarDays className="h-8 w-8 text-stone-300" />
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
                  {TYPE_LABEL[event.type] ?? event.type}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-stone-950">
                  {event.title}
                </h2>
                <p className="mt-0.5 text-sm text-stone-500">{dateStr}</p>
                {event.linkedTournamentId && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                    <Trophy className="h-3 w-3" aria-hidden />
                    Torneo vinculado
                  </p>
                )}
                {event.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <StatusPill label={event.status} />
                <Link
                  href={`/admin/eventos/${event.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Editar
                </Link>
                <form
                  action={toggleEventStatus.bind(null, event.id, event.status)}
                >
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold transition"
                    style={{
                      borderColor: STATUS_COLOR[event.status],
                      color: STATUS_COLOR[event.status],
                    }}
                  >
                    {event.status === "published" ? "Despublicar" : "Publicar"}
                  </button>
                </form>
                <DeleteButton
                  action={deleteEvent.bind(null, event.id)}
                  confirm={`¿Eliminar "${event.title}"?`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 text-red-500 transition hover:bg-red-50"
                />
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
