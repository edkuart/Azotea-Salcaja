import type { Metadata } from "next";
import { MessageCircle, Star } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import {
  menuCategories,
  restaurantInfo,
} from "@/modules/restaurant/public-data";

export const metadata: Metadata = {
  title: "Menu",
  description: "Catalogo digital con productos, precios y categorias.",
};

export default function MenuPage() {
  return (
    <PublicLayout>
      <main>
        <Section className="pb-8 pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Catalogo digital
          </p>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-stone-950">Menu</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-700">
                Productos organizados por categoria, con precios visibles y
                contacto directo para consultar disponibilidad.
              </p>
            </div>
            <a
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              href={`https://wa.me/${restaurantInfo.whatsapp}`}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Consultar
            </a>
          </div>
        </Section>

        <Section className="pt-0">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {menuCategories.map((category) => (
              <a
                className="shrink-0 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
                href={`#${category.name.toLowerCase()}`}
                key={category.name}
              >
                {category.name}
              </a>
            ))}
          </div>

          <div className="mt-6 grid gap-8">
            {menuCategories.map((category) => (
              <section id={category.name.toLowerCase()} key={category.name}>
                <div className="border-b border-stone-200 pb-3">
                  <h2 className="text-2xl font-semibold text-stone-950">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {category.products.map((product) => (
                    <article
                      className="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm sm:grid-cols-[150px_1fr]"
                      key={product.name}
                    >
                      <div
                        className="min-h-40 bg-stone-200"
                        style={{
                          backgroundImage: `url(${product.image})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold text-stone-950">
                            {product.name}
                          </h3>
                          <p className="text-lg font-semibold text-emerald-800">
                            {product.price}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {product.description}
                        </p>
                        {product.featured ? (
                          <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
                            <Star className="h-3.5 w-3.5" aria-hidden />
                            Destacado
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
