"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          Error
        </span>
        <h1
          className="mt-3"
          style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", lineHeight: 1.02 }}
        >
          Algo no salió bien.
        </h1>
        <p className="mt-3 text-sm leading-6" style={{ fontFamily: "var(--font-body)", color: "#3a3a3a" }}>
          Puedes intentar de nuevo o volver al inicio mientras revisamos el
          flujo.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button className="btn btn-primary" onClick={reset} type="button">
            Reintentar
          </button>
          <Link className="btn btn-poster" href="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
