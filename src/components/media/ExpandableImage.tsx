"use client";

import { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { Lightbox } from "./Lightbox";

/**
 * Imagen única en un marco de proporción fija que se abre a pantalla completa
 * al hacer clic (object-contain en el visor).
 *
 * `fit`:
 *  - "cover": rellena el marco recortando (ideal para fotos apaisadas).
 *  - "contain": muestra la imagen COMPLETA (ideal para posters/flyers verticales
 *    o dimensiones desconocidas) sobre un fondo borroso de la misma imagen, para
 *    que el marco no quede vacío y se vea bien sea cual sea la proporción.
 *
 * `frameClassName` controla tamaño/proporción del marco (p. ej. "aspect-[16/9]"
 * o alturas "h-72 md:h-96").
 */
export function ExpandableImage({
  src,
  alt = "",
  frameClassName = "aspect-[16/9]",
  rounded = "rounded-sm",
  fit = "cover",
}: {
  src: string;
  alt?: string;
  frameClassName?: string;
  rounded?: string;
  fit?: "cover" | "contain";
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isContain = fit === "contain";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `Ampliar imagen: ${alt}` : "Ampliar imagen"}
        className={`group relative block w-full cursor-zoom-in overflow-hidden ${isContain ? "bg-stone-900" : "bg-stone-100"} ${frameClassName} ${rounded}`}
      >
        {isContain && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt=""
            aria-hidden
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-xl"
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`relative h-full w-full ${isContain ? "object-contain" : "object-cover"} transition duration-300 group-hover:scale-[1.02]`}
        />
        <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" aria-hidden />
        </span>
      </button>

      {open && (
        <Lightbox
          images={[{ src, alt }]}
          index={0}
          onClose={() => {
            setOpen(false);
            btnRef.current?.focus();
          }}
          onNavigate={() => {}}
        />
      )}
    </>
  );
}
