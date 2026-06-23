/**
 * BrandMark — marca central de Chessitos Salcajá (emblema).
 *
 * Fuente única de verdad para el logo en todo el sitio. Reemplaza el
 * antiguo disco de vinilo (.vinyl-disc). Sin hooks: sirve en componentes
 * de servidor y de cliente.
 *
 * Variantes de imagen (PNG transparente, generadas con
 * scripts/make-logo-transparent.js):
 *   -160  (~19 KB)  · marcas pequeñas (header)
 *   -512  (~156 KB) · tamaños medianos
 *   -1024 (~551 KB) · héroes / retina
 */
import type { CSSProperties } from "react";

// Relación alto/ancho del emblema recortado (1167 x 1188).
const RATIO = 1188 / 1167;

function srcFor(size: number): string {
  const target = size * 2; // margen para pantallas retina
  if (target <= 160) return "/images/chessitos-salcaja-logo-160.png";
  if (target <= 512) return "/images/chessitos-salcaja-logo-512.png";
  return "/images/chessitos-salcaja-logo-1024.png";
}

type BrandMarkProps = {
  /** Ancho renderizado en px (la altura se calcula con la proporción). */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Resplandor radial detrás del emblema (héroes / destacados). */
  glow?: boolean;
  /** Carga prioritaria para marcas above-the-fold. */
  priority?: boolean;
  alt?: string;
  "aria-hidden"?: boolean;
};

export function BrandMark({
  size = 40,
  className,
  style,
  glow = false,
  priority = false,
  alt = "Chessitos Salcajá",
  "aria-hidden": ariaHidden,
}: BrandMarkProps) {
  const img = (
    <img
      src={srcFor(size)}
      width={size}
      height={Math.round(size * RATIO)}
      alt={ariaHidden ? "" : alt}
      aria-hidden={ariaHidden}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      style={{
        display: "block",
        width: size,
        height: "auto",
        objectFit: "contain",
        userSelect: "none",
      }}
    />
  );

  if (!glow) {
    return className || style ? (
      <span className={className} style={{ display: "inline-flex", ...style }}>
        {img}
      </span>
    ) : (
      img
    );
  }

  return (
    <span
      className={className}
      aria-hidden={ariaHidden}
      style={{
        position: "relative",
        display: "inline-flex",
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-14%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 45%, rgba(201,168,76,0.45), rgba(11,42,74,0.18) 55%, transparent 72%)",
          filter: "blur(8px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex" }}>
        {img}
      </span>
    </span>
  );
}
