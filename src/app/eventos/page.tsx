import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { publicEvents } from "@/modules/events/public-data";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Eventos, actividades y comunidad en Azotea Salcajá.",
};

export default function EventsPage() {
  return (
    <PublicLayout>
      <main>
        <Section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Actividades
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-950">
            Eventos y comunidad
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
            Espacios para comer, reunirse y participar en actividades locales.
            La agenda oficial podra administrarse desde el panel.
          </p>
        </Section>

        <Section className="pt-0">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publicEvents.map((event) => (
              <article
                className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
                key={event.title}
              >
                <div
                  className="h-52 bg-stone-200"
                  style={{
                    backgroundImage: `url(${event.image})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                    {event.type}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-stone-950">
                    {event.title}
                  </h2>
                  <div className="mt-3 grid gap-2 text-sm text-stone-600">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-emerald-700" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-700" />
                      {event.time}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-stone-600">
                    {event.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
