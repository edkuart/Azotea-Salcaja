export function TextAreaField({
  label,
  defaultValue,
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-stone-700">
      {label}
      <textarea
        className="min-h-28 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-normal leading-6 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </label>
  );
}
