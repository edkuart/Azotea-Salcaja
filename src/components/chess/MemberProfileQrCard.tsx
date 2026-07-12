"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, QrCode } from "lucide-react";

export function MemberProfileQrCard({
  path,
  fileName,
}: {
  path: string;
  fileName: string;
}) {
  const [url, setUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const nextUrl = `${window.location.origin}${path}`;
    setUrl(nextUrl);
    QRCode.toDataURL(nextUrl, {
      width: 900,
      margin: 2,
      errorCorrectionLevel: "H",
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [path]);

  function download() {
    if (!dataUrl) return;
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = `${fileName}.png`;
    anchor.click();
  }

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-w-0 border-2 border-[var(--color-ink)] bg-white p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <QrCode className="h-5 w-5 text-[var(--color-navy)]" aria-hidden />
        <h3 className="font-semibold text-stone-950">QR del perfil</h3>
      </div>
      <p className="mt-1 text-[11px] leading-4 text-stone-500 sm:text-xs sm:leading-5">
        Enlace público autorizado. Si el perfil vuelve a privado, este QR deja
        de mostrar la ficha.
      </p>

      <div className="mt-3 grid min-w-0 grid-cols-[auto_1fr] items-start gap-3 sm:mt-4 sm:flex sm:gap-4">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="Código QR del perfil público"
            className="h-24 w-24 shrink-0 border border-stone-200 bg-white sm:h-32 sm:w-32"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-dashed border-stone-300 text-xs text-stone-400 sm:h-32 sm:w-32">
            Generando
          </div>
        )}

        <div className="grid min-w-0 flex-1 gap-2">
          <code className="line-clamp-3 block break-all bg-stone-50 px-2 py-1.5 text-[10px] leading-4 text-stone-600 sm:text-xs">
            {url}
          </code>
          <div className="grid gap-1.5 sm:flex sm:flex-row sm:gap-2">
            <button
              type="button"
              onClick={download}
              disabled={!dataUrl}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-sm bg-stone-950 px-3 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 sm:min-h-11 sm:px-4 sm:text-sm"
            >
              <Download className="h-4 w-4" aria-hidden />
              Descargar
            </button>
            <button
              type="button"
              onClick={copy}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-sm border border-stone-300 px-3 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 sm:min-h-11 sm:px-4 sm:text-sm"
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
    </div>
  );
}
