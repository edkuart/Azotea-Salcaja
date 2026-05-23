import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { restaurantInfo } from "@/modules/restaurant/public-data";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menu" },
  { href: "/eventos", label: "Eventos" },
  { href: "/ajedrez", label: "Ajedrez" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#fbfaf7]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-stone-950">
            Azotea Salcaja
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-emerald-700 sm:inline">
            Restaurante
          </span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto text-sm font-medium text-stone-700">
          {navItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 transition hover:bg-white hover:text-stone-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
          href={`https://wa.me/${restaurantInfo.whatsapp}`}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
