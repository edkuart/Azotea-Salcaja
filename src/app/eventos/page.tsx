import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Trophy } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Eventos, actividades y comunidad en Azotea Salcajá.",
};

const TYPE_LABEL: Record<string, string> = {
  restaurant: "Restaurante",
  chess: "Ajedrez",
  community: "Comunidad",
};

export default async function EventsPage() {
  const all = await db().event.findMany({
    where: { status: "published" },
    orderBy: { startsAt: "asc" },
  });

  // Próximos primero (por fecha ascendente); los pasados se conservan al final
  // (más recientes primero) para no perder el historial publicado.
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = all.filter((event) => event.startsAt >= startOfToday);
  const past = all.filter((event) => event.startsAt < startOfToday).reverse();
  const events = [...upcoming, ...past];

  return (
    <PublicLayout>
      <main>
        <Section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Actividades
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-950">
            Eventos y comunidad
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
            Espacios para comer, reunirse y participar en actividades locales.
          </p>
        </Section>

        <Section className="pt-0">
          {events.length === 0 ? (
            <p className="text-sm text-stone-500">
              No hay eventos publicados por el momento.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const dateStr = event.startsAt.toLocaleDateString("es", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                const timeStr = event.startsAt.toLocaleTimeString("es", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Link
                    key={event.id}
                    href={`/eventos/${event.slug}`}
                    className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div
                      className="flex h-52 items-center justify-center bg-stone-100"
                      style={
                        event.coverImageUrl
                          ? {
                              backgroundImage: `url(${event.coverImageUrl})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                            }
                          : undefined
                      }
                    >
                      {!event.coverImageUrl && (
                        <CalendarDays className="h-12 w-12 text-stone-300" />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                        {TYPE_LABEL[event.type] ?? event.type}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-stone-950 group-hover:text-emerald-700 transition-colors">
                        {event.title}
                      </h2>
                      <p className="mt-2 flex items-center gap-2 text-sm text-stone-500 capitalize">
                        <CalendarDays className="h-4 w-4 text-emerald-700 shrink-0" />
                        {dateStr} · {timeStr}
                      </p>
                      {event.locationLabel && (
                        <p className="mt-1 text-sm text-stone-500">
                          {event.locationLabel}
                        </p>
                      )}
                      {event.linkedTournamentId && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                          <Trophy className="h-3.5 w-3.5" />
                          Incluye torneo de ajedrez
                        </p>
                      )}
                      {event.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Section>
      </main>
    </PublicLayout>
  );
}
