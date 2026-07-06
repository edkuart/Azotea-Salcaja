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
import {
  categoryDisplayName,
  describeSexCategory,
  formatAgeRange,
  getEventTournamentIds,
} from "@/modules/chess/categories";
import {
  formatTournamentStatus,
  getEffectiveTournamentStatus,
} from "@/modules/chess/public-data";
import type { ChessTournament } from "@/modules/chess/types";

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

  const tournamentIds = getEventTournamentIds(event);
  const tournaments = (
    await Promise.all(tournamentIds.map((id) => getTournament(id)))
  ).filter((t): t is ChessTournament => t != null);

  // Un torneo → ficha completa inline (retrocompat). Varios → índice de categorías.
  const singleTournament = tournaments.length === 1 ? tournaments[0] : null;
  const categories = tournaments.length >= 2 ? tournaments : null;

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

          {singleTournament && (
            <Link
              href={`/ajedrez/torneos/live/${singleTournament.id}`}
              className="btn btn-primary mt-7"
            >
              <Trophy className="h-4 w-4" aria-hidden />
              Ver torneo en vivo · Posiciones y resultados
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </Section>

        {/* Categorías del evento (varios torneos) */}
        {categories && (
          <Section className="pt-0">
            <div className="mb-6 flex items-center gap-3">
              <Trophy className="h-5 w-5" style={{ color: "var(--color-marquee)" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "30px", lineHeight: 1.02 }}>
                Categorías del torneo
              </h2>
            </div>
            <p className="mb-6 max-w-2xl text-sm leading-6" style={{ color: "#3a3a3a" }}>
              Este evento tiene {categories.length} categorías. Cada una tiene su propia tabla de
              posiciones y transmisión en vivo. Elige una para ver sus bases y resultados.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((cat) => {
                const showSex = cat.sexCategory && cat.sexCategory !== "open";
                const showAge = cat.ageMin != null || cat.ageMax != null;
                return (
                  <Link
                    key={cat.id}
                    href={`/ajedrez/torneos/live/${cat.id}`}
                    className="group flex flex-col gap-3 border-2 p-5 no-underline transition-transform hover:-translate-y-0.5"
                    style={CARD_BASE}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", lineHeight: 1.05 }}>
                        {categoryDisplayName(cat)}
                      </h3>
                      <span
                        className="shrink-0 rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                        style={{
                          fontFamily: "var(--font-poster)",
                          background: "var(--color-grain)",
                          color: "#5a5a5a",
                          border: "1px solid rgba(26,26,26,0.18)",
                        }}
                      >
                        {formatTournamentStatus(getEffectiveTournamentStatus(cat))}
                      </span>
                    </div>

                    {(showSex || showAge) && (
                      <div className="flex flex-wrap gap-2">
                        {showSex && (
                          <span
                            className="rounded-sm border px-2.5 py-1 text-xs font-medium"
                            style={{ borderColor: "var(--color-navy)", color: "var(--color-navy)" }}
                          >
                            {describeSexCategory(cat.sexCategory)}
                          </span>
                        )}
                        {showAge && (
                          <span
                            className="rounded-sm border px-2.5 py-1 text-xs font-medium"
                            style={{ borderColor: "var(--color-navy)", color: "var(--color-navy)" }}
                          >
                            {formatAgeRange(cat)}
                          </span>
                        )}
                      </div>
                    )}

                    <dl className="grid gap-1 text-sm" style={{ color: "#3a3a3a" }}>
                      {cat.entryFee && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-stone-500">Inscripción</dt>
                          <dd className="font-medium text-stone-900">{cat.entryFee}</dd>
                        </div>
                      )}
                      {cat.timeControl && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-stone-500">Ritmo</dt>
                          <dd className="font-medium text-stone-900">{cat.timeControl}</dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-3">
                        <dt className="text-stone-500">Jugadores</dt>
                        <dd className="font-medium text-stone-900">{cat.players.length}</dd>
                      </div>
                    </dl>

                    <span
                      className="mt-1 inline-flex items-center gap-2 text-sm font-semibold"
                      style={{ color: "var(--color-navy)" }}
                    >
                      Ver categoría en vivo
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                );
              })}
            </div>
          </Section>
        )}

        {/* Bases del torneo (un solo torneo) */}
        {singleTournament && (
          <Section className="pt-0">
            <TournamentBases tournament={singleTournament} showFicha />

            {/* Galería */}
            {singleTournament.gallery && singleTournament.gallery.length > 0 && (
              <div className="mt-8 max-w-3xl">
                <h3
                  className="mb-4"
                  style={{ fontFamily: "var(--font-display)", fontSize: "22px", lineHeight: 1 }}
                >
                  Galería
                </h3>
                <ImageGallery images={singleTournament.gallery} />
              </div>
            )}
          </Section>
        )}
      </main>
    </PublicLayout>
  );
}
