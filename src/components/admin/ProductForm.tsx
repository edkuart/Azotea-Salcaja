import { TextAreaField } from "@/components/admin/TextAreaField";
import { TextField } from "@/components/admin/TextField";
import { adminCategories } from "@/modules/admin/restaurant-data";

type ProductFormValues = {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  image?: string;
  status?: string;
};

export function ProductForm({ values = {} }: { values?: ProductFormValues }) {
  return (
    <form className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          defaultValue={values.name}
          label="Nombre del producto"
          placeholder="Ej. Hamburguesa Salcajá"
        />
        <TextField
          defaultValue={values.price}
          label="Precio"
          placeholder="Q58"
        />
      </div>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        Categoria
        <select
          className="h-11 rounded-md border-2 border-[var(--color-ink)] bg-white px-3 text-sm font-normal text-stone-950 outline-none transition focus:border-[var(--color-stage)] focus:ring-2 focus:ring-[var(--color-stage)]/20"
          defaultValue={values.category}
        >
          {adminCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <TextAreaField
        defaultValue={values.description}
        label="Descripcion"
        placeholder="Descripcion corta para el menu publico."
      />

      <TextField
        defaultValue={values.image}
        label="URL de imagen temporal"
        placeholder="https://..."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-white p-3 text-sm font-medium text-stone-700">
          <input className="h-4 w-4 accent-[var(--color-stage)]" type="checkbox" />
          Producto destacado
        </label>
        <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-white p-3 text-sm font-medium text-stone-700">
          <input
            className="h-4 w-4 accent-[var(--color-stage)]"
            defaultChecked
            type="checkbox"
          />
          Disponible
        </label>
        <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-white p-3 text-sm font-medium text-stone-700">
          <input className="h-4 w-4 accent-[var(--color-stage)]" type="checkbox" />
          Ocultar del menu
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="h-11 rounded-md bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800">
          Guardar producto
        </button>
        <button
          className="h-11 rounded-md border border-stone-300 px-5 text-sm font-semibold text-stone-700 transition hover:bg-white"
          type="button"
        >
          Desactivar
        </button>
      </div>
    </form>
  );
}
