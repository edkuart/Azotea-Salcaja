"use client";

import { useRef, useState } from "react";
import { Upload, Link, X, ImageIcon, Loader2, Maximize2 } from "lucide-react";

import { Lightbox } from "@/components/media/Lightbox";

type Props = {
  name: string;
  label?: string;
  defaultValue?: string | null;
  folder?: string;
};

export function ImageUpload({
  name,
  label = "Imagen",
  defaultValue,
  folder = "misc",
}: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [mode, setMode] = useState<"file" | "url">("file");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al subir");
      setUrl(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-700">{label}</label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("file")}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition"
            style={{
              background: mode === "file" ? "#1c1917" : "transparent",
              color: mode === "file" ? "white" : "#78716c",
            }}
          >
            <Upload className="h-3 w-3" />
            Subir archivo
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition"
            style={{
              background: mode === "url" ? "#1c1917" : "transparent",
              color: mode === "url" ? "white" : "#78716c",
            }}
          >
            <Link className="h-3 w-3" />
            URL
          </button>
        </div>
      </div>

      {/* Hidden field that holds the final URL */}
      <input type="hidden" name={name} value={url} />

      {mode === "file" ? (
        <div
          className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center transition hover:border-stone-400 cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleFile}
          />
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
          ) : url ? (
            <ImageIcon className="h-6 w-6 text-emerald-600" />
          ) : (
            <Upload className="h-6 w-6 text-stone-400" />
          )}
          <p className="text-sm text-stone-500">
            {uploading
              ? "Subiendo…"
              : url
              ? "Imagen cargada — clic para reemplazar"
              : "Clic para seleccionar imagen (JPG, PNG, WebP · máx. 5 MB)"}
          </p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="h-10 flex-1 rounded-md border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950"
          />
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Preview */}
      {url && (
        <div className="relative mt-1 overflow-hidden rounded-md border-2 border-[var(--color-ink)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Preview" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label="Ampliar imagen"
            className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Quitar imagen"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {zoom && url && (
        <Lightbox
          images={[{ src: url, alt: label }]}
          index={0}
          onClose={() => setZoom(false)}
          onNavigate={() => {}}
        />
      )}
    </div>
  );
}
