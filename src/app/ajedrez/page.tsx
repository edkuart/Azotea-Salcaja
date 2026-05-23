import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, ListChecks, Trophy } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { chessCommunity } from "@/modules/chess/public-data";

export const metadata: Metadata = {
  title: "Ajedrez",
  description: "Comunidad y torneos de ajedrez en Azotea Salcaja.",
};

export default function ChessPage() {
  return (
    <PublicLayout>
      <main>
        <section
          className="bg-stone-950 text-white"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(28,25,23,0.88), rgba(28,25,23,0.42)), url(${chessCommunity.image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
              Comunidad de ajedrez
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">
              {chessCommunity.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100">
              {chessCommunity.description}
            </p>
          </div>
        </section>

        <Section>
          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <CalendarClock
                className="h-5 w-5 text-emerald-700"
                aria-hidden
              />
              <h2 className="mt-3 text-xl font-semibold text-stone-950">
                Reuniones
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {chessCommunity.schedule}. Partidas casuales y convivencia en
                el restaurante.
              </p>
            </article>
            <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <Trophy className="h-5 w-5 text-emerald-700" aria-hidden />
              <h2 className="mt-3 text-xl font-semibold text-stone-950">
                Torneos oficiales
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Eventos creados por el administrador, publicables con tabla,
                ganadores, fotos e historial.
              </p>
            </article>
            <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <ListChecks className="h-5 w-5 text-emerald-700" aria-hidden />
              <h2 className="mt-3 text-xl font-semibold text-stone-950">
                Torneos casuales
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Creacion rapida desde telefono, con link privado para ver o
                registrar resultados.
              </p>
            </article>
          </div>
        </Section>

        <div className="bg-white">
          <Section>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Modulo integrado
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                  Ajedrez sin quitarle protagonismo al restaurante
                </h2>
                <p className="mt-4 text-base leading-7 text-stone-700">
                  La experiencia publica presenta el ajedrez como actividad
                  comunitaria. La gestion de pareos, resultados y desempates
                  crecera en fases posteriores.
                </p>
                <div className="mt-6 grid gap-3">
                  {chessCommunity.features.map((feature) => (
                    <p
                      className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-4 text-sm font-medium text-stone-700"
                      key={feature}
                    >
                      {feature}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-950 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
                  Casual
                </p>
                <h3 className="mt-3 text-2xl font-semibold">
                  Crear torneo casual
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-200">
                  Crea un torneo privado desde el telefono, comparte el link y
                  lleva pareos basicos sin publicarlo como evento oficial.
                </p>
                <Link
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-200"
                  href="/ajedrez/crear"
                >
                  Crear torneo
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Section>
        </div>
      </main>
    </PublicLayout>
  );
}
