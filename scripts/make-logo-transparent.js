/**
 * make-logo-transparent.js
 * --------------------------------------------------------------
 * El emblema de Chessitos viene con un fondo gris claro sólido
 * (#ECECEC, 24bpp, sin canal alfa). Este script:
 *   1. Lee el PNG como RGBA crudo.
 *   2. Hace flood-fill desde los bordes marcando como transparentes
 *      solo los píxeles de fondo gris/blanco CONECTADOS al borde.
 *      (Las zonas crema internas quedan intactas porque el aro
 *       dorado del emblema las encierra y detiene el relleno.)
 *   3. Recorta (trim) al bounding box del emblema con un pequeño margen.
 *   4. Guarda chessitos-salcaja-logo-transparent.png
 *
 * Uso: node scripts/make-logo-transparent.js
 */
const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "public", "images", "chessitos-salcaja-logo.png");
const OUT = path.join(__dirname, "..", "public", "images", "chessitos-salcaja-logo-transparent.png");

// Un píxel es "fondo" si es claro y neutro (gris/blanco), no un color del emblema.
function isBackground(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return r > 190 && g > 190 && b > 190 && max - min < 24;
}

async function main() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const idx = (x, y) => (y * width + x) * channels;

  // Flood fill (4-conexo) desde todo el borde.
  const visited = new Uint8Array(width * height);
  const stack = [];
  const pushIfBg = (x, y) => {
    const p = y * width + x;
    if (visited[p]) return;
    const i = p * channels;
    if (isBackground(data[i], data[i + 1], data[i + 2])) {
      visited[p] = 1;
      stack.push(x, y);
    }
  };

  for (let x = 0; x < width; x++) {
    pushIfBg(x, 0);
    pushIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfBg(0, y);
    pushIfBg(width - 1, y);
  }

  let removed = 0;
  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    data[idx(x, y) + 3] = 0; // alpha -> 0
    removed++;
    if (x > 0) pushIfBg(x - 1, y);
    if (x < width - 1) pushIfBg(x + 1, y);
    if (y > 0) pushIfBg(x, y - 1);
    if (y < height - 1) pushIfBg(x, y + 1);
  }

  console.log(`Píxeles de fondo a transparentes: ${removed.toLocaleString()} / ${(width * height).toLocaleString()}`);

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 1 }) // recorta el borde transparente al bounding box
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  console.log(`Generado: ${path.relative(path.join(__dirname, ".."), OUT)}`);
  console.log(`Dimensiones finales: ${meta.width} x ${meta.height} (alpha: ${meta.hasAlpha})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
