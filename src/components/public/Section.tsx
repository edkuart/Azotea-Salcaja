import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function Section({
  children,
  className = "",
  ...props
}: {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "className">) {
  return (
    <section
      {...props}
      className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ${className}`}
    >
      {children}
    </section>
  );
}
