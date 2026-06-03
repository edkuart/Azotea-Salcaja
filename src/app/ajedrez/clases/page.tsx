import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, ChevronDown, Clock, MapPin, MessageCircle, Shield, Swords, Target } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { restaurantInfo } from "@/modules/restaurant/public-data";

export const metadata: Metadata = {
  title: "Clases Chessitos — Ajedrez para niños · Azotea Salcajá",
  description:
    "Programa de ajedrez para niños principiantes. Clases presenciales los lunes de 5:30 a 7:30 PM en Azotea Salcajá, Guatemala. Pensamiento estratégico, concentración y diversión.",
};

const WHATSAPP_MSG = encodeURIComponent(
  "Hola, me interesa inscribir a mi hijo/a en las clases de Chessitos. ¿Podrían darme más información?"
);

const benefits = [
  {
    icon: Brain,
    title: "Pensamiento estratégico",
    description: "Aprenden a planificar varios movimientos por adelantado, una habilidad que aplican en la escuela y en la vida.",
  },
  {
    icon: Target,
    title: "Concentración",
    description: "Cada partida entrena la capacidad de mantenerse enfocado y tomar decisiones con calma bajo presión.",
  },
  {
    icon: Shield,
    title: "Resolución de problemas",
    description: "El ajedrez enseña a analizar situaciones, encontrar opciones y escoger la mejor respuesta.",
  },
  {
    icon: Swords,
    title: "Disciplina y respeto",
    description: "Aprender a ganar y perder con elegancia. El tablero es una escuela de carácter.",
  },
];

const curriculum = [
  {
    month: "Mes 1",
    subtitle: "Fundamentos",
    color: "var(--color-stage)",
    weeks: [
      { num: 1, title: "Las piezas y el objetivo", topics: ["Movimiento de cada pieza", "Objetivo del juego", "Jaque y jaque mate"] },
      { num: 2, title: "Valor y captura",           topics: ["Valor relativo de las piezas", "Cómo capturar", "Intercambios convenientes"] },
      { num: 3, title: "Los primeros principios",   topics: ["Desarrollo de piezas", "Control del centro", "El enroque"] },
      { num: 4, title: "Mini torneo interno ♟",     topics: ["Aplicación práctica", "Partidas supervisadas", "Análisis grupal"] },
    ],
  },
  {
    month: "Mes 2",
    subtitle: "Táctica",
    color: "var(--color-marquee)",
    weeks: [
      { num: 5, title: "Golpes directos",      topics: ["Ataque doble (fork)", "Clavadas (pin)", "Práctica de posiciones"] },
      { num: 6, title: "Combinaciones",        topics: ["Descubiertas", "Rayos X (skewer)", "Secuencias tácticas"] },
      { num: 7, title: "Atacando al rey",      topics: ["Reconocer debilidades", "Ataques coordinados", "Defensa activa"] },
      { num: 8, title: "Torneo interno ♟",    topics: ["Torneo completo", "Premiación", "Retroalimentación individual"] },
    ],
  },
  {
    month: "Mes 3",
    subtitle: "Estrategia",
    color: "var(--color-emerald)",
    weeks: [
      { num: 9,  title: "Peones",               topics: ["Estructura de peones", "Peones pasados", "Cadenas de peones"] },
      { num: 10, title: "Dominio posicional",   topics: ["Casillas fuertes", "Outposts", "Mejorando piezas"] },
      { num: 11, title: "Planificación",        topics: ["Cómo crear un plan", "Planes típicos por apertura", "Identificar la pieza débil"] },
      { num: 12, title: "Torneo evaluativo ♛", topics: ["Torneo completo", "Diplomas de participación", "Evaluación del progreso"] },
    ],
  },
];

const faqs = [
  {
    q: "¿Qué edad necesitan los niños?",
    a: "El programa está pensado para niños de 6 a 14 años. Aceptamos principiantes absolutos; no es necesario saber jugar de antemano.",
  },
  {
    q: "¿Necesitan traer algo?",
    a: "No. El local cuenta con tableros y piezas. Solo necesitan ganas de aprender.",
  },
  {
    q: "¿Cuántos niños hay por grupo?",
    a: "Mantenemos grupos pequeños para asegurar atención personalizada. Los cupos son limitados.",
  },
  {
    q: "¿El programa tiene costo?",
    a: "Sí. Para conocer la mensualidad y disponibilidad de cupos escríbenos por WhatsApp.",
  },
  {
    q: "¿Qué pasa si un niño falta una clase?",
    a: "Se puede retomar el contenido en la siguiente sesión. El avance es progresivo y cada semana construye sobre la anterior.",
  },
  {
    q: "¿Los padres pueden quedarse?",
    a: "¡Claro! Azotea Salcajá es un restaurante. Los papás pueden disfrutar el local mientras los niños tienen su clase.",
  },
];

export default function ClasesPage() {
  return (
    <PublicLayout>
      <main>

        {/* ── Hero ── */}
        <section
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderBottom: "4px solid var(--color-stage)",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <Link
              href="/ajedrez"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: "10px",
                color: "var(--color-marquee)",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "20px",
              }}
            >
              ← Ajedrez
            </Link>

            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: "11px",
                color: "var(--color-stage)",
                marginBottom: "14px",
              }}
            >
              Programa de clases · Principiantes
            </p>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 10vw, 7rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Chess
              <em
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  color: "var(--color-stage)",
                  display: "block",
                }}
              >
                itos
              </em>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.75,
                color: "rgba(255,253,208,0.82)",
                maxWidth: "520px",
                marginBottom: "32px",
              }}
            >
              Clases de ajedrez para niños principiantes. Un programa de 3 meses
              diseñado para desarrollar pensamiento estratégico, concentración y
              amor por el juego.
            </p>

            {/* Schedule pill */}
            <div
              style={{
                display: "inline-flex",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: "36px",
              }}
            >
              {[
                { icon: Clock,  text: "Lunes · 5:30 – 7:30 PM" },
                { icon: MapPin, text: "Azotea Salcajá" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    fontSize: "10px",
                    color: "var(--color-marquee)",
                  }}
                >
                  <Icon style={{ width: "14px", height: "14px", flexShrink: 0 }} aria-hidden />
                  {text}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/${restaurantInfo.whatsapp}?text=${WHATSAPP_MSG}`}
                className="btn btn-primary"
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle style={{ width: "14px", height: "14px" }} aria-hidden />
                Inscribir a mi hijo/a
              </a>
              <a href="#programa" className="btn btn-secondary">
                Ver programa
                <ArrowRight style={{ width: "14px", height: "14px" }} aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* ── Beneficios ── */}
        <Section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                style={{
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "var(--shadow-card)",
                  padding: "22px 20px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "var(--color-stage)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <Icon style={{ width: "18px", height: "18px", color: "var(--color-cream)" }} aria-hidden />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    lineHeight: 1.1,
                    color: "var(--color-ink)",
                    marginBottom: "8px",
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
                  }}
                >
                  {description}
                </p>
              </article>
            ))}
          </div>
        </Section>

        {/* ── Por qué el ajedrez ── */}
        <div style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
          <Section>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
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
                  El programa
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
                  Más que aprender{" "}
                  <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-stage)" }}>
                    a mover piezas
                  </em>
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    lineHeight: 1.75,
                    color: "rgba(255,253,208,0.82)",
                    marginBottom: "16px",
                  }}
                >
                  Chessitos no es una clase de memorización de aperturas. Es un
                  espacio donde los niños aprenden a pensar: a analizar antes
                  de actuar, a ver consecuencias, a respetar al rival.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    lineHeight: 1.75,
                    color: "rgba(255,253,208,0.82)",
                  }}
                >
                  Cada mes tiene un arco claro — fundamentos, táctica,
                  estrategia — y termina con un torneo interno donde los niños
                  aplican lo aprendido en un ambiente festivo y de competencia
                  sana.
                </p>
              </div>

              {/* Visual callout */}
              <div
                style={{
                  border: "2px solid rgba(255,253,208,0.2)",
                  padding: "32px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    fontFamily: "var(--font-chess)",
                    fontSize: "180px",
                    lineHeight: 1,
                    color: "rgba(255,253,208,0.04)",
                    userSelect: "none",
                  }}
                >
                  ♞
                </div>
                <div style={{ display: "grid", gap: "20px", position: "relative" }}>
                  {[
                    { num: "3",   label: "Meses de programa",      sub: "Fundamentos · Táctica · Estrategia" },
                    { num: "12",  label: "Semanas de contenido",    sub: "1 tema nuevo cada lunes" },
                    { num: "3",   label: "Torneos internos",        sub: "Aplicación práctica mensual" },
                    { num: "2h",  label: "Por sesión",              sub: "Lunes 5:30 – 7:30 PM" },
                  ].map(({ num, label, sub }) => (
                    <div key={label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "2.5rem",
                          lineHeight: 0.9,
                          color: "var(--color-stage)",
                          flexShrink: 0,
                          minWidth: "56px",
                        }}
                      >
                        {num}
                      </span>
                      <div>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-cream)" }}>{label}</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,253,208,0.55)", marginTop: "2px" }}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Programa de 3 meses ── */}
        <div id="programa">
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
            Contenido
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              color: "var(--color-ink)",
              marginBottom: "36px",
            }}
          >
            Programa — 3 meses
          </h2>

          <div style={{ display: "grid", gap: "24px" }}>
            {curriculum.map(({ month, subtitle, color, weeks }) => (
              <details
                key={month}
                open
                style={{
                  border: "2px solid var(--color-ink)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <summary
                  style={{
                    background: "var(--color-ink)",
                    color: "var(--color-cream)",
                    padding: "16px 20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    listStyle: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.6rem",
                        lineHeight: 1,
                        color,
                      }}
                    >
                      {month}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-poster)",
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        fontSize: "10px",
                        color: "rgba(255,253,208,0.6)",
                      }}
                    >
                      {subtitle}
                    </span>
                  </div>
                  <ChevronDown
                    style={{ width: "18px", height: "18px", color: "rgba(255,253,208,0.5)", flexShrink: 0 }}
                    aria-hidden
                  />
                </summary>

                <div style={{ background: "var(--color-grain)", padding: "20px" }}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {weeks.map(({ num, title, topics }) => (
                      <div
                        key={num}
                        style={{
                          borderLeft: `3px solid ${color}`,
                          paddingLeft: "14px",
                          paddingTop: "4px",
                          paddingBottom: "4px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-poster)",
                            textTransform: "uppercase",
                            letterSpacing: "0.16em",
                            fontSize: "9px",
                            color: color,
                            marginBottom: "3px",
                          }}
                        >
                          Semana {num}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1rem",
                            color: "var(--color-ink)",
                            marginBottom: "6px",
                            lineHeight: 1.1,
                          }}
                        >
                          {title}
                        </p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "2px" }}>
                          {topics.map((t) => (
                            <li
                              key={t}
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "12px",
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: color, flexShrink: 0, display: "block" }} />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </Section>
        </div>

        {/* ── Horario ── */}
        <div style={{ background: "var(--color-stage)", color: "var(--color-cream)" }}>
          <Section>
            <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <p
                  style={{
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    fontSize: "11px",
                    color: "rgba(255,253,208,0.7)",
                    marginBottom: "12px",
                  }}
                >
                  Horario
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.2rem, 6vw, 4rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.01em",
                    marginBottom: "16px",
                  }}
                >
                  Lunes · 5:30 PM
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    lineHeight: 1.7,
                    color: "rgba(255,253,208,0.85)",
                    maxWidth: "460px",
                  }}
                >
                  Sesiones de 2 horas cada semana. Grupos pequeños para garantizar
                  atención personalizada. Cupos limitados.
                </p>
              </div>

              <div
                style={{
                  background: "var(--color-ink)",
                  border: "2px solid rgba(255,253,208,0.2)",
                  padding: "24px",
                  display: "grid",
                  gap: "12px",
                }}
              >
                {[
                  { label: "Día",      value: "Lunes" },
                  { label: "Hora",     value: "5:30 – 7:30 PM" },
                  { label: "Duración", value: "2 horas" },
                  { label: "Lugar",    value: "Azotea Salcajá" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,253,208,0.1)", paddingBottom: "8px" }}>
                    <span style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "9px", color: "rgba(255,253,208,0.5)" }}>{label}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-cream)" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        {/* ── FAQ ── */}
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
            Preguntas frecuentes
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              color: "var(--color-ink)",
              marginBottom: "32px",
            }}
          >
            Lo que los padres nos preguntan
          </h2>

          <div style={{ display: "grid", gap: "8px", maxWidth: "720px" }}>
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                style={{
                  border: "2px solid var(--color-ink)",
                  background: "var(--color-grain)",
                }}
              >
                <summary
                  style={{
                    padding: "16px 18px",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {q}
                  <ChevronDown style={{ width: "16px", height: "16px", flexShrink: 0, color: "var(--color-stage)" }} aria-hidden />
                </summary>
                <div
                  style={{
                    padding: "0 18px 16px",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.7,
                    color: "#444",
                    borderTop: "1px solid rgba(26,26,26,0.1)",
                    paddingTop: "12px",
                  }}
                >
                  {a}
                </div>
              </details>
            ))}
          </div>
        </Section>

        {/* ── Inscripción CTA ── */}
        <div
          id="inscripcion"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderTop: "4px solid var(--color-stage)",
          }}
        >
          <Section>
            <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  fontSize: "4rem",
                  lineHeight: 1,
                  color: "var(--color-stage)",
                  marginBottom: "8px",
                }}
                aria-hidden
              >
                ♟
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.2rem, 6vw, 4rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.01em",
                  marginBottom: "16px",
                }}
              >
                ¿Listo para empezar?
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  lineHeight: 1.7,
                  color: "rgba(255,253,208,0.8)",
                  marginBottom: "32px",
                }}
              >
                Los cupos son limitados. Escríbenos por WhatsApp para apartar
                el lugar de tu hijo/a y recibir información sobre la
                mensualidad y fecha de inicio.
              </p>
              <a
                href={`https://wa.me/${restaurantInfo.whatsapp}?text=${WHATSAPP_MSG}`}
                className="btn btn-primary"
                rel="noreferrer"
                target="_blank"
                style={{ fontSize: "14px", padding: "16px 28px" }}
              >
                <MessageCircle style={{ width: "16px", height: "16px" }} aria-hidden />
                Inscribir por WhatsApp
              </a>
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontSize: "9px",
                  color: "rgba(255,253,208,0.4)",
                  marginTop: "16px",
                }}
              >
                Azotea Salcajá · {restaurantInfo.address}
              </p>
            </div>
          </Section>
        </div>

      </main>
    </PublicLayout>
  );
}
