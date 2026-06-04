import Link from "next/link";

import { restaurantInfo } from "@/modules/restaurant/public-data";

export function SiteFooter() {
  return (
    <footer className="sf">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Big display name */}
        <p
          aria-label="Chessitos"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4rem, 12vw, 10rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.01em",
            margin: "0 0 36px",
          }}
        >
          Chess
          <em
            style={{
              fontFamily: "var(--font-chess)",
              fontStyle: "italic",
              color: "var(--color-marquee)",
            }}
          >
            itos
          </em>
          .
        </p>

        {/* 4-column grid */}
        <div
          className="grid gap-8 border-t-2 pt-7 sm:grid-cols-2 lg:grid-cols-4"
          style={{ borderColor: "var(--color-marquee)" }}
        >
          {/* Dirección */}
          <div>
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: "var(--text-xs)",
                color: "var(--color-marquee)",
              }}
            >
              Dirección
            </p>
            <p
              className="leading-6 opacity-85"
              style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}
            >
              {restaurantInfo.address}
            </p>
          </div>

          {/* Horario */}
          <div>
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: "var(--text-xs)",
                color: "var(--color-marquee)",
              }}
            >
              Horario
            </p>
            <div
              className="grid gap-1 opacity-85"
              style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}
            >
              {restaurantInfo.hours.map((h) => (
                <p key={h.day}>
                  {h.day} · {h.time}
                </p>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: "var(--text-xs)",
                color: "var(--color-marquee)",
              }}
            >
              Contacto
            </p>
            <div
              className="grid gap-1.5 opacity-85"
              style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}
            >
              <a
                href={`https://wa.me/${restaurantInfo.whatsapp}`}
                rel="noreferrer"
                target="_blank"
                className="no-underline transition-opacity hover:opacity-100"
                style={{ color: "var(--color-cream)" }}
              >
                WhatsApp
              </a>
              <a
                href={restaurantInfo.mapsUrl}
                rel="noreferrer"
                target="_blank"
                className="no-underline transition-opacity hover:opacity-100"
                style={{ color: "var(--color-cream)" }}
              >
                Google Maps
              </a>
              <p>{restaurantInfo.phone}</p>
            </div>
          </div>

          {/* Ajedrez */}
          <div>
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: "var(--text-xs)",
                color: "var(--color-marquee)",
              }}
            >
              Ajedrez
            </p>
            <div
              className="grid gap-1.5 opacity-85"
              style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}
            >
              <Link
                href="/ajedrez/clases"
                className="no-underline transition-opacity hover:opacity-100"
                style={{ color: "var(--color-cream)" }}
              >
                Clases Chessitos
              </Link>
              <Link
                href="/ajedrez/torneos"
                className="no-underline transition-opacity hover:opacity-100"
                style={{ color: "var(--color-cream)" }}
              >
                Torneos
              </Link>
              <Link
                href="/ajedrez"
                className="no-underline transition-opacity hover:opacity-100"
                style={{ color: "var(--color-cream)" }}
              >
                Comunidad
              </Link>
              <Link
                href="/ajedrez/crear"
                className="no-underline transition-opacity hover:opacity-100"
                style={{ color: "var(--color-cream)" }}
              >
                Torneos privados
              </Link>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div
          className="mt-12 flex justify-between opacity-60"
          style={{
            fontFamily: "var(--font-poster)",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontSize: "10px",
          }}
        >
          <span>© 2026 Chessitos · Salcajá, Guatemala</span>
          <span className="hidden sm:inline">
            Con el apoyo de Azotea Salcajá
          </span>
        </div>
      </div>
    </footer>
  );
}
