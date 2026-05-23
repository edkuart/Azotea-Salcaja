import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminProducts } from "@/modules/admin/restaurant-data";

export function generateStaticParams() {
  return adminProducts.map((product) => ({ id: product.id }));
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = adminProducts.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

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
        description="Edita nombre, precio, categoria, descripcion, foto y disponibilidad."
        eyebrow="Productos"
        title={product.name}
      />

      <div className="mt-8">
        <AdminCard>
          <ProductForm values={product} />
        </AdminCard>
      </div>
    </AdminShell>
  );
}
