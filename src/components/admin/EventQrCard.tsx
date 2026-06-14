"use client";

import { ShareQrCard } from "@/components/admin/ShareQrCard";

export function EventQrCard({
  slug,
  published,
}: {
  slug: string;
  published: boolean;
}) {
  return (
    <ShareQrCard
      path={`/eventos/${slug}`}
      title="Código QR del evento"
      description="Apunta a la página pública del evento. Descárgalo en alta resolución para tu flyer o compártelo para que lo escaneen."
      notice={
        published
          ? undefined
          : "El evento aún no está publicado. El QR ya funciona, pero la página pública solo será visible cuando publiques el evento."
      }
      fileName={`qr-${slug}`}
    />
  );
}
