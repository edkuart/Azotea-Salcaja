import type { MetadataRoute } from "next";
import { getPublishedOfficialTournaments } from "@/modules/chess/public-data";

const baseUrl = process.env.APP_URL ?? "https://web-production-5f909.up.railway.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const publicRoutes = [
    "",
    "/menu",
    "/eventos",
    "/contacto",
    "/ajedrez",
    "/ajedrez/club",
    "/ajedrez/crear",
    "/ajedrez/proyeccion",
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
