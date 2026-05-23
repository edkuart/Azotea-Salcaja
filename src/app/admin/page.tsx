import Link from "next/link";
import { ArrowRight, CalendarDays, ChefHat, FolderTree, Settings } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminCategories,
  adminEvents,
  adminProducts,
} from "@/modules/admin/restaurant-data";

const modules = [
  {
    href: "/admin/productos",
    label: "Productos",
    value: adminProducts.length,
    description: "Precios, fotos, disponibilidad y destacados.",
    icon: ChefHat,
  },
  {
    href: "/admin/categorias",
    label: "Categorias",
    value: adminCategories.length,
    description: "Orden y clasificacion del catalogo.",
    icon: FolderTree,
  },
  {
    href: "/admin/eventos",
    label: "Eventos",
    value: adminEvents.length,
    description: "Actividades, promociones y comunidad.",
    icon: CalendarDays,
  },
  {
    href: "/admin/restaurante",
    label: "Restaurante",
    value: 1,
    description: "Contacto, horarios, ubicacion y redes.",
    icon: Settings,
  },
];

export default function AdminPage() {
  return (
    <AdminShell>
      <AdminPageHeader
        description="Panel inicial para administrar el contenido publico del restaurante. En esta fase los formularios preparan el flujo; la persistencia se conectara a base de datos."
        eyebrow="Administracion"
        title="Resumen del restaurante"
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <Link href={module.href} key={module.href}>
            <AdminCard>
              <module.icon className="h-5 w-5 text-emerald-700" aria-hidden />
              <p className="mt-4 text-3xl font-semibold">{module.value}</p>
              <h2 className="mt-2 text-lg font-semibold">{module.label}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {module.description}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                Gestionar
                <ArrowRight className="h-4 w-4" aria-hidden />
              </p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <AdminCard>
          <h2 className="text-lg font-semibold">Pendientes operativos</h2>
          <div className="mt-4 grid gap-3 text-sm text-stone-700">
            <p className="rounded-md bg-stone-50 p-3">
              Confirmar telefono y WhatsApp oficial.
            </p>
            <p className="rounded-md bg-stone-50 p-3">
              Reemplazar fotos temporales por fotos reales del restaurante.
            </p>
            <p className="rounded-md bg-stone-50 p-3">
              Cargar menu completo con precios finales.
            </p>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-semibold">Estado de publicacion</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-md bg-emerald-50 p-3 text-emerald-900">
              <span>Sitio publico</span>
              <span className="font-semibold">Activo</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-amber-50 p-3 text-amber-900">
              <span>Datos reales</span>
              <span className="font-semibold">Pendiente</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-stone-50 p-3 text-stone-700">
              <span>Base de datos</span>
              <span className="font-semibold">Siguiente conexion</span>
            </div>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
