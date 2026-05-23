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
        className="h-11 rounded-md border border-stone-300 bg-white px-3 text-sm font-normal text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
