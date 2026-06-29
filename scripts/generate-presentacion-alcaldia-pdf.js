/**
 * Genera el PDF descargable de la presentación municipal de Chessitos.
 *
 * Sirve el deck estático (public/presentacion-alcaldia/) y usa Playwright para
 * exportarlo a PDF. deck-stage.js define `@media print` (una diapositiva por
 * página, al tamaño 1920×1080 vía @page, sin rail), así que con
 * preferCSSPageSize cada slide queda en su propia página 16:9 horizontal.
 *
 * Salida: public/docs/chessitos/chessitos-salcaja-presentacion-alcaldia.pdf
 * Uso: node scripts/generate-presentacion-alcaldia-pdf.js
 */
const path = require("node:path");
const http = require("node:http");
const fs = require("node:fs");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const outPath = path.join(
  publicDir,
  "docs",
  "chessitos",
  "chessitos-salcaja-presentacion-alcaldia.pdf",
);

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".css": "text/css",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(publicDir, p);
      if (!file.startsWith(publicDir)) {
        res.writeHead(403);
        res.end("forbidden");
        return;
      }
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("404");
          return;
        }
        res.writeHead(200, {
          "content-type": MIME[path.extname(file)] || "application/octet-stream",
        });
        res.end(data);
      });
    });
    server.listen(0, () => resolve(server));
  });
}

(async () => {
  const server = await startServer();
  const port = server.address().port;
  const url = `http://localhost:${port}/presentacion-alcaldia/`;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    // Esperar fuentes y el dibujado del QR (se genera en window.load).
    await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
    await page.waitForTimeout(2500);

    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(400);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await page.pdf({
      path: outPath,
      printBackground: true,
      preferCSSPageSize: true, // usa el @page 1920×1080 del deck → 16:9 horizontal
    });
  } finally {
    await browser.close();
    server.close();
  }

  const { size } = fs.statSync(outPath);
  console.log(
    `PDF generado: ${path.relative(root, outPath)} · ${(size / 1024 / 1024).toFixed(2)} MB`,
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
