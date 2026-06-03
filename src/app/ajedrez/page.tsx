import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, Trophy, Users } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { chessCommunity } from "@/modules/chess/public-data";

export const metadata: Metadata = {
  title: "Ajedrez — Azotea Salcajá",
  description:
    "Ecosistema de ajedrez en Azotea Salcajá: clases para niños, torneos oficiales y comunidad local.",
};

const pillars = [
  {
    icon: BookOpen,
    href: "/ajedrez/clases",
    eyebrow: "Nuevo",
    title: "Clases Chessitos",
    description:
      "Programa de ajedrez para niños principiantes. Lunes de 5:30 a 7:30 PM. Pensamiento estratégico, concentración y diversión.",
    cta: "Ver programa",
    accent: "var(--color-stage)",
  },
  {
    icon: Trophy,
    href: "/ajedrez/torneos",
    eyebrow: "Oficial",
    title: "Torneos",
    description:
      "Competencias con sistema suizo, tabla de posiciones, desempates y resultados en tiempo real para toda la comunidad.",
    cta: "Ver torneos",
    accent: "var(--color-marquee)",
  },
  {
    icon: Users,
    href: "/ajedrez/crear",
    eyebrow: "Casual",
    title: "Torneos privados",
    description:
      "Crea un torneo desde el teléfono en segundos. Comparte el link y lleva pareos sin necesidad de registro.",
    cta: "Crear torneo",
    accent: "var(--color-marquee)",
  },
];

export default function ChessPage() {
  return (
    <PublicLayout>
      <main>
        {/* ── Hero ── */}
        <section
          style={{
            background: "var(--color-ink)",
            backgroundImage: `linear-gradient(90deg, rgba(26,26,26,0.92), rgba(26,26,26,0.55)), url(${chessCommunity.image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            color: "var(--color-cream)",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: "11px",
                color: "var(--color-marquee)",
                marginBottom: "16px",
              }}
            >
              Ecosistema de ajedrez
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
                maxWidth: "700px",
              }}
            >
              Ajedrez en{" "}
              <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-stage)" }}>
                Azotea
              </em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.7,
                color: "rgba(255,253,208,0.82)",
                maxWidth: "540px",
                marginTop: "20px",
              }}
            >
              {chessCommunity.description} Clases para niños, torneos oficiales
              y una comunidad local que crece cada lunes.
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap" }}>
              <Link href="/ajedrez/clases" className="btn btn-primary">
                Clases Chessitos
              </Link>
              <Link href="/ajedrez/torneos" className="btn btn-secondary">
                Ver torneos
              </Link>
            </div>
          </div>
        </section>

        {/* ── Pilares del ecosistema ── */}
        <Section>
          <p
            style={{
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              fontSize: "11px",
              color: "var(--color-stage)",
              marginBottom: "12px",
            }}
          >
            Todo en un lugar
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              color: "var(--color-ink)",
              marginBottom: "32px",
            }}
          >
            El ecosistema completo
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map(({ icon: Icon, href, eyebrow, title, description, cta, accent }) => (
              <article
                key={href}
                style={{
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "var(--shadow-card)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontSize: "9px",
                    color: accent,
                    marginBottom: "12px",
                  }}
                >
                  {eyebrow}
                </p>
                <Icon
                  style={{ width: "20px", height: "20px", color: accent, marginBottom: "10px" }}
                  aria-hidden
                />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    lineHeight: 1.05,
                    color: "var(--color-ink)",
                    marginBottom: "10px",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.65,
                    color: "#444",
                    flex: 1,
                    marginBottom: "20px",
                  }}
                >
                  {description}
                </p>
                <Link
                  href={href}
                  style={{
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    fontSize: "10px",
                    color: accent,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {cta}
                  <ArrowRight style={{ width: "12px", height: "12px" }} aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </Section>

        {/* ── Lunes de ajedrez ── */}
        <div style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
          <Section>
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    fontSize: "11px",
                    color: "var(--color-marquee)",
                    marginBottom: "14px",
                  }}
                >
                  Cada semana
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.01em",
                    marginBottom: "18px",
                  }}
                >
                  Lunes de{" "}
                  <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-stage)" }}>
                    ajedrez
                  </em>
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    lineHeight: 1.7,
                    color: "rgba(255,253,208,0.8)",
                    maxWidth: "480px",
                    marginBottom: "24px",
                  }}
                >
                  {chessCommunity.schedule}. Partidas casuales, análisis y
                  convivencia. Todos los niveles bienvenidos.
                </p>
                <div style={{ display: "grid", gap: "8px" }}>
                  {chessCommunity.features.map((feature) => (
                    <p
                      key={feature}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        color: "rgba(255,253,208,0.75)",
                        borderLeft: "2px solid var(--color-stage)",
                        paddingLeft: "12px",
                      }}
                    >
                      {feature}
                    </p>
                  ))}
                </div>
              </div>

              <div
                style={{
                  border: "2px solid rgba(255,253,208,0.15)",
                  padding: "28px",
                  background: "rgba(255,253,208,0.04)",
                }}
              >
                <CalendarClock
                  style={{ width: "24px", height: "24px", color: "var(--color-marquee)", marginBottom: "16px" }}
                  aria-hidden
                />
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.2rem",
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}
                >
                  Lunes
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "rgba(255,253,208,0.7)",
                    marginBottom: "20px",
                  }}
                >
                  {chessCommunity.schedule} · Azotea Salcajá
                </p>
                <Link
                  href="/ajedrez/clases"
                  className="btn btn-primary"
                  style={{ display: "inline-flex" }}
                >
                  Ver clases Chessitos
                  <ArrowRight style={{ width: "14px", height: "14px", marginLeft: "6px" }} aria-hidden />
                </Link>
              </div>
            </div>
          </Section>
        </div>
      </main>
    </PublicLayout>
  );
}
