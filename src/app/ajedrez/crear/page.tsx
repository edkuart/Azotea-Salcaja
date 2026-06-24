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
          <span
            className="text-xs uppercase"
            style={{ fontFamily: "var(--font-poster)", letterSpacing: "0.2em", color: "var(--color-stage)" }}
          >
            Torneo casual
          </span>
          <h1
            className="mt-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", lineHeight: 0.97 }}
          >
            Crear torneo rápido
          </h1>
          <p
            className="mt-4 max-w-2xl leading-7"
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "#3a3a3a" }}
          >
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
