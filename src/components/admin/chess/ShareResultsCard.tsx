"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Megaphone, Share2 } from "lucide-react";

import { buildResultsCaption } from "@/modules/chess/share";
import type { ChessTournament, PlayerStanding } from "@/modules/chess/types";

/**
 * Tarjeta "Compartir resultados": aparece en la pestaña Tabla cuando el
 * torneo terminó. Genera el póster PNG en el servidor y ofrece compartirlo
 * por el menú nativo del teléfono, descargarlo, copiar el caption o
 * publicarlo directo en la página de Facebook (si está configurado).
 */
export function ShareResultsCard({
  t,
  standings,
}: {
  t: ChessTournament;
  standings: PlayerStanding[];
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [fbConfigured, setFbConfigured] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const posterUrl = `/api/tournaments/${t.id}/poster`;
  const caption = buildResultsCaption(t, standings);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/facebook-publish");
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { configured?: boolean };
        if (!cancelled) setFbConfigured(data.configured ?? false);
      } catch {
        if (!cancelled) setFbConfigured(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchPosterFile(): Promise<File> {
    const res = await fetch(posterUrl);
    if (!res.ok) throw new Error("No se pudo generar el póster");
    const blob = await res.blob();
    return new File([blob], `resultados-${t.slug || t.id}.png`, { type: "image/png" });
  }

  async function handleShare() {
    setBusy("share");
    setMessage(null);
    try {
      const file = await fetchPosterFile();
      if (navigator.canShare?.({ files: [file] })) {
        // Facebook suele descartar el texto al compartir archivos; por eso
        // también existe el botón "Copiar texto".
        await navigator.share({ files: [file], text: caption });
      } else {
        downloadFile(file);
        setMessage({
          kind: "ok",
          text: "Tu navegador no comparte archivos: se descargó el PNG para subirlo a mano.",
        });
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") {
        setMessage({ kind: "error", text: "No se pudo compartir el póster." });
      }
    } finally {
      setBusy(null);
    }
  }

  function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownload() {
    setBusy("download");
    setMessage(null);
    try {
      downloadFile(await fetchPosterFile());
    } catch {
      setMessage({ kind: "error", text: "No se pudo generar el póster." });
    } finally {
      setBusy(null);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setMessage({ kind: "error", text: "No se pudo copiar el texto." });
    }
  }

  async function handleFacebookPublish() {
    if (!window.confirm("¿Publicar los resultados en la página de Facebook de Chessitos?")) {
      return;
    }
    setBusy("facebook");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/facebook-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId: t.id }),
      });
      const data = (await res.json()) as { error?: string; postUrl?: string };
      if (!res.ok) {
        setMessage({ kind: "error", text: data.error ?? "Facebook rechazó la publicación." });
      } else {
        setMessage({
          kind: "ok",
          text: data.postUrl
            ? `Publicado en Facebook: ${data.postUrl}`
            : "Publicado en la página de Facebook.",
        });
      }
    } catch {
      setMessage({ kind: "error", text: "No se pudo conectar con el servidor." });
    } finally {
      setBusy(null);
    }
  }

  const buttonStyle = (variant: "primary" | "secondary" | "facebook") => ({
    display: "inline-flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    padding: "10px 14px",
    border: "2px solid var(--color-ink)",
    fontFamily: "var(--font-poster)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    fontSize: 11,
    cursor: "pointer",
    background:
      variant === "primary"
        ? "var(--color-stage)"
        : variant === "facebook"
          ? "var(--color-navy)"
          : "var(--color-cream)",
    color: variant === "secondary" ? "var(--color-ink)" : "var(--color-cream)",
    opacity: busy ? 0.6 : 1,
  });

  return (
    <div
      style={{
        border: "2px solid var(--color-ink)",
        background: "var(--color-grain)",
        boxShadow: "var(--shadow-card)",
        padding: 16,
        marginBottom: 20,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-poster)",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          fontSize: 11,
          marginBottom: 4,
        }}
      >
        Compartir resultados
      </p>
      <p className="mb-3 text-xs text-stone-600">
        Póster listo para la página de Facebook de Chessitos. En el teléfono,
        &ldquo;Compartir&rdquo; abre el menú nativo; el texto va aparte con
        &ldquo;Copiar texto&rdquo;.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Vista previa del póster */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt="Póster de resultados del torneo"
          style={{
            width: 180,
            border: "2px solid var(--color-ink)",
            alignSelf: "flex-start",
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <button type="button" disabled={busy !== null} onClick={handleShare} style={buttonStyle("primary")}>
            <Share2 className="h-4 w-4" aria-hidden />
            {busy === "share" ? "Preparando…" : "Compartir"}
          </button>
          <button type="button" disabled={busy !== null} onClick={handleDownload} style={buttonStyle("secondary")}>
            <Download className="h-4 w-4" aria-hidden />
            {busy === "download" ? "Generando…" : "Descargar PNG"}
          </button>
          <button type="button" disabled={busy !== null} onClick={handleCopy} style={buttonStyle("secondary")}>
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Texto copiado" : "Copiar texto"}
          </button>
          {fbConfigured && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={handleFacebookPublish}
              style={buttonStyle("facebook")}
            >
              <Megaphone className="h-4 w-4" aria-hidden />
              {busy === "facebook" ? "Publicando…" : "Publicar en Facebook"}
            </button>
          )}
          {fbConfigured === false && (
            <p className="text-xs text-stone-500">
              Publicación directa en Facebook sin configurar (ver
              docs/FACEBOOK_PUBLICACION.md).
            </p>
          )}
          {message && (
            <p
              className="text-xs"
              style={{ color: message.kind === "ok" ? "var(--color-emerald)" : "var(--color-stage)" }}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
