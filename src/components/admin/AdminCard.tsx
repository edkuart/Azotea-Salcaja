import type { ReactNode } from "react";

export function AdminCard({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-sm border-2 border-[var(--color-ink)] bg-white p-5 shadow-[4px_4px_0_var(--color-ink)]">
      {children}
    </section>
  );
}
