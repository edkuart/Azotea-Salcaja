"use client";

import { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { Lightbox, type LightboxImage } from "./Lightbox";

/**
 * Grilla de miniaturas que abren un visor a pantalla completa con navegación.
 *
 * `fit` por defecto "contain": muestra cada imagen COMPLETA (no recorta posters
 * verticales) sobre un fondo borroso de la misma imagen. Usar "cover" para
 * galerías de fotos apaisadas donde se prefiera recorte uniforme.
 */
export function ImageGallery({
  images,
  columns = "grid-cols-2 sm:grid-cols-3",
  aspect = "aspect-[4/3]",
  fit = "contain",
}: {
  images: LightboxImage[];
  columns?: string;
  aspect?: string;
  fit?: "cover" | "contain";
}) {
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const isContain = fit === "contain";

  if (images.length === 0) return null;

  return (
    <>
      <div className={`grid gap-3 ${columns}`}>
        {images.map((img, i) => (
          <button
            key={`${img.src}-${i}`}
            type="button"
            onClick={(e) => {
              lastTrigger.current = e.currentTarget;
              setOpen(i);
            }}
            aria-label={img.alt ? `Ampliar imagen: ${img.alt}` : `Ampliar imagen ${i + 1}`}
            className={`group relative cursor-zoom-in overflow-hidden rounded-sm border-2 border-[var(--color-ink)] ${isContain ? "bg-stone-900" : "bg-stone-100"} ${aspect}`}
          >
            {isContain && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={img.src}
                alt=""
                aria-hidden
                decoding="async"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-xl"
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt || ""}
              loading="lazy"
              decoding="async"
              className={`relative h-full w-full ${isContain ? "object-contain" : "object-cover"} transition duration-300 group-hover:scale-[1.03]`}
            />
            <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100">
              <Maximize2 className="h-4 w-4" aria-hidden />
            </span>
            {img.alt && (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-black/55 px-2 py-1 text-left text-xs text-white">
                {img.alt}
              </span>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <Lightbox
          images={images}
          index={open}
          onClose={() => {
            setOpen(null);
            lastTrigger.current?.focus();
          }}
          onNavigate={(n) => setOpen(n)}
        />
      )}
    </>
  );
}
