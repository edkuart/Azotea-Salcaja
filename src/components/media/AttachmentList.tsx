import { FileDown } from "lucide-react";

export type Attachment = { name: string; url: string };

/**
 * Lista de documentos descargables (p. ej. PDFs con las bases del torneo).
 * Componente de presentación (sin estado) reutilizable en público.
 */
export function AttachmentList({ items }: { items?: Attachment[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((doc, i) => (
        <a
          key={`${doc.url}-${i}`}
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          download
          className="flex items-center gap-3 rounded-sm border-2 border-[var(--color-ink)] bg-white px-4 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
        >
          <FileDown className="h-5 w-5 shrink-0 text-stone-600" aria-hidden />
          <span className="truncate">{doc.name || "Documento"}</span>
        </a>
      ))}
    </div>
  );
}
