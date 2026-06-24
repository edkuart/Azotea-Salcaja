import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { restaurantInfo } from "@/modules/restaurant/public-data";

export const metadata: Metadata = {
  title: "Contacto — Azotea Salcajá",
  description:
    "Ubicación, horarios y contacto de Azotea Salcajá. 3ra Av. 2-77, zona 2, Barrio El Calvario, Salcajá.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <main>
        <Section>
          <span
            className="text-xs uppercase"
            style={{ fontFamily: "var(--font-poster)", letterSpacing: "0.2em", color: "var(--color-stage)" }}
          >
            Contacto
          </span>
          <h1
            className="mt-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", lineHeight: 0.97 }}
          >
            Visítanos en Salcajá
          </h1>
          <p
            className="mt-4 max-w-2xl leading-7"
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "#3a3a3a" }}
          >
            Estamos en el{" "}
            <strong>{restaurantInfo.floor}</strong>, {restaurantInfo.shortAddress}.
            Encuéntranos fácilmente con el mapa o escríbenos por WhatsApp.
          </p>
        </Section>

        {/* ── Mapa + Info ── */}
        <Section className="pt-0">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

            {/* Mapa embed */}
            <div
              style={{
                border: "2px solid var(--color-ink)",
                boxShadow: "var(--shadow-card)",
                overflow: "hidden",
                background: "#e8e4dc",
              }}
            >
              <iframe
                src={restaurantInfo.embedUrl}
                title="Ubicación de Azotea Salcajá en Google Maps"
                width="100%"
                height="400"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {/* Barra inferior del mapa */}
              <div
                style={{
                  background: "var(--color-ink)",
                  color: "var(--color-cream)",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      fontSize: 10,
                      color: "var(--color-marquee)",
                      marginBottom: 3,
                    }}
                  >
                    Azotea Salcajá
                  </p>
                  <p
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 10,
                      color: "rgba(255,253,208,0.5)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {restaurantInfo.latitude.toFixed(6)}, {restaurantInfo.longitude.toFixed(6)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={restaurantInfo.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontSize: 9,
                      color: "rgba(255,253,208,0.7)",
                      border: "1px solid rgba(255,253,208,0.2)",
                      padding: "5px 10px",
                      textDecoration: "none",
                    }}
                  >
                    Ver mapa
                  </a>
                  <a
                    href={restaurantInfo.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontSize: 9,
                      color: "var(--color-marquee)",
                      border: "1px solid var(--color-marquee)",
                      padding: "5px 10px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Navigation style={{ width: 10, height: 10 }} aria-hidden />
                    Cómo llegar
                  </a>
                </div>
              </div>
            </div>

            {/* Cards de info */}
            <div className="grid gap-4 content-start">
              <article
                style={{
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "var(--shadow-card)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={restaurantInfo.entranceImage}
                  alt="Referencia de la entrada de Azotea Salcajá"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "12px 16px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      fontSize: 10,
                      color: "var(--color-stage)",
                    }}
                  >
                    Referencia de entrada
                  </p>
                  <p
                    style={{
                      marginTop: 4,
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "#555",
                      lineHeight: 1.5,
                    }}
                  >
                    Busca el tercer nivel de la construcción; la entrada está señalizada desde la calle.
                  </p>
                </div>
              </article>

              {/* Ubicación */}
              <article
                style={{
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "var(--shadow-card)",
                  padding: "20px 22px",
                }}
              >
                <MapPin
                  style={{ width: 18, height: 18, color: "var(--color-stage)" }}
                  aria-hidden
                />
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    color: "var(--color-ink)",
                    marginTop: 10,
                    marginBottom: 6,
                  }}
                >
                  Ubicación
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "#444",
                  }}
                >
                  <strong style={{ color: "var(--color-ink)" }}>
                    {restaurantInfo.floor}
                  </strong>
                  <br />
                  {restaurantInfo.shortAddress}
                  <br />
                  Salcajá, Quetzaltenango
                  <br />
                  Guatemala
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <a
                    href={restaurantInfo.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontSize: 9,
                      color: "var(--color-stage)",
                      border: "1px solid var(--color-stage)",
                      padding: "6px 12px",
                      textDecoration: "none",
                    }}
                  >
                    Google Maps
                  </a>
                  <a
                    href={restaurantInfo.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontSize: 9,
                      color: "var(--color-ink)",
                      border: "1px solid var(--color-ink)",
                      padding: "6px 12px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Navigation style={{ width: 10, height: 10 }} aria-hidden />
                    Cómo llegar
                  </a>
                </div>
              </article>

              {/* Teléfono / WhatsApp */}
              <article
                style={{
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "var(--shadow-card)",
                  padding: "20px 22px",
                }}
              >
                <Phone
                  style={{ width: 18, height: 18, color: "var(--color-stage)" }}
                  aria-hidden
                />
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    color: "var(--color-ink)",
                    marginTop: 10,
                    marginBottom: 6,
                  }}
                >
                  Contacto
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "#444",
                    marginBottom: 14,
                  }}
                >
                  {restaurantInfo.phone}
                </p>
                <a
                  href={`https://wa.me/${restaurantInfo.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#25D366",
                    color: "#fff",
                    border: "2px solid #1ebe5d",
                    padding: "10px 18px",
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontSize: 10,
                    textDecoration: "none",
                    boxShadow: "3px 3px 0 #1a9e4c",
                  }}
                >
                  <MessageCircle style={{ width: 14, height: 14 }} aria-hidden />
                  WhatsApp
                </a>
              </article>

              {/* Horarios */}
              <article
                style={{
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "var(--shadow-card)",
                  padding: "20px 22px",
                }}
              >
                <Clock
                  style={{ width: 18, height: 18, color: "var(--color-stage)" }}
                  aria-hidden
                />
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    color: "var(--color-ink)",
                    marginTop: 10,
                    marginBottom: 12,
                  }}
                >
                  Horarios
                </h2>
                <div style={{ display: "grid", gap: 0 }}>
                  {restaurantInfo.hours.map((item, i) => (
                    <div
                      key={item.day}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "9px 0",
                        borderTop: i > 0 ? "1px dashed rgba(26,26,26,0.15)" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--color-ink)",
                        }}
                      >
                        {item.day}
                      </span>
                      <span
                        style={{
                          fontFamily: "ui-monospace, monospace",
                          fontSize: 12,
                          color: "#555",
                          textAlign: "right",
                        }}
                      >
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
