"use client";

import { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { Lightbox, type LightboxImage } from "./Lightbox";

/**
 * Grilla de miniaturas uniformes (object-cover) que abren un visor a pantalla
 * completa con navegación entre todas las imágenes.
 */
export function ImageGallery({
  images,
  columns = "grid-cols-2 sm:grid-cols-3",
  aspect = "aspect-[4/3]",
}: {
  images: LightboxImage[];
  columns?: string;
  aspect?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

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
            className={`group relative cursor-zoom-in overflow-hidden rounded-sm border-2 border-[var(--color-ink)] bg-stone-100 ${aspect}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt || ""}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
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
