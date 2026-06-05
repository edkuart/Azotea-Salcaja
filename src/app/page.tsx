import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { chessCommunity } from "@/modules/chess/public-data";
import { db } from "@/lib/db";
import {
  featuredProducts,
  menuCategories,
  restaurantInfo,
} from "@/modules/restaurant/public-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const upcomingEvents = await db().event.findMany({
    where: { status: "published" },
    orderBy: { startsAt: "asc" },
    take: 2,
  });
  return (
    <PublicLayout>
      <main>

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden border-b-[3px]"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderColor: "var(--color-stage)",
            padding: "96px 0 120px",
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

          {/* Spinning vinyl disc */}
          <div
            aria-hidden="true"
            className="vinyl-disc animate-vinyl-slow parallax-slow"
            style={{
              width: "560px",
              height: "560px",
              position: "absolute",
              right: "-160px",
              top: "-100px",
              opacity: 0.9,
            }}
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

            {/* Meta strip */}
            <div
              className="reveal mt-14 grid max-w-3xl gap-6 sm:grid-cols-3"
              data-reveal-delay="320"
            >
              <div>
                <p className="eyebrow" style={{ color: "var(--color-marquee)" }}>
                  Torneos
                </p>
                <p className="mt-1.5" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)" }}>
                  Sistema suizo · Categorías libre y sub-18
                </p>
              </div>
              <div>
                <p className="eyebrow" style={{ color: "var(--color-marquee)" }}>
                  Clases
                </p>
                <p className="mt-1.5" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)" }}>
                  Programa Chessitos para niños
                </p>
              </div>
              <div>
                <p className="eyebrow" style={{ color: "var(--color-marquee)" }}>
                  Sede
                </p>
                <p className="mt-1.5" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)" }}>
                  Restaurante Azotea · Salcajá
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ── */}
        <section
          className="section-restaurant py-16 sm:py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span
                  className="section-label reveal"
                  style={{ color: "var(--color-stage)" }}
                >
                  Azotea Salcajá · Patrocinador
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
                  Para empezar a elegir.
                </h2>
              </div>
              <Link
                href="/menu"
                className="reveal inline-flex items-center gap-2 no-underline transition-opacity hover:opacity-70"
                data-reveal-delay="80"
                style={{
                  fontFamily: "var(--font-poster)",
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--color-stage)",
                }}
              >
                Ver catálogo completo
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product, i) => {
                const duotones = ["duotone-red", "duotone-gold", "duotone-night"];
                const duotone = duotones[i % duotones.length];
                return (
                  <article
                    className={`product-card reveal`}
                    key={product.name}
                    data-reveal-delay={String(i * 80)}
                  >
                    <div
                      className={`card-img ${duotone}`}
                      style={{ backgroundImage: `url(${product.image})` }}
                    />
                    <div className="card-body">
                      <span className="card-cat">{product.category}</span>
                      <h3 className="card-name">{product.name}</h3>
                      <p className="card-desc">{product.description}</p>
                      <p className="card-price">{product.price}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MENU CATEGORIES ── */}
        <section
          className="section-chess py-16 sm:py-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div>
                <span
                  className="section-label reveal"
                  style={{ color: "var(--color-gold)" }}
                >
                  Catálogo digital
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
                  Menú claro, precios visibles.
                </h2>
                <p
                  className="reveal mt-4 max-w-[52ch] leading-7 opacity-85"
                  data-reveal-delay="160"
                  style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", color: "var(--color-board)" }}
                >
                  Cada categoría con fotos, disponibilidad y destacados
                  administrables desde el panel. Sin carrito — solo contacto
                  directo por WhatsApp.
                </p>
                <Link
                  href="/menu"
                  className="btn btn-primary reveal mt-8"
                  data-reveal-delay="240"
                >
                  Ver menú completo
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
                {menuCategories.map((category, i) => (
                  <div
                    key={category.name}
                    className="reveal border-l-4 py-3 pl-5"
                    data-reveal-delay={String(i * 80)}
                    style={{ borderColor: "var(--color-gold)" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-xl)",
                        color: "var(--color-board)",
                        lineHeight: 1,
                      }}
                    >
                      {category.name}
                    </p>
                    <p
                      className="mt-1.5 opacity-75"
                      style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-board)" }}
                    >
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
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
              {/* Featured chess event card */}
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
                    Ver ajedrez
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </article>

              {/* DB events */}
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

        {/* ── WHATSAPP CTA ── */}
        <section
          className="section-events py-14"
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
                  Pregunta por horarios, productos o eventos.
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
