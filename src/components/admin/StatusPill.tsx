export function StatusPill({ label }: { label: string }) {
  const isPublished = label === "Publicado" || label === "Activo";
  const isFeatured = label === "Destacado";

  return (
    <span
      className={[
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        isPublished
          ? "border-emerald-300 bg-emerald-100 text-emerald-800"
          : isFeatured
            ? "border-amber-300 bg-amber-100 text-amber-800"
            : "border-stone-300 bg-stone-100 text-stone-700",
      ].join(" ")}
      style={{ fontFamily: "var(--font-poster)" }}
    >
      {label}
    </span>
  );
}
