import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL ?? "https://azotea-salcaja.vercel.app",
  ),
  title: {
    default: "Azotea Salcaja",
    template: "%s | Azotea Salcaja",
  },
  description:
    "Catalogo digital, eventos y comunidad de ajedrez de Azotea Salcaja.",
  openGraph: {
    title: "Azotea Salcaja",
    description:
      "Catalogo digital, eventos y comunidad de ajedrez de Azotea Salcaja.",
    siteName: "Azotea Salcaja",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
