import Link from "next/link";

import { restaurantInfo } from "@/modules/restaurant/public-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-xl font-semibold">{restaurantInfo.name}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-300">
            {restaurantInfo.description}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">
            Explorar
          </p>
          <div className="mt-3 grid gap-2 text-sm text-stone-300">
            <Link href="/menu">Menu</Link>
            <Link href="/eventos">Eventos</Link>
            <Link href="/ajedrez">Ajedrez</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">
            Visitanos
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            {restaurantInfo.address}
          </p>
          <p className="mt-2 text-sm text-stone-300">{restaurantInfo.phone}</p>
        </div>
      </div>
    </footer>
  );
}
