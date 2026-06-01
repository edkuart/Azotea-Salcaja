import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  backHref,
  backLabel = "Volver",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header style={{ paddingBottom: 20, borderBottom: "2px solid var(--color-ink)", marginBottom: 24 }}>
      {backHref && (
        <a
          href={backHref}
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--color-stage)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 8,
          }}
        >
          ← {backLabel}
        </a>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            style={{
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              fontSize: 11,
              color: "var(--color-stage)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 18,
                height: 2,
                background: "var(--color-stage)",
                flexShrink: 0,
              }}
            />
            {eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              lineHeight: 1,
              margin: "8px 0 0",
              color: "var(--color-ink)",
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#555",
                marginTop: 6,
                maxWidth: 560,
              }}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex flex-col gap-2 sm:flex-row">{action}</div>}
      </div>
    </header>
  );
}
