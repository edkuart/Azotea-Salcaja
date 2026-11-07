import Link from "next/link";
import Image from "next/image";
import { ImageGallery } from "@/components/media/ImageGallery";
import { ArrowRight, CalendarDays } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { chessCommunity } from "@/modules/chess/public-data";
import { computeClubRanking } from "@/modules/chess/club-ranking";
import { listClubPlayers } from "@/lib/club-players-store";
import { listTournaments } from "@/lib/tournament-store";
import { db } from "@/lib/db";
import {
  featuredProducts,
  menuCategories,
  restaurantInfo,
} from "@/modules/restaurant/public-data";

export const dynamic = "force-dynamic";

const heroQuickLinks = [
  {
    href: "/ajedrez",
    label: "Torneos",
    detail: "Sistema suizo · libre y sub-18",
  },
  {
    href: "/ajedrez/clases",
    label: "Clases",
    detail: "Programa Chessitos para niños",
  },
  {
    href: "/ajedrez/club",
    label: "Ranking",
    detail: "ELO y circuito anual del club",
  },
  {
    href: "/ajedrez/agenda",
    label: "Agenda",
    detail: "Próximas fechas y horarios",
  },
];

export default async function Home() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [upcomingEvents, tournaments, clubPlayers] = await Promise.all([
    db().event.findMany({
      where: { status: "published", startsAt: { gte: startOfToday } },
      orderBy: { startsAt: "asc" },
      take: 1,
    }),
    listTournaments(),
    listClubPlayers(),
  ]);

  const rankingEntries = computeClubRanking(tournaments, clubPlayers);
  const topPlayers = rankingEntries
    .filter((entry) => entry.player.isActive && entry.tournamentsPlayed > 0)
    .sort(
      (a, b) =>
        b.elo - a.elo || a.player.name.localeCompare(b.player.name, "es"),
    )
    .slice(0, 5);

  return (
    <PublicLayout>
      <main>

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden border-b-[3px] pt-16 pb-20 sm:pt-20 sm:pb-24"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderColor: "var(--color-stage)",
          }}
        >
          {/* Ghost typography watermark */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-22%",
              left: "-6%",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(14rem, 28vw, 26rem)",
              lineHeight: 0.8,
              color: "var(--color-cream)",
              opacity: 0.045,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            CHESS
          </div>

          <Image
            src="/images/chessitos/comunidad/club-0.jpg"
            alt="Jugadores de Chessitos comparten una partida en Azotea Salcajá"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[center_40%]"
          />

          {/* Scrim para garantizar contraste del texto sobre el emblema */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ background: "linear-gradient(90deg, rgba(13,18,20,0.94) 0%, rgba(13,18,20,0.78) 45%, rgba(13,18,20,0.4) 100%)" }}
          />

          {/* Content */}
          <div
            className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
          >
            <span
              className="section-label reveal"
              style={{ color: "var(--color-marquee)" }}
            >
              Comunidad de ajedrez · Salcajá, Guatemala
            </span>

            <h1
              className="reveal"
              data-reveal-delay="80"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-hero)",
                lineHeight: 0.92,
                margin: "22px 0 0",
                maxWidth: "18ch",
              }}
            >
              Chess
              <em
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  color: "var(--color-stage)",
                }}
              >
                itos
              </em>
            </h1>

            <p
              className="reveal"
              data-reveal-delay="160"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-lg)",
                lineHeight: 1.55,
                maxWidth: "52ch",
                marginTop: "22px",
                opacity: 0.88,
              }}
            >
              Torneos, clases y comunidad de ajedrez en Salcajá. Organizamos
              eventos cada lunes con categorías libre y sub-18.
            </p>

            <div
              className="reveal flex flex-col gap-3 sm:flex-row"
              data-reveal-delay="240"
              style={{ marginTop: "30px" }}
            >
              <Link href="/ajedrez" className="btn btn-primary">
                Conoce la comunidad
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/ajedrez/clases" className="btn btn-secondary"
                style={{ color: "var(--color-cream)", borderColor: "var(--color-cream)" }}
              >
                Clases Chessitos
              </Link>
            </div>

            {/* Accesos directos: lo que la gente viene a buscar, sin scroll */}
            <nav
              className="reveal mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
              data-reveal-delay="320"
              aria-label="Accesos directos de ajedrez"
            >
              {heroQuickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group border-l-4 py-2 pl-4 no-underline transition-transform hover:-translate-y-0.5"
                  style={{ borderColor: "var(--color-marquee)" }}
                >
                  <p
                    className="eyebrow flex items-center gap-2"
                    style={{ color: "var(--color-marquee)" }}
                  >
                    {link.label}
                    <ArrowRight
                      className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </p>
                  <p
                    className="mt-1.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-cream)",
                      opacity: 0.85,
                    }}
                  >
                    {link.detail}
                  </p>
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className="section-restaurant py-16 sm:py-20" aria-labelledby="comunidad-fotos">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="section-label" style={{ color: "var(--color-stage)" }}>Así se vive Chessitos</span>
                <h2 id="comunidad-fotos" className="mt-4" style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", lineHeight: 1 }}>Tu próxima partida empieza aquí.</h2>
                <p className="mt-4 max-w-[56ch] leading-7">Un tablero, nuevos amigos y muchas ganas de jugar. Conoce los encuentros y las premiaciones de nuestra comunidad en Salcajá.</p>
              </div>
              <Link href="/ajedrez/agenda" className="btn btn-primary shrink-0">Ven a jugar <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <ImageGallery
              fit="cover"
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              images={[
                { src: "/images/chessitos/comunidad/club-94.jpg", alt: "Concentración frente al tablero" },
                { src: "/images/chessitos/comunidad/club-59.jpg", alt: "Una jornada de partidas en el club" },
                { src: "/images/chessitos/comunidad/club-130.jpg", alt: "Jugadores con sus trofeos en Azotea Salcajá" },
                { src: "/images/chessitos/comunidad/club-23.jpg", alt: "Los tableros listos para jugar" },
                { src: "/images/chessitos/comunidad/club-118.jpg", alt: "Encuentro de ajedrez en la sede del club" },
                { src: "/images/chessitos/comunidad/club-35.jpg", alt: "Participantes durante una premiación" },
              ]}
            />
          </div>
        </section>

        {/* ── RANKING DEL CLUB ── */}
        <section className="section-chess py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <span
                  className="section-label reveal"
                  style={{ color: "var(--color-gold)" }}
                >
                  El club en vivo
                </span>
                <h2
                  className="reveal mt-4"
                  data-reveal-delay="80"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-3xl)",
                    lineHeight: 1,
                    color: "var(--color-board)",
                  }}
                >
                  Ranking Chessitos.
                </h2>
                <p
                  className="reveal mt-4 max-w-[52ch] leading-7 opacity-85"
                  data-reveal-delay="160"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-board)",
                  }}
                >
                  ELO del club y circuito anual de puntos, calculados torneo a
                  torneo. Cada lunes suma · {chessCommunity.schedule}
                </p>
                <div
                  className="reveal mt-8 flex flex-col gap-3 sm:flex-row"
                  data-reveal-delay="240"
                >
                  <Link href="/ajedrez/club" className="btn btn-primary">
                    Ranking completo
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href="/ajedrez/ranking"
                    className="btn btn-secondary"
                    style={{
                      color: "var(--color-gold)",
                      borderColor: "var(--color-gold)",
                    }}
                  >
                    Palmarés
                  </Link>
                </div>
              </div>

              {topPlayers.length > 0 ? (
                <ol className="grid grid-cols-1 gap-0" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {topPlayers.map((entry, i) => (
                    <li
                      key={entry.player.id}
                      className="reveal flex min-w-0 items-baseline gap-4 border-b py-3.5"
                      data-reveal-delay={String(i * 60)}
                      style={{ borderColor: "rgba(240,217,181,0.2)" }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-poster)",
                          fontSize: "var(--text-sm)",
                          letterSpacing: "0.1em",
                          color: "var(--color-gold)",
                          minWidth: "2ch",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="flex-1 truncate"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-xl)",
                          lineHeight: 1.1,
                          color: "var(--color-board)",
                        }}
                      >
                        {entry.player.name}
                      </span>
                      <span
                        className="shrink-0 opacity-70"
                        style={{
                          fontFamily: "var(--font-poster)",
                          fontSize: "var(--text-xs)",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--color-board)",
                        }}
                      >
                        {entry.tournamentsPlayed}{" "}
                        {entry.tournamentsPlayed === 1 ? "torneo" : "torneos"}
                      </span>
                      <span
                        className="shrink-0"
                        style={{
                          fontFamily: "var(--font-poster)",
                          fontSize: "var(--text-lg)",
                          letterSpacing: "0.04em",
                          color: "var(--color-gold)",
                        }}
                      >
                        {entry.elo}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="grid grid-cols-1 gap-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {chessCommunity.features.map((feature, i) => (
                    <li
                      key={feature}
                      className="reveal border-l-4 py-2.5 pl-5"
                      data-reveal-delay={String(i * 60)}
                      style={{
                        borderColor: "var(--color-gold)",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-base)",
                        color: "var(--color-board)",
                      }}
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        <section className="section-restaurant py-16 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <span
              className="section-label reveal"
              style={{ color: "var(--color-stage)" }}
            >
              Próximos eventos
            </span>
            <h2
              className="reveal mt-4"
              data-reveal-delay="80"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-3xl)",
                lineHeight: 1,
              }}
            >
              Eventos y comunidad.
            </h2>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {/* Card 1: Comunidad */}
              <article
                className="event-card featured reveal"
                data-reveal-delay="0"
              >
                <span className="eyebrow">Comunidad · Lunes</span>
                <h3 className="card-title">{chessCommunity.title}</h3>
                <span className="card-when">Todos los lunes · {chessCommunity.schedule}</span>
                <p className="card-desc">{chessCommunity.description}</p>
                <div className="mt-2">
                  <Link
                    href="/ajedrez"
                    className="btn btn-secondary"
                    style={{ color: "var(--color-cream)", borderColor: "var(--color-cream)" }}
                  >
                    Ver comunidad
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </article>

              {/* Card 2: Clases (estático) */}
              <article
                className="event-card reveal"
                data-reveal-delay="80"
                style={{
                  background: "var(--color-ink)",
                  color: "var(--color-cream)",
                  borderColor: "var(--color-ink)",
                }}
              >
                <span
                  className="eyebrow"
                  style={{ color: "var(--color-marquee)" }}
                >
                  Clases · Principiantes
                </span>
                <h3
                  className="card-title"
                  style={{ color: "var(--color-cream)" }}
                >
                  Clases Chessitos
                </h3>
                <span
                  className="card-when"
                  style={{ color: "rgba(255,253,208,0.65)" }}
                >
                  Lunes · 5:30 – 7:30 PM
                </span>
                <p
                  className="card-desc"
                  style={{ color: "rgba(255,253,208,0.75)" }}
                >
                  Programa de ajedrez para niños principiantes.
                  3 meses de fundamentos, táctica y estrategia.
                </p>
                <div className="mt-2">
                  <Link
                    href="/ajedrez/clases"
                    className="btn btn-secondary"
                    style={{ color: "var(--color-marquee)", borderColor: "var(--color-marquee)" }}
                  >
                    Ver programa
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </article>

              {/* Card 3: DB events */}
              {upcomingEvents.map((event, i) => {
                const dateStr = event.startsAt.toLocaleDateString("es", {
                  weekday: "long", day: "numeric", month: "short",
                });
                const timeStr = event.startsAt.toLocaleTimeString("es", {
                  hour: "2-digit", minute: "2-digit",
                });
                return (
                  <Link
                    key={event.id}
                    href={`/eventos/${event.slug}`}
                    className="event-card reveal no-underline"
                    data-reveal-delay={String((i + 1) * 80)}
                    style={{ display: "flex", flexDirection: "column", padding: 0 }}
                  >
                    {event.coverImageUrl && (
                      <div
                        className="h-48 shrink-0 border-b-2 border-[var(--color-ink)]"
                        style={{
                          backgroundImage: `url(${event.coverImageUrl})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      />
                    )}
                    <div style={{ padding: "22px 26px", display: "grid", gap: "12px", flex: 1 }}>
                      <span className="eyebrow" style={{ textTransform: "uppercase" }}>
                        {event.type === "chess" ? "Ajedrez" : event.type === "restaurant" ? "Restaurante" : "Comunidad"}
                      </span>
                      <h3 className="card-title" style={{ margin: 0 }}>{event.title}</h3>
                      <span className="card-when flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        <span className="capitalize">{dateStr}</span> · {timeStr}
                      </span>
                      {event.description && (
                        <p className="card-desc line-clamp-3" style={{ margin: 0 }}>{event.description}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 text-right">
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 no-underline transition-opacity hover:opacity-70"
                style={{
                  fontFamily: "var(--font-poster)",
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--color-stage)",
                }}
              >
                Ver todos los eventos
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* ── LA SEDE: AZOTEA SALCAJÁ (compacto) ── */}
        <section
          className="section-events py-14 sm:py-16"
          style={{ borderTop: "3px solid var(--color-ink)" }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span
                  className="section-label reveal"
                  style={{ color: "var(--color-marquee)" }}
                >
                  Azotea Salcajá · Sede y patrocinador
                </span>
                <h2
                  className="reveal mt-4"
                  data-reveal-delay="80"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-3xl)",
                    lineHeight: 1,
                  }}
                >
                  La casa del club.
                </h2>
                <p
                  className="reveal mt-3 max-w-[52ch] leading-7 opacity-85"
                  data-reveal-delay="160"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                  }}
                >
                  Cada lunes jugamos en el restaurante Azotea. Menú con fotos y
                  precios visibles — pedidos por WhatsApp, sin carrito.
                </p>
              </div>
              <Link
                href="/menu"
                className="btn btn-poster reveal shrink-0"
                data-reveal-delay="80"
              >
                Ver menú completo
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            {/* Destacados en formato compacto: una fila por producto */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {featuredProducts.map((product, i) => {
                const duotones = ["duotone-gold", "duotone-night"];
                const duotone = duotones[i % duotones.length];
                return (
                  <article
                    key={product.name}
                    className="reveal flex items-center gap-4 border-2 p-3"
                    data-reveal-delay={String(i * 80)}
                    style={{
                      background: "var(--color-cream)",
                      color: "var(--color-ink)",
                      borderColor: "var(--color-ink)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <div
                      className={`h-16 w-16 shrink-0 border-2 ${duotone}`}
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderColor: "var(--color-ink)",
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-xl)",
                          lineHeight: 1.1,
                        }}
                      >
                        {product.name}
                      </p>
                      <p
                        className="mt-0.5 opacity-70"
                        style={{
                          fontFamily: "var(--font-poster)",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                        }}
                      >
                        {product.category}
                      </p>
                    </div>
                    <p
                      className="shrink-0"
                      style={{
                        fontFamily: "var(--font-poster)",
                        fontSize: "var(--text-lg)",
                        letterSpacing: "0.02em",
                        color: "var(--color-stage)",
                      }}
                    >
                      {product.price}
                    </p>
                  </article>
                );
              })}
            </div>

            {/* Categorías del menú como chips */}
            <div className="reveal mt-6 flex flex-wrap gap-2" data-reveal-delay="160">
              {menuCategories.map((category) => (
                <Link
                  key={category.name}
                  href="/menu"
                  className="border-2 px-4 py-1.5 no-underline transition-transform hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-poster)",
                    fontSize: "var(--text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "var(--color-cream)",
                    borderColor: "rgba(255,253,208,0.5)",
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHATSAPP CTA ── */}
        <section
          className="section-night py-14"
          style={{ borderTop: "3px solid var(--color-ink)" }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className="eyebrow"
                  style={{ color: "var(--color-marquee)" }}
                >
                  Contacto rápido
                </p>
                <h2
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-2xl)",
                    lineHeight: 1.1,
                  }}
                >
                  Pregunta por torneos, clases o el menú.
                </h2>
              </div>
              <a
                href={`https://wa.me/${restaurantInfo.whatsapp}`}
                className="btn btn-poster shrink-0"
                rel="noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>

      </main>
    </PublicLayout>
  );
}
