import type { MetadataRoute } from "next";
import { getPublishedOfficialTournaments } from "@/modules/chess/public-data";

const baseUrl = process.env.APP_URL ?? "https://azotea-salcaja.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const publicRoutes = [
    "",
    "/menu",
    "/eventos",
    "/contacto",
    "/ajedrez",
    "/ajedrez/crear",
    "/ajedrez/torneos",
  ];

  const tournamentRoutes = getPublishedOfficialTournaments().map(
    (tournament) => `/ajedrez/torneos/${tournament.slug}`,
  );

  return [...publicRoutes, ...tournamentRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.includes("torneos") ? 0.7 : 0.8,
  }));
}
