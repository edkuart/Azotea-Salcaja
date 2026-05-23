import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white"
            href="/admin/productos"
          >
            Volver
          </Link>
        }
        description="Crea un producto para el catalogo publico. La subida real de imagenes se conectara a Storage en la integracion."
        eyebrow="Productos"
        title="Nuevo producto"
      />

      <div className="mt-8">
        <AdminCard>
          <ProductForm />
        </AdminCard>
      </div>
    </AdminShell>
  );
}
