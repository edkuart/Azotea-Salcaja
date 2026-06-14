export function TextField({
  label,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-stone-700">
      {label}
      <input
        className="h-11 rounded-md border-2 border-[var(--color-ink)] bg-white px-3 text-sm font-normal text-stone-950 outline-none transition focus:border-[var(--color-stage)] focus:ring-2 focus:ring-[var(--color-stage)]/20"
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
