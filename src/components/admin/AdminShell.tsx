import type { ReactNode } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChefHat,
  Crown,
  FolderTree,
  Home,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: ChefHat },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/restaurante", label: "Restaurante", icon: Settings },
  { href: "/admin/ajedrez/torneos", label: "Ajedrez", icon: Crown },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <aside className="border-b border-stone-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="border-b border-stone-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Admin
            </p>
            <p className="mt-2 text-xl font-semibold">Azotea Salcaja</p>
          </div>

          <nav className="flex gap-1 overflow-x-auto p-3 lg:grid lg:overflow-visible">
            {adminNav.map((item) => (
              <Link
                className="inline-flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
                href={item.href}
                key={item.href}
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto hidden border-t border-stone-200 p-4 lg:block">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
              href="/"
            >
              <Home className="h-4 w-4" aria-hidden />
              Ver sitio publico
            </Link>
          </div>
        </div>
      </aside>

      <main className="lg:pl-72">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
