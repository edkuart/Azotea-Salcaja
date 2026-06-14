"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Copy, Check } from "lucide-react";

export function EventQrCard({
  slug,
  published,
}: {
  slug: string;
  published: boolean;
}) {
  const [url, setUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const u = `${window.location.origin}/eventos/${slug}`;
    QRCode.toDataURL(u, { width: 1024, margin: 2, errorCorrectionLevel: "H" })
      .then((d) => {
        setUrl(u);
        setDataUrl(d);
      })
      .catch(() => {
        setUrl(u);
        setDataUrl("");
      });
  }, [slug]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${slug}.png`;
    a.click();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <QrCode className="h-5 w-5 text-stone-700" aria-hidden />
        <h2 className="text-lg font-semibold text-stone-950">Código QR del evento</h2>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Apunta a la página pública del evento. Descárgalo en alta resolución para tu
        flyer o compártelo para que lo escaneen.
      </p>

      {!published && (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          El evento aún no está publicado. El QR ya funciona, pero la página pública
          solo será visible cuando publiques el evento.
        </p>
      )}

      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="Código QR del evento"
            className="h-44 w-44 shrink-0 rounded-md border border-stone-200 bg-white p-2"
          />
        ) : (
          <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-md border border-dashed border-stone-300 text-xs text-stone-400">
            Generando…
          </div>
        )}

        <div className="grid w-full gap-2.5">
          <code className="block break-all rounded bg-stone-50 px-2.5 py-1.5 text-xs text-stone-600">
            {url}
          </code>
          <button
            type="button"
            onClick={download}
            disabled={!dataUrl}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 sm:w-fit"
          >
            <Download className="h-4 w-4" aria-hidden />
            Descargar QR (PNG)
          </button>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 sm:w-fit"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden />
                Copiar enlace
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
