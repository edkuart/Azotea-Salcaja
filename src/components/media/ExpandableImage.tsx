"use client";

import { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { Lightbox } from "./Lightbox";

/**
 * Imagen única en un marco de proporción fija (object-cover, miniatura uniforme)
 * que se abre a pantalla completa al hacer clic (object-contain en el visor).
 *
 * `frameClassName` controla el tamaño/proporción del marco. Acepta una
 * proporción (p. ej. "aspect-[16/9]") o alturas fijas (p. ej. "h-72 md:h-96").
 */
export function ExpandableImage({
  src,
  alt = "",
  frameClassName = "aspect-[16/9]",
  rounded = "rounded-sm",
}: {
  src: string;
  alt?: string;
  frameClassName?: string;
  rounded?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `Ampliar imagen: ${alt}` : "Ampliar imagen"}
        className={`group relative block w-full cursor-zoom-in overflow-hidden bg-stone-100 ${frameClassName} ${rounded}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
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
