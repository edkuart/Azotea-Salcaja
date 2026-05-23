import { Plus } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { TextField } from "@/components/admin/TextField";
import { adminCategories } from "@/modules/admin/restaurant-data";

export default function AdminCategoriesPage() {
  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
            <Plus className="h-4 w-4" aria-hidden />
            Nueva categoria
          </button>
        }
        description="Organiza el menu publico por secciones claras y faciles de escanear."
        eyebrow="Restaurante"
        title="Categorias"
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
        <AdminCard>
          <div className="grid gap-3">
            {adminCategories.map((category) => (
              <div
                className="grid gap-3 rounded-lg border border-stone-200 p-4 sm:grid-cols-[56px_1fr_auto] sm:items-center"
                key={category.id}
              >
                <div className="text-sm font-semibold text-stone-500">
                  #{category.sortOrder}
                </div>
                <div>
                  <h2 className="font-semibold text-stone-950">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {category.description}
                  </p>
                  <p className="mt-2 text-xs font-medium text-stone-500">
                    {category.productCount} productos
                  </p>
                </div>
                <StatusPill label={category.status} />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-semibold">Formulario rapido</h2>
          <form className="mt-4 grid gap-4">
            <TextField label="Nombre" placeholder="Ej. Postres" />
            <TextField label="Orden" placeholder="4" type="number" />
            <button className="h-11 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Guardar categoria
            </button>
          </form>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
