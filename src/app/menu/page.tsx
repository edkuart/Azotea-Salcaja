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
          <span
            className="text-xs uppercase"
            style={{ fontFamily: "var(--font-poster)", letterSpacing: "0.2em", color: "var(--color-stage)" }}
          >
            Catálogo digital
          </span>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", lineHeight: 0.95 }}>
                Menú
              </h1>
              <p
                className="mt-3 max-w-2xl leading-7"
                style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "#3a3a3a" }}
              >
                Productos organizados por categoría, con precios visibles y
                contacto directo para consultar disponibilidad.
              </p>
            </div>
            <a
              className="btn btn-primary"
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
                className="shrink-0 border-2 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] no-underline transition-transform hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-poster)",
                  background: "var(--color-cream)",
                  borderColor: "var(--color-ink)",
                  color: "var(--color-ink)",
                }}
                href={`#${category.name.toLowerCase()}`}
                key={category.name}
              >
                {category.name}
              </a>
            ))}
          </div>

          <div className="mt-8 grid gap-10">
            {menuCategories.map((category) => (
              <section id={category.name.toLowerCase()} key={category.name}>
                <div className="border-b-2 pb-3" style={{ borderColor: "var(--color-ink)" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", lineHeight: 1 }}>
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: "#5a5a5a" }}>
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {category.products.map((product) => (
                    <article
                      className="grid overflow-hidden border-2 sm:grid-cols-[150px_1fr]"
                      key={product.name}
                      style={{
                        background: "var(--color-cream)",
                        borderColor: "var(--color-ink)",
                        boxShadow: "var(--shadow-card)",
                      }}
                    >
                      <div
                        className="min-h-40 border-b-2 sm:border-b-0 sm:border-r-2"
                        style={{
                          borderColor: "var(--color-ink)",
                          backgroundImage: `url(${product.image})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            style={{ fontFamily: "var(--font-display)", fontSize: "19px", lineHeight: 1.05 }}
                          >
                            {product.name}
                          </h3>
                          <p
                            className="shrink-0"
                            style={{
                              fontFamily: "var(--font-poster)",
                              fontSize: "18px",
                              letterSpacing: "0.02em",
                              color: "var(--color-stage)",
                            }}
                          >
                            {product.price}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-6" style={{ color: "#3a3a3a" }}>
                          {product.description}
                        </p>
                        {product.featured ? (
                          <p
                            className="mt-3 inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em]"
                            style={{ fontFamily: "var(--font-poster)", color: "var(--color-marquee)" }}
                          >
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
