import Link from "next/link";

import { TextField } from "@/components/admin/TextField";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
          Iniciar sesion
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Pantalla base para la autenticacion. Se conectara con Supabase Auth
          cuando configuremos las credenciales.
        </p>

        <form className="mt-6 grid gap-4">
          <TextField label="Correo" placeholder="admin@azotea.com" />
          <TextField label="Contrasena" placeholder="********" type="password" />
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            href="/admin"
          >
            Entrar
          </Link>
        </form>
      </section>
    </main>
  );
}
