import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}
    >
      <section
        className="w-full max-w-xl border-2 p-7 text-center sm:p-8"
        style={{
          background: "var(--color-cream)",
          color: "var(--color-ink)",
          borderColor: "var(--color-ink)",
          boxShadow: "6px 6px 0 var(--color-stage)",
        }}
      >
        <span
          className="text-xs uppercase"
          style={{ fontFamily: "var(--font-poster)", letterSpacing: "0.2em", color: "var(--color-stage)" }}
        >
          No encontrado
        </span>
        <h1
          className="mt-3"
          style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", lineHeight: 1.02 }}
        >
          Esta página no existe o el link ya no es válido.
        </h1>
        <p className="mt-3 text-sm leading-6" style={{ fontFamily: "var(--font-body)", color: "#3a3a3a" }}>
          Si estabas abriendo un torneo privado, revisa que el enlace esté
          completo. Los torneos oficiales se pueden consultar desde la sección
          de ajedrez.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link className="btn btn-primary" href="/ajedrez">
            Ir a ajedrez
          </Link>
          <Link className="btn btn-poster" href="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
