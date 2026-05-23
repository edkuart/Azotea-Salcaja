import type { Metadata } from "next";

import { PrivateTournamentCreator } from "@/components/chess/PrivateTournamentCreator";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";

export const metadata: Metadata = {
  title: "Crear torneo casual",
  description: "Crea un torneo privado de ajedrez por link.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreatePrivateTournamentPage() {
  return (
    <PublicLayout>
      <main>
        <Section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Torneo casual
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-950">
            Crear torneo rapido
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
            Para grupos de amigos: agrega nombres, elige sistema y comparte un
            link. Estos torneos no son oficiales ni aparecen publicados por el
            restaurante.
          </p>
        </Section>

        <Section className="pt-0">
          <PrivateTournamentCreator />
        </Section>
      </main>
    </PublicLayout>
  );
}
