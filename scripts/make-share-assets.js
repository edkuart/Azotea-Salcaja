/**
 * make-share-assets.js
 * --------------------------------------------------------------
 * Genera los assets de marca para pestañas (favicon) y para compartir
 * (Open Graph / Twitter), a partir del emblema transparente de Chessitos.
 *
 * Salidas (convenciones de metadata-files de Next.js app router):
 *   src/app/icon.png            512x512 transparente  -> <link rel=icon>
 *   src/app/apple-icon.png      180x180 sobre navy     -> apple touch icon
 *   src/app/favicon.ico         16/32/48 (PNG en ICO)  -> /favicon.ico
 *   src/app/opengraph-image.png 1200x630 navy+emblema  -> og:image
 *   src/app/twitter-image.png   1200x630 (copia)       -> twitter:image
 *
 * Uso: node scripts/make-share-assets.js
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "images", "chessitos-salcaja-logo-512.png");
const APP = path.join(ROOT, "src", "app");

const NAVY = "#0B2A4A";
const NAVY_DEEP = "#06182E";

/** Emblema ajustado a un cuadrado de `size` con relleno transparente. */
function squareEmblem(size) {
  return sharp(SRC)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png();
}

/** Construye un .ico (con PNGs embebidos) a partir de buffers por tamaño. */
function buildIco(entries) {
  const count = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = [];
  const datas = [];
  let offset = 6 + count * 16;
  for (const { size, buffer } of entries) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buffer.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buffer.length;
    dir.push(e);
    datas.push(buffer);
  }
  return Buffer.concat([header, ...dir, ...datas]);
}

async function main() {
  // 1) icon.png — 512 transparente
  await squareEmblem(512).toFile(path.join(APP, "icon.png"));

  // 2) apple-icon.png — 180 sobre navy (los iconos de iOS no usan alfa)
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: NAVY },
  })
    .composite([{ input: await squareEmblem(164).toBuffer(), gravity: "center" }])
    .png()
    .toFile(path.join(APP, "apple-icon.png"));

  // 3) favicon.ico — 16/32/48
  const icoEntries = [];
  for (const size of [16, 32, 48]) {
    icoEntries.push({ size, buffer: await squareEmblem(size).toBuffer() });
  }
  fs.writeFileSync(path.join(APP, "favicon.ico"), buildIco(icoEntries));

  // 4) opengraph-image.png — 1200x630, emblema centrado sobre navy
  const W = 1200;
  const H = 630;
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
       <defs>
         <radialGradient id="g" cx="50%" cy="42%" r="70%">
           <stop offset="0%" stop-color="${NAVY}"/>
           <stop offset="100%" stop-color="${NAVY_DEEP}"/>
         </radialGradient>
       </defs>
       <rect width="${W}" height="${H}" fill="url(#g)"/>
       <circle cx="${W / 2}" cy="${H / 2}" r="300" fill="none"
               stroke="#C9A84C" stroke-opacity="0.18" stroke-width="2"/>
     </svg>`,
  );
  const emblem = await squareEmblem(480).toBuffer();
  await sharp(bg)
    .composite([{ input: emblem, gravity: "center" }])
    .png()
    .toFile(path.join(APP, "opengraph-image.png"));

  // 5) twitter-image.png — copia del OG
  fs.copyFileSync(
    path.join(APP, "opengraph-image.png"),
    path.join(APP, "twitter-image.png"),
  );

  for (const f of [
    "icon.png",
    "apple-icon.png",
    "favicon.ico",
    "opengraph-image.png",
    "twitter-image.png",
  ]) {
    const { size } = fs.statSync(path.join(APP, f));
    console.log(`generado src/app/${f}  ${(size / 1024).toFixed(0)} KB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
