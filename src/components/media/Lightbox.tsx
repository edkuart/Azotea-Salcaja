"use client";

import { useCallback, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxImage = { src: string; alt?: string };

/**
 * Visor de imagen a pantalla completa, accesible y responsive.
 * - object-contain: muestra la imagen completa sin recortar (cualquier dimensión).
 * - role=dialog + aria-modal, foco al abrir, trampa de foco, ESC / clic fuera para cerrar.
 * - Flechas para navegar cuando hay varias imágenes.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasMany = images.length > 1;
  const current = images[index];

  const goPrev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate],
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate],
  );

  // Foco inicial al abrir.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Teclado (ESC / flechas) + bloqueo de scroll del fondo.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (hasMany && e.key === "ArrowLeft") goPrev();
      else if (hasMany && e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext, hasMany]);

  // Trampa de foco dentro del diálogo.
  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const f = node!.querySelectorAll<HTMLElement>("button");
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    node.addEventListener("keydown", trap);
    return () => node.removeEventListener("keydown", trap);
  }, []);

  if (!current) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || "Imagen ampliada"}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Siguiente"
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </>
      )}

      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full max-w-full flex-col items-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt || ""}
          decoding="async"
          className="max-h-[85vh] max-w-full object-contain"
        />
        {current.alt && (
          <figcaption className="mt-3 max-w-2xl text-center text-sm text-white/80">
            {current.alt}
          </figcaption>
        )}
      </figure>

      {hasMany && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-white/60">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}
