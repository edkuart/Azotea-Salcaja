import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
