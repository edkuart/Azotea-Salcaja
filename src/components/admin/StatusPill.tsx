export function StatusPill({ label }: { label: string }) {
  const isPublished = label === "Publicado" || label === "Activo";
  const isFeatured = label === "Destacado";

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        isPublished
          ? "bg-emerald-100 text-emerald-800"
          : isFeatured
            ? "bg-amber-100 text-amber-800"
            : "bg-stone-100 text-stone-700",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
