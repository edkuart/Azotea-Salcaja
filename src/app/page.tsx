import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  MessageCircle,
  Trophy,
} from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { chessCommunity } from "@/modules/chess/public-data";
import { publicEvents } from "@/modules/events/public-data";
import {
  featuredProducts,
  menuCategories,
  restaurantInfo,
} from "@/modules/restaurant/public-data";

export default function Home() {
  return (
    <PublicLayout>
      <main>
        <section
          className="relative flex min-h-[78svh] items-end overflow-hidden bg-stone-950"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(28,25,23,0.82), rgba(28,25,23,0.36)), url(${restaurantInfo.heroImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
              Restaurante local en Salcaja
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              {restaurantInfo.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100 sm:text-lg">
              {restaurantInfo.tagline}. Menu, eventos, contacto directo y una
              comunidad de ajedrez que se reune cada lunes por la noche.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-amber-300 px-5 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
                href="/menu"
              >
                Ver menu
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/70 px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-stone-950"
                href={`https://wa.me/${restaurantInfo.whatsapp}`}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Escribir por WhatsApp
              </a>
            </div>
            <div className="mt-10 grid max-w-3xl gap-3 text-sm text-stone-100 sm:grid-cols-3">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-200" aria-hidden />
                {restaurantInfo.address}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-200" aria-hidden />
                Abierto esta semana
              </p>
              <p className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-200" aria-hidden />
                Ajedrez lunes 7:30 p.m.
              </p>
            </div>
          </div>
        </section>

        <Section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Menu destacado
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                Para empezar a elegir
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
              href="/menu"
            >
              Ver catalogo completo
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {featuredProducts.map((product) => (
              <article
                className="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm sm:grid-cols-[180px_1fr]"
                key={product.name}
              >
                <div
                  className="min-h-44 bg-stone-200"
                  style={{
                    backgroundImage: `url(${product.image})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                    {product.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-stone-950">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {product.description}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-emerald-800">
                    {product.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <div className="bg-white">
          <Section>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div
                className="min-h-80 rounded-lg bg-stone-200"
                style={{
                  backgroundImage: `url(${restaurantInfo.terraceImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Catalogo digital
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                  Menu claro, precios visibles y contacto inmediato
                </h2>
                <p className="mt-4 text-base leading-7 text-stone-700">
                  El MVP inicia como catalogo profesional sin carrito. Cada
                  categoria puede crecer con fotos, disponibilidad, destacados y
                  promociones administrables.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {menuCategories.map((category) => (
                    <div
                      className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-4"
                      key={category.name}
                    >
                      <p className="font-semibold text-stone-950">
                        {category.name}
                      </p>
                      <p className="mt-2 text-sm leading-5 text-stone-600">
                        {category.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        <Section>
          <div className="grid gap-5 lg:grid-cols-3">
            {publicEvents.slice(0, 2).map((event) => (
              <article
                className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
                key={event.title}
              >
                <div
                  className="h-48 bg-stone-200"
                  style={{
                    backgroundImage: `url(${event.image})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <CalendarDays className="h-4 w-4" aria-hidden />
                    {event.date} - {event.time}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-stone-950">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {event.description}
                  </p>
                </div>
              </article>
            ))}

            <article
              className="rounded-lg border border-stone-200 bg-stone-950 p-6 text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(28,25,23,0.75), rgba(28,25,23,0.75)), url(${chessCommunity.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
                Comunidad
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                {chessCommunity.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-100">
                {chessCommunity.description}
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-200"
                href="/ajedrez"
              >
                Ver ajedrez
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          </div>
        </Section>

        <div className="bg-emerald-800 text-white">
          <Section className="py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
                  Contacto rapido
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Pregunta por horarios, productos o eventos.
                </h2>
              </div>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-emerald-900 transition hover:bg-amber-100"
                href={`https://wa.me/${restaurantInfo.whatsapp}`}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </div>
          </Section>
        </div>
      </main>
    </PublicLayout>
  );
}
