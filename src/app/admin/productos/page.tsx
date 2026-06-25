import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { adminProducts } from "@/modules/admin/restaurant-data";

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
            href="/admin/productos/nuevo"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nuevo producto
          </Link>
        }
        description="Administra productos, precios, categorias, fotos, disponibilidad y destacados."
        eyebrow="Restaurante"
        title="Productos"
      />

      {/* Móvil: tarjetas apiladas (la tabla se desbordaba) */}
      <div className="grid gap-3 md:hidden">
        {adminProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-sm border-2 border-[var(--color-ink)] bg-white p-4 shadow-[3px_3px_0_var(--color-ink)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-stone-950">{product.name}</h3>
              <span className="shrink-0 font-semibold text-[var(--color-ink)]">
                {product.price}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-600">{product.description}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-stone-500">
              {product.category}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill label={product.status} />
              <StatusPill label={product.availability} />
              <Link
                className="ml-auto text-sm font-semibold text-[var(--color-stage)]"
                href={`/admin/productos/${product.id}`}
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Escritorio: tabla */}
      <div className="hidden md:block">
        <AdminCard>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-stone-200 text-xs uppercase tracking-[0.12em] text-stone-500">
              <tr>
                <th className="py-3 pr-4">Producto</th>
                <th className="py-3 pr-4">Categoria</th>
                <th className="py-3 pr-4">Precio</th>
                <th className="py-3 pr-4">Estado</th>
                <th className="py-3 pr-4">Disponibilidad</th>
                <th className="py-3 pr-4">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {adminProducts.map((product) => (
                <tr key={product.id}>
                  <td className="py-4 pr-4">
                    <div className="font-semibold text-stone-950">
                      {product.name}
                    </div>
                    <div className="mt-1 max-w-sm text-stone-600">
                      {product.description}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-stone-700">
                    {product.category}
                  </td>
                  <td className="py-4 pr-4 font-semibold text-[var(--color-ink)]">
                    {product.price}
                  </td>
                  <td className="py-4 pr-4">
                    <StatusPill label={product.status} />
                  </td>
                  <td className="py-4 pr-4">
                    <StatusPill label={product.availability} />
                  </td>
                  <td className="py-4 pr-4">
                    <Link
                      className="font-semibold text-[var(--color-stage)]"
                      href={`/admin/productos/${product.id}`}
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
