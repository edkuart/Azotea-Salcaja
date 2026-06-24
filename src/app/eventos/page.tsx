import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Trophy } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { db } from "@/lib/db";
import { restaurantInfo } from "@/modules/restaurant/public-data";

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
          <span className="section-label" style={{ color: "var(--color-stage)" }}>
            Actividades
          </span>
          <h1
            className="mt-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-4xl)",
              lineHeight: 0.95,
            }}
          >
            Eventos y comunidad
          </h1>
          <p
            className="mt-4 max-w-2xl leading-7"
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", color: "#3a3a3a" }}
          >
            Espacios para comer, reunirse y participar en actividades locales.
          </p>
        </Section>

        <Section className="pt-0">
          {events.length === 0 ? (
            <p className="text-sm" style={{ color: "#5a5a5a" }}>
              No hay eventos publicados por el momento.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const locationLabel = event.locationLabel || restaurantInfo.name;
                const locationAddress = event.locationAddress || restaurantInfo.shortAddress;
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
                    className="product-card group no-underline"
                    style={{ color: "var(--color-ink)" }}
                  >
                    <div
                      className="card-img flex items-center justify-center"
                      style={
                        event.coverImageUrl
                          ? { backgroundImage: `url(${event.coverImageUrl})` }
                          : { background: "var(--color-grain)" }
                      }
                    >
                      {!event.coverImageUrl && (
                        <CalendarDays className="h-12 w-12" style={{ color: "rgba(26,26,26,0.22)" }} />
                      )}
                    </div>
                    <div className="card-body">
                      <span className="card-cat">{TYPE_LABEL[event.type] ?? event.type}</span>
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "24px",
                          lineHeight: 1.04,
                          margin: "2px 0 0",
                        }}
                      >
                        {event.title}
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-sm capitalize" style={{ color: "#5a5a5a" }}>
                        <CalendarDays className="h-4 w-4 shrink-0" style={{ color: "var(--color-navy)" }} />
                        {dateStr} · {timeStr}
                      </p>
                      {(locationLabel || locationAddress) && (
                        <p className="flex items-start gap-2 text-sm" style={{ color: "#5a5a5a" }}>
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--color-navy)" }} />
                          <span>
                            <span className="font-medium" style={{ color: "var(--color-ink)" }}>
                              {locationLabel}
                            </span>
                            {locationAddress && (
                              <span className="block leading-5">{locationAddress}</span>
                            )}
                          </span>
                        </p>
                      )}
                      {event.linkedTournamentId && (
                        <p
                          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em]"
                          style={{ fontFamily: "var(--font-poster)", color: "var(--color-marquee)" }}
                        >
                          <Trophy className="h-3.5 w-3.5" />
                          Incluye torneo de ajedrez
                        </p>
                      )}
                      {event.description && (
                        <p className="mt-1 line-clamp-3 text-sm leading-6" style={{ color: "#3a3a3a" }}>
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
