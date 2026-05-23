import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { restaurantInfo } from "@/modules/restaurant/public-data";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ubicacion, horarios y contacto de Azotea Salcaja.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <main>
        <Section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Contacto
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-950">
            Visitanos en Salcaja
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
            Encuentra horarios, direccion y enlaces directos para pedir
            informacion sobre productos, promociones o eventos.
          </p>
        </Section>

        <Section className="pt-0">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="grid gap-4">
              <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <MapPin className="h-5 w-5 text-emerald-700" aria-hidden />
                <h2 className="mt-3 text-xl font-semibold text-stone-950">
                  Ubicacion
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {restaurantInfo.address}
                </p>
                <a
                  className="mt-4 inline-flex text-sm font-semibold text-emerald-800"
                  href={restaurantInfo.mapsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Abrir en Google Maps
                </a>
              </article>

              <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <Phone className="h-5 w-5 text-emerald-700" aria-hidden />
                <h2 className="mt-3 text-xl font-semibold text-stone-950">
                  Telefono
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                  {restaurantInfo.phone}
                </p>
                <a
                  className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  href={`https://wa.me/${restaurantInfo.whatsapp}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </a>
              </article>
            </div>

            <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <Clock className="h-5 w-5 text-emerald-700" aria-hidden />
              <h2 className="mt-3 text-xl font-semibold text-stone-950">
                Horarios
              </h2>
              <div className="mt-4 divide-y divide-stone-200">
                {restaurantInfo.hours.map((item) => (
                  <div
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                    key={item.day}
                  >
                    <span className="font-medium text-stone-950">
                      {item.day}
                    </span>
                    <span className="text-right text-stone-600">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 min-h-64 rounded-lg bg-stone-200"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(16,85,60,0.25), rgba(16,85,60,0.25)), url(https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80)",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            </article>
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
