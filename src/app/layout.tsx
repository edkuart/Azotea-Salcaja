import type { Metadata } from "next";
import {
  Abril_Fatface,
  Anton,
  Playfair_Display,
  Zilla_Slab,
} from "next/font/google";
import "./globals.css";
import { DesignEffects } from "@/components/DesignEffects";

const displayFont = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const posterFont = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poster",
  display: "swap",
});

const bodyFont = Zilla_Slab({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const chessFont = Playfair_Display({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-chess",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL ?? "https://azotea-salcaja.vercel.app",
  ),
  title: {
    default: "Azotea Salcajá",
    template: "%s | Azotea Salcajá",
  },
  description:
    "Catalogo digital, eventos y comunidad de ajedrez de Azotea Salcajá.",
  openGraph: {
    title: "Azotea Salcajá",
    description:
      "Catalogo digital, eventos y comunidad de ajedrez de Azotea Salcajá.",
    siteName: "Azotea Salcajá",
    locale: "es_GT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${posterFont.variable} ${bodyFont.variable} ${chessFont.variable} h-full antialiased`}
    >
      <body className="grain-overlay min-h-full flex flex-col">
        <DesignEffects />
        {children}
      </body>
    </html>
  );
}
