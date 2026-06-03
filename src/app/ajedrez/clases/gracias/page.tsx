import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { restaurantInfo } from "@/modules/restaurant/public-data";

const ADMIN_WHATSAPP = "50235262791";
const WA_FALLBACK = encodeURIComponent(
  "¡Hola! Completé la inscripción de mi hijo/a en Chessitos y quiero confirmar el cupo. ¡Gracias!"
);

export const metadata: Metadata = {
  title: "Inscripción recibida — Chessitos · Azotea Salcajá",
};

export default function GraciasPage() {
  return (
    <PublicLayout>
      <main>
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-grain)",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              margin: "0 auto",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-chess)",
                fontStyle: "italic",
                fontSize: "5rem",
                lineHeight: 1,
                color: "var(--color-stage)",
                marginBottom: "4px",
              }}
              aria-hidden
            >
              ♟
            </p>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
                color: "var(--color-ink)",
                marginBottom: "16px",
                marginTop: "8px",
              }}
            >
              ¡Inscripción recibida!
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.7,
                color: "#444",
                marginBottom: "28px",
              }}
            >
              Gracias por inscribir a tu hijo/a en{" "}
              <em
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  color: "var(--color-stage)",
                }}
              >
                Chessitos
              </em>
              . Nos pondremos en contacto pronto para confirmar el cupo y
              darte los detalles del inicio de clases.
            </p>

            <div
              style={{
                background: "var(--color-ink)",
                color: "var(--color-cream)",
                border: "2px solid var(--color-ink)",
                boxShadow: "var(--shadow-card)",
                padding: "20px 22px",
                textAlign: "left",
                marginBottom: "28px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: "9px",
                  color: "var(--color-marquee)",
                  marginBottom: "10px",
                }}
              >
                Mientras tanto
              </p>
              <div style={{ display: "grid", gap: "8px" }}>
                {[
                  "Clases: lunes de 5:30 a 7:30 PM",
                  "Lugar: Azotea Salcajá",
                  `WhatsApp: ${restaurantInfo.phone}`,
                ].map((line) => (
                  <p
                    key={line}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: "rgba(255,253,208,0.82)",
                      borderLeft: "2px solid var(--color-stage)",
                      paddingLeft: "10px",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* WhatsApp fallback */}
            <a
              href={`https://wa.me/${ADMIN_WHATSAPP}?text=${WA_FALLBACK}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                background: "#25D366",
                color: "#fff",
                border: "2px solid #1ebe5d",
                padding: "13px 20px",
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: "11px",
                textDecoration: "none",
                marginBottom: "10px",
                boxShadow: "3px 3px 0 #1a9e4c",
              }}
            >
              <MessageCircle style={{ width: "15px", height: "15px" }} aria-hidden />
              ¿No se abrió WhatsApp? Toca aquí
            </a>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ajedrez/clases" className="btn btn-primary" style={{ padding: "12px 20px" }}>
                Ver programa completo
              </Link>
              <Link href="/" className="btn btn-secondary" style={{ padding: "12px 20px", color: "var(--color-ink)", borderColor: "var(--color-ink)" }}>
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
