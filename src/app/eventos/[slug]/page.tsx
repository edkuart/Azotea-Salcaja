import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, MapPin, Trophy, ArrowRight, Navigation } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { ExpandableImage } from "@/components/media/ExpandableImage";
import { ImageGallery } from "@/components/media/ImageGallery";
import { TournamentBases } from "@/components/chess/TournamentBases";
import { db } from "@/lib/db";
import { getTournament } from "@/lib/tournament-store";
import { restaurantInfo } from "@/modules/restaurant/public-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await db().event.findUnique({ where: { slug } });
  if (!event) return {};
  return {
    title: event.title,
    description: event.description ?? undefined,
  };
}

const TYPE_LABEL: Record<string, string> = {
  restaurant: "Restaurante",
  chess: "Ajedrez",
  community: "Comunidad",
};

const CARD_BASE = {
  background: "var(--color-cream)",
  borderColor: "var(--color-ink)",
  boxShadow: "var(--shadow-card)",
} as const;

function getMapsEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=18&output=embed`;
}

function isRestaurantLocation(address: string) {
  return address.includes(restaurantInfo.shortAddress);
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await db().event.findUnique({ where: { slug } });
  if (!event || event.status !== "published") notFound();

  const tournament = event.linkedTournamentId
    ? await getTournament(event.linkedTournamentId)
    : null;

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
  const endsStr = event.endsAt
    ? event.endsAt.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })
    : null;
  const locationLabel = event.locationLabel || restaurantInfo.name;
  const locationAddress = event.locationAddress || restaurantInfo.address;
  const locationMapsUrl = event.locationMapsUrl || restaurantInfo.mapsUrl;
  const locationEmbedUrl = isRestaurantLocation(locationAddress)
    ? restaurantInfo.embedUrl
    : getMapsEmbedUrl([locationLabel, locationAddress].filter(Boolean).join(", "));

  return (
    <PublicLayout>
      <main>
        {/* Hero */}
        {event.coverImageUrl && (
          <ExpandableImage
            src={event.coverImageUrl}
            alt={event.title}
            frameClassName="h-80 w-full sm:h-96 md:h-[28rem]"
            rounded="rounded-none"
            fit="contain"
          />
        )}

        <Section>
          <span
            className="text-xs uppercase"
            style={{
              fontFamily: "var(--font-poster)",
              letterSpacing: "0.2em",
              color: "var(--color-stage)",
            }}
          >
            {TYPE_LABEL[event.type] ?? event.type}
          </span>
          <h1
            className="mt-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-4xl)",
              lineHeight: 0.97,
            }}
          >
            {event.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: "#3a3a3a" }}>
            <p className="flex items-center gap-2 capitalize">
              <CalendarDays className="h-4 w-4 shrink-0" style={{ color: "var(--color-navy)" }} />
              {dateStr} · {timeStr}
              {endsStr && ` — ${endsStr}`}
            </p>
            {(locationLabel || locationAddress) && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: "var(--color-navy)" }} />
                {locationLabel}
              </p>
            )}
          </div>

          {event.description && (
            <p
              className="mt-6 max-w-2xl whitespace-pre-line leading-7"
              style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "#2a2a2a" }}
            >
              {event.description}
            </p>
          )}

          {(locationLabel || locationAddress || locationMapsUrl) && (
            <div
              className="mt-8 grid gap-0 overflow-hidden border-2 lg:grid-cols-[1fr_1.2fr]"
              style={CARD_BASE}
            >
              <div className="p-5 sm:p-6">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--color-navy)" }}
                >
                  Ubicación del evento
                </p>
                <h2
                  className="mt-2"
                  style={{ fontFamily: "var(--font-display)", fontSize: "24px", lineHeight: 1.05 }}
                >
                  {locationLabel}
                </h2>
                {locationAddress && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6" style={{ color: "#3a3a3a" }}>
                    {locationAddress}
                  </p>
                )}
                {locationMapsUrl && (
                  <a
                    href={locationMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] transition-transform hover:-translate-y-0.5"
                    style={{
                      fontFamily: "var(--font-poster)",
                      background: "var(--color-navy)",
                      color: "var(--color-cream)",
                    }}
                  >
                    <Navigation className="h-4 w-4" aria-hidden />
                    Abrir en Google Maps
                  </a>
                )}
              </div>
              <iframe
                src={locationEmbedUrl}
                title={`Mapa de ${locationLabel}`}
                width="100%"
                height="320"
                className="min-h-80 w-full"
                style={{ border: 0, borderTop: "2px solid var(--color-ink)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}

          {tournament && (
            <Link
              href={`/ajedrez/torneos/live/${event.linkedTournamentId}`}
              className="btn btn-primary mt-7"
            >
              <Trophy className="h-4 w-4" aria-hidden />
              Ver torneo en vivo · Posiciones y resultados
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </Section>

        {/* Bases del torneo */}
        {tournament && (
          <Section className="pt-0">
            <TournamentBases tournament={tournament} showFicha />

            {/* Galería */}
            {tournament.gallery && tournament.gallery.length > 0 && (
              <div className="mt-8 max-w-3xl">
                <h3
                  className="mb-4"
                  style={{ fontFamily: "var(--font-display)", fontSize: "22px", lineHeight: 1 }}
                >
                  Galería
                </h3>
                <ImageGallery images={tournament.gallery} />
              </div>
            )}
          </Section>
        )}
      </main>
    </PublicLayout>
  );
}
