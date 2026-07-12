const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const QRCode = require("qrcode");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "docs", "pdf-drafts", "chessitos");
const logoPath = path.join(root, "public", "images", "chessitos-salcaja-logo.png");
const projectUrl = "https://azotea-salcaja.vercel.app/ajedrez/proyeccion";

const logoDataUri = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
let projectQrDataUri = "";

const materials = [
  ["Juegos completos de ajedrez", "15", "Q2,700"],
  ["Bolsas o estuches", "15", "Q1,050"],
  ["Relojes digitales", "10", "Q4,000"],
  ["Tablero mural / demostrativo", "1", "Q500"],
  ["Papelería y material didáctico", "1 lote", "Q300"],
  ["Premiación anual", "1 lote", "Q750"],
  ["Repuestos y reserva", "1 lote", "Q500"],
];

const municipalRequests = [
  "Aprobar el Programa Chessitos Salcajá como propuesta municipal de formación ajedrecística.",
  "Facilitar espacio, 10 mesas y 20 sillas como apoyo operativo.",
  "Autorizar Q9,800 de inversión inicial en materiales ajedrecísticos.",
  "Definir modalidad mensual: 3 días por semana o lunes a viernes.",
  "Apoyar el torneo municipal de cierre con aspiración regional.",
];

const nextSteps = [
  ["Semana 1", "Aprobación, sede, horario y convocatoria."],
  ["Semana 2", "Cotización, disponibilidad y compra de materiales."],
  ["Semana 3", "Inscripción, diagnóstico inicial y organización de grupos."],
  ["Agosto 2026", "Inicio de clases con control de asistencia y seguimiento."],
  ["Mes 12", "Torneo municipal con aspiración regional y reporte de resultados."],
];

const proposals = [
  {
    id: "3-dias",
    title: "Modalidad 3 días por semana",
    subtitle: "Propuesta de inicio sostenible",
    schedule: "3 días por semana, 2 horas por día",
    hours: "30 horas mensuales estimadas",
    monthly: "Q2,250",
    calculation: "30 horas mensuales x Q75 por hora",
    focus:
      "Una modalidad adecuada para iniciar el programa con constancia, medir asistencia y consolidar el grupo base antes de escalar.",
  },
  {
    id: "5-dias",
    title: "Modalidad lunes a viernes",
    subtitle: "Propuesta de continuidad intensiva",
    schedule: "5 días por semana, 2 horas por día",
    hours: "50 horas mensuales estimadas",
    monthly: "Q3,750",
    calculation: "50 horas mensuales x Q75 por hora",
    focus:
      "Una modalidad intensiva para acelerar el aprendizaje, dar mayor seguimiento técnico y formar un semillero municipal más constante.",
  },
];

const formats = [
  {
    id: "carta-formal",
    label: "Carta formal institucional",
    render: renderLetter,
  },
  {
    id: "dossier-visual",
    label: "Dossier visual",
    render: renderDossier,
  },
];

function moneyRows() {
  return materials
    .map(
      ([name, qty, amount]) =>
        `<tr><td>${name}</td><td class="center">${qty}</td><td class="right">${amount}</td></tr>`,
    )
    .join("");
}

function renderDigitalSupportBlock(variant = "letter") {
  const isCompact = variant === "compact";
  return `
    <div class="${isCompact ? "digital-card" : "digital-support"}">
      <div>
        <h2>Consulta digital y respaldo</h2>
        <p>
          Simulador de presupuesto, ruta anual, métricas de seguimiento y referencias ampliadas:
        </p>
        <p class="url">${projectUrl}</p>
        <p class="small muted">
          Precios referenciales basados en revisión de mercado. Proveedores locales: Maxi Despensa/Walmart Guatemala,
          Cemaco, Sears Guatemala y Pacifiko. Referencias internacionales: Wholesale Chess, Chess House y House of Staunton.
        </p>
        <p class="small muted">
          Antes de comprar, se recomienda confirmar cotización, disponibilidad vigente y condiciones de entrega.
        </p>
      </div>
      <img class="qr" src="${projectQrDataUri}" alt="QR de la sección Proyección Chessitos" />
    </div>
  `;
}

function renderMunicipalRequestBlock(variant = "letter") {
  const isCompact = variant === "compact";
  return `
    <div class="${isCompact ? "request-list card" : "section request-list"}">
      <h2>Qué se solicita a la Municipalidad</h2>
      <div class="request-items">
        ${municipalRequests
          .map((item) => `<p><strong>•</strong><span>${item}</span></p>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderNextStepsBlock(variant = "letter") {
  const isCompact = variant === "compact";
  return `
    <div class="${isCompact ? "steps-card card" : "section steps-card"}">
      <h2>Próximos pasos si se aprueba</h2>
      <div class="steps-grid">
        ${nextSteps
          .map(
            ([label, text]) => `
              <div class="step-item">
                <h3>${label}</h3>
                <p>${text}</p>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function baseStyles() {
  return `
    @page { size: letter; margin: 18mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #1f2933;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.45;
      background: #fffaf1;
    }
    h1, h2, h3, p { margin: 0; }
    h1 { font-size: 26px; color: #102a43; letter-spacing: .01em; }
    h2 { font-size: 18px; color: #12355b; margin-bottom: 8px; }
    h3 { font-size: 13px; color: #7a4d12; text-transform: uppercase; letter-spacing: .08em; }
    p { font-size: 11.5px; }
    table { width: 100%; border-collapse: collapse; font-size: 10.8px; }
    thead { display: table-header-group; }
    th {
      background: #102a43;
      color: white;
      text-align: left;
      padding: 8px;
      font-weight: 700;
    }
    td { border-bottom: 1px solid #e7d9bd; padding: 7px 8px; vertical-align: top; }
    .right { text-align: right; }
    .center { text-align: center; }
    .muted { color: #596875; }
    .small { font-size: 10px; }
    .url {
      color: #0f4c81;
      font-size: 10.5px;
      font-weight: 700;
      margin-top: 5px;
      word-break: break-word;
    }
    .qr {
      width: 86px;
      height: 86px;
      flex: 0 0 auto;
      border: 1px solid #d8c49c;
      background: white;
      padding: 6px;
    }
    .logo {
      width: 88px;
      height: 88px;
      object-fit: cover;
      border-radius: 50%;
      clip-path: circle(48% at 50% 50%);
      background: #fffaf1;
    }
    .page-break { page-break-before: always; }
    .signature { margin-top: 28px; padding-top: 16px; border-top: 1px solid #9f7b3e; width: 280px; }
    .request-items { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; margin-top: 8px; }
    .request-items p { display: flex; gap: 7px; align-items: flex-start; font-size: 10.8px; line-height: 1.38; }
    .request-items strong { color: #b98b3b; font-size: 14px; line-height: 1; }
    .steps-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 8px; }
    .step-item { border: 1px solid #e1c99f; border-radius: 8px; padding: 9px; background: #fffaf1; }
    .step-item h3 { font-size: 10px; margin-bottom: 5px; }
    .step-item p { font-size: 9.7px; line-height: 1.35; }
    h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
    table, tr, .section, .box, .note, .card, .request, .timeline, .signature, .digital-support, .digital-card, .request-list, .steps-card, .step-item {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `;
}

function renderLetter(proposal) {
  return `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>Programa Chessitos Salcajá - ${proposal.title} - Carta formal</title>
      <style>
        ${baseStyles()}
        body { background: white; }
        .header { display: flex; align-items: center; gap: 18px; border-bottom: 3px solid #b98b3b; padding-bottom: 14px; margin-bottom: 18px; }
        .brand { flex: 1; }
        .brand p { margin-top: 4px; }
        .date { text-align: right; font-size: 11px; color: #596875; }
        .recipient { margin: 18px 0; font-size: 11.5px; }
        .subject { background: #fff7e6; border-left: 4px solid #b98b3b; padding: 10px 12px; margin: 16px 0; }
        .section { margin-top: 16px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
        .box { border: 1px solid #e7d9bd; padding: 12px; background: #fffaf1; border-radius: 8px; }
        .amount { font-size: 24px; color: #102a43; font-weight: 800; margin-top: 4px; }
        .note { background: #eff8ff; border: 1px solid #bdd7ee; padding: 10px; margin-top: 12px; border-radius: 8px; }
        .digital-support {
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid #d8c49c;
          border-radius: 10px;
          padding: 12px;
          margin-top: 16px;
          background: #fffaf1;
        }
      </style>
    </head>
    <body>
      <header class="header">
        <img class="logo" src="${logoDataUri}" alt="Logo Chessitos Salcajá" />
        <div class="brand">
          <h1>Programa Chessitos Salcajá</h1>
          <p class="muted">${proposal.title}</p>
        </div>
        <div class="date">Salcajá, Quetzaltenango,<br />junio de 2026</div>
      </header>

      <section class="recipient">
        <strong>Lic. Wiliam Bernard Calderón de León</strong><br />
        Alcalde Municipal de Salcajá<br />
        y Honorable Concejo Municipal<br />
        Municipalidad de Salcajá, Quetzaltenango<br />
        Su despacho
      </section>

      <section class="subject">
        <strong>Asunto:</strong> Solicitud de apoyo municipal para implementación del Programa Chessitos Salcajá, ${proposal.schedule.toLowerCase()}.
      </section>

      <p>
        Respetuosamente presentamos a consideración de la Municipalidad de Salcajá el Programa Chessitos Salcajá,
        una iniciativa de formación ajedrecística para niñas, niños y jóvenes del municipio. El programa busca dejar
        capacidad instalada mediante materiales reutilizables, clases constantes y una ruta de seguimiento que permita
        medir asistencia, avance técnico y participación comunitaria.
      </p>

      <div class="section">
        <h2>Modalidad propuesta</h2>
        <p>${proposal.focus}</p>
        <div class="grid">
          <div class="box">
            <h3>Horario de atención</h3>
            <p>${proposal.schedule}</p>
            <p class="muted small">Inicio estimado: agosto de 2026, a partir de la aprobación municipal.</p>
          </div>
          <div class="box">
            <h3>Sostenibilidad mensual</h3>
            <p class="amount">${proposal.monthly}</p>
            <p class="muted small">${proposal.calculation}. Incluye facturación, impuestos y transporte.</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Inversión inicial solicitada</h2>
        <table>
          <thead><tr><th>Categoría</th><th class="center">Cantidad</th><th class="right">Estimado</th></tr></thead>
          <tbody>
            ${moneyRows()}
            <tr><td><strong>Total inversión inicial solicitada</strong></td><td></td><td class="right"><strong>Q9,800</strong></td></tr>
          </tbody>
        </table>
      </div>

      <div class="section page-break">
        <h2>Requerimiento operativo municipal</h2>
        <p>
          Para operar adecuadamente se solicita facilitar un espacio municipal apto para 15 a 20 estudiantes,
          10 mesas y 20 sillas. Estos elementos se plantean como apoyo operativo, no como compra directa dentro
          de la inversión inicial solicitada.
        </p>
      </div>

      <div class="note">
        <p>
          Al cierre del primer ciclo se propone realizar un torneo municipal con aspiración regional, solicitando
          apoyo en trofeos, contactos institucionales y gestión de patrocinadores para mostrar públicamente los frutos
          del proceso formativo.
        </p>
      </div>

      ${renderDigitalSupportBlock("letter")}

      ${renderMunicipalRequestBlock("letter")}

      ${renderNextStepsBlock("letter")}

      <div class="section">
        <h2>Profesor asignado</h2>
        <p>
          La ejecución formativa estará a cargo de Edwart Daniel Enríquez Manrique, vecino de Salcajá, jugador
          registrado ante FIDE por la Federación de Guatemala con ID 7306091 e involucrado activamente en el ajedrez
          desde 2010. Ha participado en procesos de selección nacional en categorías inferiores durante tres años
          consecutivos y cuenta con experiencia como profesor de ajedrez en distintos proyectos formativos.
        </p>
      </div>

      <div class="note">
        <p>
          Para más información, coordinación de reunión o ampliación de detalles técnicos y operativos, la Municipalidad
          puede comunicarse directamente con Edwart Daniel Enríquez Manrique al teléfono +502 3526 2791 o al correo
          edkuart@gmail.com.
        </p>
      </div>

      <div class="signature">
        <strong>Edwart Daniel Enríquez Manrique</strong><br />
        Profesor asignado<br />
        Programa Chessitos Salcajá<br />
        Tel. +502 3526 2791<br />
        edkuart@gmail.com
      </div>
    </body>
  </html>`;
}

function renderDossier(proposal) {
  return `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>Programa Chessitos Salcajá - ${proposal.title} - Dossier visual</title>
      <style>
        ${baseStyles()}
        @page { size: letter; margin: 14mm; }
        body { background: #fbf4e4; }
        .cover {
          min-height: 238mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 18mm;
          background:
            radial-gradient(circle at 70% 18%, rgba(190, 138, 54, .28), transparent 28%),
            linear-gradient(135deg, #fff6df 0%, #f6e2b8 56%, #d6a85f 100%);
          border: 1px solid #d0a251;
        }
        .cover-top { display: flex; align-items: center; gap: 20px; }
        .cover .logo { width: 142px; height: 142px; }
        .eyebrow { color: #8a5a18; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 8px; }
        .cover h1 { font-size: 42px; line-height: 1.05; max-width: 470px; }
        .cover h2 { font-size: 22px; margin-top: 14px; color: #37516f; }
        .hero-card { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 28px; }
        .metric { background: rgba(255,255,255,.74); border: 1px solid rgba(151,100,28,.28); border-radius: 10px; padding: 14px; }
        .metric strong { display: block; font-size: 24px; color: #102a43; }
        .metric span { font-size: 10.5px; color: #596875; }
        .footer-cover { color: #30455b; display: flex; justify-content: space-between; align-items: end; font-size: 11px; }
        .page { background: #fffdf7; min-height: 238mm; padding: 16mm; border: 1px solid #ead9b8; }
        .split { display: grid; grid-template-columns: 1.05fr .95fr; gap: 16px; }
        .card { background: white; border: 1px solid #ead9b8; border-radius: 10px; padding: 14px; margin-bottom: 12px; }
        .pill { display: inline-block; background: #102a43; color: white; padding: 5px 9px; border-radius: 999px; font-size: 10px; font-weight: 700; margin-bottom: 8px; }
        .request { background: #102a43; color: white; border-radius: 12px; padding: 18px; }
        .request h2 { color: white; }
        .request .amount { color: #ffd97a; font-size: 34px; }
        .timeline { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .digital-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1px solid #ead9b8;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 12px;
        }
        .digital-card h2 { font-size: 15px; margin-bottom: 5px; }
        .digital-card .qr { width: 78px; height: 78px; }
        .page .request-items p { font-size: 10.4px; }
        .page .steps-grid { grid-template-columns: repeat(5, 1fr); }
        .page .steps-card h2 { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <section class="cover">
        <div>
          <div class="cover-top">
            <img class="logo" src="${logoDataUri}" alt="Logo Chessitos Salcajá" />
            <div>
              <p class="eyebrow">Propuesta municipal de formación ajedrecística</p>
              <h1>Programa Chessitos Salcajá</h1>
              <h2>${proposal.title}</h2>
            </div>
          </div>
          <div class="hero-card">
            <div class="metric"><strong>Q9,800</strong><span>inversión inicial en materiales</span></div>
            <div class="metric"><strong>${proposal.monthly}</strong><span>sostenibilidad mensual del profesor</span></div>
            <div class="metric"><strong>15-20</strong><span>estudiantes objetivo inicial</span></div>
          </div>
        </div>
        <div class="footer-cover">
          <div>Dirigido al Lic. Wiliam Bernard Calderón de León, Alcalde Municipal de Salcajá, y Honorable Concejo Municipal.</div>
          <div>Fecha de propuesta: Salcajá, Quetzaltenango, junio de 2026.</div>
        </div>
      </section>

      <section class="page page-break">
        <div class="split">
          <div>
            <div class="card">
              <span class="pill">Objetivo</span>
              <h2>Dejar capacidad instalada en Salcajá</h2>
              <p>
                Chessitos Salcajá propone una ruta de clases de ajedrez con materiales propios del programa,
                seguimiento mensual y cierre público mediante torneo municipal con aspiración regional.
              </p>
            </div>
            <div class="card">
              <span class="pill">Modalidad</span>
              <h2>${proposal.subtitle}</h2>
              <p>${proposal.focus}</p>
              <p class="muted">${proposal.schedule}. ${proposal.hours}.</p>
            </div>
            <div class="card">
              <span class="pill">Requerimiento operativo</span>
              <p>
                La municipalidad facilitaría espacio adecuado, 10 mesas y 20 sillas para atender de forma ordenada
                a un grupo inicial de 15 a 20 estudiantes.
              </p>
            </div>
          </div>
          <div>
            <div class="request">
              <h2>Solicitud económica</h2>
              <p>Inversión inicial</p>
              <div class="amount">Q9,800</div>
              <p class="small">Materiales ajedrecísticos reutilizables e inventariables.</p>
              <hr />
              <p>Sostenibilidad mensual</p>
              <div class="amount">${proposal.monthly}</div>
              <p class="small">${proposal.calculation}. Incluye facturación, impuestos y transporte.</p>
            </div>
          </div>
        </div>

        ${renderDigitalSupportBlock("compact")}

        ${renderMunicipalRequestBlock("compact")}

        <div class="card">
          <h2>Materiales de inversión inicial</h2>
          <table>
            <thead><tr><th>Categoría</th><th class="center">Cantidad</th><th class="right">Estimado</th></tr></thead>
            <tbody>
              ${moneyRows()}
              <tr><td><strong>Total inversión inicial solicitada</strong></td><td></td><td class="right"><strong>Q9,800</strong></td></tr>
            </tbody>
          </table>
        </div>

        ${renderNextStepsBlock("compact")}

        <div class="card">
          <h2>Profesor asignado</h2>
          <p>
            Edwart Daniel Enríquez Manrique, vecino de Salcajá, jugador registrado ante FIDE por la Federación
            de Guatemala con ID 7306091. Involucrado activamente en el ajedrez desde 2010, con experiencia como
            profesor y participación en procesos de selección nacional en categorías inferiores durante tres años consecutivos.
          </p>
          <p class="muted small">
            Para más información, coordinación de reunión o ampliación de detalles técnicos y operativos:
            +502 3526 2791 · edkuart@gmail.com
          </p>
        </div>
      </section>
    </body>
  </html>`;
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  projectQrDataUri = await QRCode.toDataURL(projectUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 180,
  });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const proposal of proposals) {
    for (const format of formats) {
      const html = format.render(proposal);
      const baseName = `programa-chessitos-salcaja-${proposal.id}-${format.id}`;
      const htmlPath = path.join(outputDir, `${baseName}.html`);
      const pdfPath = path.join(outputDir, `${baseName}.pdf`);
      fs.writeFileSync(htmlPath, html, "utf8");
      await page.setContent(html, { waitUntil: "load" });
      await page.pdf({
        path: pdfPath,
        format: "Letter",
        printBackground: true,
        preferCSSPageSize: true,
      });
      console.log(`Generated ${path.relative(root, pdfPath)}`);
    }
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
