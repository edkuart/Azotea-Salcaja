import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Handshake,
  LineChart,
  ListChecks,
  Medal,
  Megaphone,
  PackageCheck,
  ShieldCheck,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import { ProjectionBudgetSimulator } from "@/components/chess/ProjectionBudgetSimulator";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { chessCommunity } from "@/modules/chess/public-data";
import { restaurantInfo } from "@/modules/restaurant/public-data";

export const metadata: Metadata = {
  title: "Proyección Chessitos — Programa municipal de ajedrez",
  description:
    "Propuesta institucional de Chessitos para instalar un programa municipal de ajedrez con formación, materiales propios, presupuesto flexible y ruta anual de competencia.",
};

const whatsappMessage = encodeURIComponent(
  "Hola, me interesa conversar sobre Proyección Chessitos como programa municipal de ajedrez.",
);

const quickStats = [
  { label: "Grupo inicial", value: "15-20 alumnos" },
  { label: "Jornada mínima", value: "2 horas" },
  { label: "Modalidades", value: "3 o 5 días" },
  { label: "Meta anual", value: "Torneo regional" },
];

const executiveCards = [
  {
    icon: BookOpen,
    title: "Formación",
    description:
      "Clases progresivas con diagnóstico, fundamentos, táctica, uso de reloj, disciplina de torneo y seguimiento por niveles.",
  },
  {
    icon: PackageCheck,
    title: "Equipamiento",
    description:
      "Juegos, tableros, bolsas y relojes que pueden quedar inventariados, con mobiliario municipal como apoyo operativo.",
  },
  {
    icon: Trophy,
    title: "Competencia",
    description:
      "Ranking interno, torneos de práctica y una meta anual de competencia municipal con alcance regional o departamental.",
  },
];

const supportModel = [
  {
    icon: Building2,
    title: "La municipalidad instala la base",
    items: [
      "Sede o espacio de clases.",
      "Convocatoria a niños y jóvenes.",
      "Compra de juegos, relojes y material didáctico.",
      "Apoyo logístico para torneo anual.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Chessitos aporta dirección técnica",
    items: [
      "Planificación mensual.",
      "Clases presenciales.",
      "Control de asistencia.",
      "Evaluación, ranking y torneos de práctica.",
    ],
  },
  {
    icon: Users,
    title: "La comunidad recibe continuidad",
    items: [
      "Un programa medible, no clases aisladas.",
      "Materiales que quedan para futuras generaciones.",
      "Ruta para alumnos constantes.",
      "Primer cierre competitivo al año.",
    ],
  },
];

const teacherPackages = [
  {
    label: "3 días por semana",
    hours: "6 h/semana",
    amount: "Q2,250",
    note: "Inicio sostenible con buen ritmo y menor carga presupuestaria.",
  },
  {
    label: "Lunes a viernes",
    hours: "10 h/semana",
    amount: "Q3,750",
    note: "Ruta intensiva para mayor continuidad y avance del grupo.",
  },
];

const annualPlan = [
  {
    range: "Meses 1-2",
    title: "Base y diagnóstico",
    result:
      "Grupo ordenado, niveles identificados y primeros hábitos de clase.",
    items: [
      "Reglas",
      "Movimiento de piezas",
      "Jaque mate",
      "Respeto de tablero",
    ],
  },
  {
    range: "Meses 3-4",
    title: "Fundamentos tácticos",
    result:
      "Alumnos capaces de jugar partidas completas y reconocer amenazas simples.",
    items: ["Capturas", "Defensa", "Ataques dobles", "Mates básicos"],
  },
  {
    range: "Meses 5-6",
    title: "Reloj y ranking interno",
    result: "Primer grupo constante y medición inicial de desempeño.",
    items: ["Uso de reloj", "Finales básicos", "Ranking", "Mini torneos"],
  },
  {
    range: "Meses 7-9",
    title: "Preparación competitiva",
    result:
      "Alumnos con experiencia de torneo y mejor comprensión competitiva.",
    items: ["Partidas anotadas", "Análisis", "Torneos internos", "Selección"],
  },
  {
    range: "Meses 10-12",
    title: "Torneo y proyección",
    result: "Primer cierre formal del programa y evidencia pública del avance.",
    items: ["Torneo municipal", "Invitados", "Premiación", "Reporte final"],
  },
];

const metrics = [
  "Alumnos inscritos.",
  "Asistencia promedio.",
  "Alumnos activos después de 3, 6 y 12 meses.",
  "Partidas jugadas y torneos internos realizados.",
  "Alumnos que aprenden a usar reloj.",
  "Materiales inventariados y disponibles.",
];

const evidenceCards = [
  {
    icon: Brain,
    label: "Meta-análisis",
    title: "Efectos moderados, especialmente en matemática",
    stat: "24 estudios",
    description:
      "Una revisión de Sala y Gobet reporta efectos positivos moderados en habilidades cognitivas y académicas, con tendencia más fuerte en matemática que en lectura.",
    source: "Frontiers in Psychology / Educational Research Review",
    href: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00238/full",
  },
  {
    icon: BarChart3,
    label: "Tiempo mínimo",
    title: "La continuidad importa más que la clase aislada",
    stat: "25-30 h",
    description:
      "La misma revisión advierte que el beneficio se relaciona con duración del entrenamiento; por eso el programa propone varios meses de práctica constante.",
    source: "Sala & Gobet, 2016/2017",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5322219/",
  },
  {
    icon: Users,
    label: "Estudio escolar",
    title: "Beneficio cognitivo y socioemocional",
    stat: "170 alumnos",
    description:
      "Aciego, García y Betancort estudiaron escolares de 6 a 16 años y reportaron mejoras en habilidades cognitivas, afrontamiento, resolución de problemas y desarrollo socioafectivo.",
    source: "The Spanish Journal of Psychology",
    href: "https://pubmed.ncbi.nlm.nih.gov/22774429/",
  },
  {
    icon: ClipboardCheck,
    label: "Criterio responsable",
    title: "Medir resultados, no prometer milagros",
    stat: "3, 6 y 12 meses",
    description:
      "La literatura también señala límites metodológicos. Por eso Chessitos propone seguimiento real: asistencia, permanencia, torneos internos y avance técnico.",
    source: "Research & Development Journal review",
    href: "https://rsdjournal.org/rsd/article/view/3410",
  },
];

const publicValueCards = [
  {
    icon: Building2,
    title: "Capacidad instalada municipal",
    description:
      "Los materiales quedan como activos reutilizables para nuevas generaciones, no como gasto de una sola actividad.",
  },
  {
    icon: Megaphone,
    title: "Resultados visibles para la comunidad",
    description:
      "Clases, ranking interno y torneo municipal permiten comunicar avances con fotos, reportes y participación familiar.",
  },
  {
    icon: Medal,
    title: "Reconocimiento institucional",
    description:
      "Cada actividad puede agradecer el apoyo municipal de forma sobria, educativa y no partidaria.",
  },
  {
    icon: Target,
    title: "Ruta de talento local",
    description:
      "El programa identifica alumnos constantes y crea un camino hacia fogueos regionales o departamentales.",
  },
];

const projectionRows = [
  {
    label: "Días de clase",
    threeDays: "3 días por semana",
    weekdays: "5 días por semana",
  },
  { label: "Horas por día", threeDays: "2 horas", weekdays: "2 horas" },
  {
    label: "Base mensual",
    threeDays: "30 horas estimadas",
    weekdays: "50 horas estimadas",
  },
  {
    label: "Sostenibilidad mensual",
    threeDays: "Q2,250",
    weekdays: "Q3,750",
  },
  {
    label: "Inversión inicial",
    threeDays: "Q9,800",
    weekdays: "Q9,800",
  },
  {
    label: "Meta inicial",
    threeDays: "15-20 estudiantes",
    weekdays: "15-20 estudiantes",
  },
  {
    label: "Requerimiento municipal",
    threeDays: "Espacio, 10 mesas, 20 sillas",
    weekdays: "Espacio, 10 mesas, 20 sillas",
  },
];

const costSources = [
  {
    group: "Compra local",
    examples: "Maxi Despensa/Walmart Guatemala, Cemaco, Sears, Pacifiko",
    use: "Referencia para disponibilidad local, mobiliario, juegos básicos y compras rápidas.",
  },
  {
    group: "Compra especializada",
    examples: "Wholesale Chess, Chess House, House of Staunton",
    use: "Referencia para relojes, bolsas, sets escolares, premios y equipo más específico.",
  },
  {
    group: "Estándares técnicos",
    examples: "FIDE Handbook",
    use: "Referencia para hablar de equipo adecuado, relojes y condiciones formales de juego.",
  },
];

const communityLessons = [
  "La comunidad ajedrecística insiste en constancia: jugar, resolver problemas y analizar partidas.",
  "Para niños, la motivación pesa: puzzles, torneos amistosos, preguntas guiadas y metas visibles funcionan mejor que solo teoría.",
  "Los torneos no son premio final únicamente; son parte del aprendizaje porque enseñan manejo de reloj, pérdidas, respeto y concentración.",
];

const municipalRequests = [
  "Aprobar el Programa Chessitos Salcajá como propuesta municipal de formación ajedrecística.",
  "Facilitar un espacio adecuado para 15 a 20 estudiantes.",
  "Facilitar 10 mesas y 20 sillas como requerimiento operativo.",
  "Autorizar la inversión inicial referencial de Q9,800 en materiales ajedrecísticos.",
  "Definir modalidad mensual: Q2,250 por 3 días o Q3,750 por lunes a viernes.",
  "Apoyar el torneo municipal de cierre con aspiración regional.",
];

const nextSteps = [
  {
    label: "Semana 1",
    title: "Aprobación y sede",
    description:
      "Confirmar modalidad, espacio municipal, horario, responsable de coordinación y convocatoria.",
  },
  {
    label: "Semana 2",
    title: "Cotización y compra",
    description:
      "Confirmar proveedores, disponibilidad, precios vigentes y compra de materiales ajedrecísticos.",
  },
  {
    label: "Semana 3",
    title: "Inscripción",
    description:
      "Registrar estudiantes, organizar grupos, validar mobiliario y preparar diagnóstico inicial.",
  },
  {
    label: "Agosto 2026",
    title: "Inicio de clases",
    description:
      "Arrancar con control de asistencia, base técnica, reglas, disciplina de tablero y seguimiento mensual.",
  },
  {
    label: "Mes 12",
    title: "Torneo municipal",
    description:
      "Presentar resultados, premiar avance y proyectar un evento con aspiración regional.",
  },
];

const pdfDownloads = [
  {
    title: "Propuesta 3 días",
    description: "Versión formal para revisión institucional.",
    href: "/docs/chessitos/chessitos-salcaja-3-dias-carta-formal.pdf",
  },
  {
    title: "Propuesta 3 días visual",
    description: "Versión tipo dossier para presentar y compartir.",
    href: "/docs/chessitos/chessitos-salcaja-3-dias-dossier-visual.pdf",
  },
  {
    title: "Propuesta lunes a viernes",
    description: "Versión formal para modalidad intensiva.",
    href: "/docs/chessitos/chessitos-salcaja-5-dias-carta-formal.pdf",
  },
  {
    title: "Propuesta lunes a viernes visual",
    description: "Dossier visual para la modalidad intensiva.",
    href: "/docs/chessitos/chessitos-salcaja-5-dias-dossier-visual.pdf",
  },
];

const providerLinks = [
  {
    title: "Maxi Despensa / Walmart Guatemala",
    description:
      "Referencia local para juegos básicos y disponibilidad nacional.",
    href: "https://www.maxidespensa.com.gt/juego-de-mesa-ajedrez-gt6573-4-1/p",
  },
  {
    title: "Cemaco",
    description: "Referencia local para mesas plegables y sillas plásticas.",
    href: "https://www.cemaco.com/",
  },
  {
    title: "Pacifiko",
    description:
      "Referencia local de comercio electrónico para comparar precios.",
    href: "https://www.pacifiko.com/",
  },
  {
    title: "Wholesale Chess",
    description: "Proveedor especializado en sets, bolsas, relojes y premios.",
    href: "https://www.wholesalechess.com/",
  },
  {
    title: "Chess House",
    description: "Referencia especializada para clubes, escuelas y relojes.",
    href: "https://www.chesshouse.com/collections/chess-for-schools-clubs",
  },
  {
    title: "FIDE Equipment Standards",
    description: "Referencia técnica internacional para equipo de ajedrez.",
    href: "https://handbook.fide.com/chapter/ChessEquipmentWithoutElectronicComponenets032026",
  },
];

const faqs = [
  {
    question: "¿Por qué no pedir solo tableros?",
    answer:
      "Porque el programa busca enseñar, practicar y competir. Los relojes, bolsas, tablero mural, material didáctico y premiación permiten sostener clases, cuidar equipo y preparar torneos.",
  },
  {
    question: "¿Por qué pagar profesor mensualmente?",
    answer:
      "La continuidad es el corazón del proyecto. El pago mensual cubre clase, planificación, seguimiento, traslado, facturación y dirección técnica.",
  },
  {
    question: "¿Qué pasa si algunos alumnos dejan de asistir?",
    answer:
      "Se medirá asistencia y permanencia. El grupo inicial de 15 a 20 alumnos permite reposición, convocatoria continua y ranking interno sin detener el programa.",
  },
  {
    question: "¿Cómo se mide el avance?",
    answer:
      "Con asistencia, partidas jugadas, ejercicios, uso de reloj, torneos internos, ranking y un cierre municipal donde se pueda mostrar progreso.",
  },
  {
    question: "¿Qué queda para la municipalidad?",
    answer:
      "Quedan materiales inventariables, experiencia operativa, alumnos identificados, reportes de avance y una base para repetir o ampliar el programa.",
  },
];

const references = [
  {
    title: "Meta-análisis sobre instrucción de ajedrez",
    description:
      "Revisión de 24 estudios sobre transferencia a habilidades cognitivas y académicas, con cautelas metodológicas.",
    href: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00238/full",
  },
  {
    title: "Beneficios cognitivos y socioemocionales",
    description:
      "Estudio con escolares de 6 a 16 años sobre capacidades cognitivas, afrontamiento y desarrollo socioafectivo.",
    href: "https://pubmed.ncbi.nlm.nih.gov/22774429/",
  },
  {
    title: "Reglamento FIDE de rating",
    description:
      "Referencia para explicar que el Elo oficial depende de torneos registrados y condiciones federativas.",
    href: "https://handbook.fide.com/chapter/B022024",
  },
  {
    title: "Estándares FIDE de equipo",
    description:
      "Referencia para hablar de equipo adecuado sin prometer certificación formal del programa.",
    href: "https://handbook.fide.com/chapter/ChessEquipmentWithoutElectronicComponenets032026",
  },
  {
    title: "Código Municipal",
    description:
      "Base administrativa general para conversar sobre programas, servicios y formas de apoyo municipal.",
    href: "https://www.congreso.gob.gt/assets/uploads/info_legislativo/decretos/2002/gtdcx12-2002.pdf",
  },
];

export default function ProyeccionPage() {
  return (
    <PublicLayout>
      <main>
        <section
          style={{
            background: "var(--color-ink)",
            backgroundImage: `linear-gradient(90deg, rgba(26,26,26,0.95), rgba(26,26,26,0.62)), url(${chessCommunity.image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            color: "var(--color-cream)",
            borderBottom: "4px solid var(--color-stage)",
          }}
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-8">
            <div>
              <Link
                href="/ajedrez"
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                  color: "var(--color-marquee)",
                  textDecoration: "none",
                  display: "inline-block",
                  marginBottom: "20px",
                }}
              >
                Ajedrez
              </Link>
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  fontSize: "11px",
                  color: "var(--color-stage)",
                  marginBottom: "14px",
                }}
              >
                Propuesta municipal · Formación · Competencia
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 8vw, 6.4rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.01em",
                  maxWidth: "760px",
                }}
              >
                Proyección{" "}
                <em
                  style={{
                    fontFamily: "var(--font-chess)",
                    fontStyle: "italic",
                    color: "var(--color-stage)",
                  }}
                >
                  Chessitos
                </em>
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-lg)",
                  lineHeight: 1.6,
                  color: "rgba(255,253,208,0.84)",
                  maxWidth: "650px",
                  marginTop: "22px",
                }}
              >
                Un programa municipal de ajedrez para formar niños y jóvenes con
                disciplina, pensamiento estratégico, competencia sana y
                materiales propios para la comunidad.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#presupuesto" className="btn btn-primary">
                  Ver presupuesto
                  <ArrowRight style={{ width: 14, height: 14 }} aria-hidden />
                </a>
                <a href="#plan-anual" className="btn btn-secondary">
                  Ver plan anual
                </a>
              </div>
            </div>

            <div
              style={{
                border: "2px solid rgba(255,253,208,0.18)",
                background: "rgba(255,253,208,0.07)",
                padding: "22px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontSize: "10px",
                  color: "var(--color-marquee)",
                  marginBottom: "16px",
                }}
              >
                Datos de arranque
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickStats.map((stat) => (
                  <div key={stat.label}>
                    <p
                      style={{
                        fontFamily: "var(--font-poster)",
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        fontSize: "9px",
                        color: "rgba(255,253,208,0.52)",
                        marginBottom: "4px",
                      }}
                    >
                      {stat.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.55rem",
                        lineHeight: 1,
                        color: "var(--color-cream)",
                      }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.55,
                  color: "rgba(255,253,208,0.68)",
                  marginTop: "18px",
                }}
              >
                La municipalidad no solo financia horas de clase; invierte en
                una base propia de ajedrez que puede seguir creciendo año con
                año.
              </p>
            </div>
          </div>
        </section>

        {/* Presentación entregada a Alcaldía */}
        <div
          style={{
            background: "var(--color-grain)",
            borderBottom: "2px solid var(--color-ink)",
          }}
        >
          <Section>
            <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <p
                  className="eyebrow"
                  style={{ color: "var(--color-stage)", marginBottom: 12 }}
                >
                  Presentación entregada a Alcaldía
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.9rem, 4.6vw, 3rem)",
                    lineHeight: 1.02,
                    color: "var(--color-ink)",
                    marginBottom: "12px",
                  }}
                >
                  La propuesta que vio el Concejo, aquí.
                </h2>
                <p style={{ lineHeight: 1.7, color: "#444" }}>
                  Esta es la presentación entregada al Lic. Wiliam Bernard
                  Calderón de León, Alcalde Municipal de Salcajá, y al Honorable
                  Concejo Municipal. Puedes revisarla en pantalla o descargarla.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href="/presentacion-alcaldia/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Ver presentación
                  <ExternalLink style={{ width: 14, height: 14 }} aria-hidden />
                </a>
                <a
                  href="/docs/chessitos/chessitos-salcaja-presentacion-alcaldia.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-poster"
                >
                  Descargar presentación (PDF)
                  <Download style={{ width: 14, height: 14 }} aria-hidden />
                </a>
                <a
                  href="/docs/chessitos/chessitos-salcaja-3-dias-carta-formal.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Descargar propuesta formal
                  <FileText style={{ width: 14, height: 14 }} aria-hidden />
                </a>
              </div>
            </div>
          </Section>
        </div>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--color-stage)", marginBottom: 12 }}
              >
                Resumen ejecutivo
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  lineHeight: 1,
                  color: "var(--color-ink)",
                  marginBottom: "16px",
                }}
              >
                Una inversión que queda instalada.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  lineHeight: 1.75,
                  color: "#444",
                }}
              >
                El proyecto busca que la municipalidad pueda iniciar una escuela
                de ajedrez con materiales propios, profesores preparados y un
                plan de crecimiento medible. No se trata únicamente de abrir
                clases, sino de crear una base permanente para formar, evaluar y
                proyectar talento local.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {executiveCards.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  style={{
                    background: "var(--color-grain)",
                    border: "2px solid var(--color-ink)",
                    boxShadow: "var(--shadow-card)",
                    padding: "22px",
                  }}
                >
                  <Icon
                    style={{
                      width: 22,
                      height: 22,
                      color: "var(--color-stage)",
                      marginBottom: "14px",
                    }}
                    aria-hidden
                  />
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.4rem",
                      lineHeight: 1.05,
                      marginBottom: "10px",
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.58,
                      color: "#444",
                    }}
                  >
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <div
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
          }}
        >
          <Section>
            <p
              className="eyebrow"
              style={{ color: "var(--color-marquee)", marginBottom: 12 }}
            >
              Problema y oportunidad
            </p>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.1rem, 5vw, 3.6rem)",
                  lineHeight: 0.98,
                }}
              >
                El ajedrez necesita continuidad, no solo entusiasmo.
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <p style={{ lineHeight: 1.75, color: "rgba(255,253,208,0.8)" }}>
                  Muchas iniciativas deportivas o educativas empiezan con buena
                  intención, pero se debilitan si no tienen horario, profesor,
                  materiales, seguimiento y una meta clara.
                </p>
                <p style={{ lineHeight: 1.75, color: "rgba(255,253,208,0.8)" }}>
                  Para la municipalidad, esta es una oportunidad de invertir en
                  un programa de alto valor educativo y comunitario: ocupa poco
                  espacio, puede atender grupos de distintos niveles y deja
                  materiales que siguen sirviendo después del primer ciclo.
                </p>
              </div>
            </div>
          </Section>
        </div>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--color-stage)", marginBottom: 12 }}
              >
                Evidencia y beneficios
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  lineHeight: 1,
                  color: "var(--color-ink)",
                  marginBottom: "16px",
                }}
              >
                Ajedrez con método, no promesas mágicas.
              </h2>
              <p style={{ lineHeight: 1.75, color: "#444" }}>
                La investigación sobre ajedrez escolar muestra señales positivas
                en razonamiento, matemática, atención, solución de problemas y
                habilidades socioemocionales. La lectura responsable es simple:
                los beneficios aparecen mejor cuando hay continuidad, práctica
                guiada y medición.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {evidenceCards.map(
                ({
                  icon: Icon,
                  label,
                  title,
                  stat,
                  description,
                  source,
                  href,
                }) => (
                  <a
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      background: "var(--color-grain)",
                      border: "2px solid var(--color-ink)",
                      boxShadow: "var(--shadow-card)",
                      color: "inherit",
                      padding: "20px",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "16px",
                        alignItems: "start",
                        marginBottom: "14px",
                      }}
                    >
                      <Icon
                        style={{
                          width: 24,
                          height: 24,
                          color: "var(--color-stage)",
                        }}
                        aria-hidden
                      />
                      <ExternalLink
                        style={{
                          width: 15,
                          height: 15,
                          color: "rgba(26,26,26,0.45)",
                        }}
                        aria-hidden
                      />
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-poster)",
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        fontSize: "9px",
                        color: "var(--color-stage)",
                        marginBottom: "8px",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.1rem",
                        lineHeight: 1,
                        color: "var(--color-ink)",
                        marginBottom: "8px",
                      }}
                    >
                      {stat}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        lineHeight: 1.05,
                        marginBottom: "10px",
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontSize: "13.5px",
                        lineHeight: 1.58,
                        color: "#444",
                      }}
                    >
                      {description}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#6a5a42",
                        marginTop: "12px",
                      }}
                    >
                      Fuente: {source}
                    </p>
                  </a>
                ),
              )}
            </div>
          </div>
        </Section>

        <div
          style={{
            background: "var(--color-grain)",
            borderTop: "2px solid var(--color-ink)",
            borderBottom: "2px solid var(--color-ink)",
          }}
        >
          <Section>
            <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <div>
                <p
                  className="eyebrow"
                  style={{ color: "var(--color-stage)", marginBottom: 12 }}
                >
                  Valor público e institucional
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3.4rem)",
                    lineHeight: 1,
                    marginBottom: "16px",
                  }}
                >
                  Una obra pequeña que se puede ver funcionando.
                </h2>
                <p style={{ lineHeight: 1.75, color: "#444" }}>
                  El rédito institucional debe presentarse como servicio
                  público: niños atendidos, familias viendo resultados,
                  materiales inventariados, torneos y reportes. La visibilidad
                  nace de hacer bien el programa, no de convertirlo en
                  propaganda.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {publicValueCards.map(({ icon: Icon, title, description }) => (
                  <article
                    key={title}
                    style={{
                      background: "var(--color-cream)",
                      border: "2px solid var(--color-ink)",
                      padding: "20px",
                    }}
                  >
                    <Icon
                      style={{
                        width: 22,
                        height: 22,
                        color: "var(--color-stage)",
                        marginBottom: "12px",
                      }}
                      aria-hidden
                    />
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.45rem",
                        lineHeight: 1.05,
                        marginBottom: "10px",
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.58,
                        color: "#444",
                      }}
                    >
                      {description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <Section>
          <p
            className="eyebrow"
            style={{ color: "var(--color-stage)", marginBottom: 12 }}
          >
            Modelo de apoyo
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              lineHeight: 1,
              marginBottom: "28px",
            }}
          >
            Tres partes, una misma ruta.
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {supportModel.map(({ icon: Icon, title, items }) => (
              <article
                key={title}
                style={{
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "var(--shadow-card)",
                  padding: "24px",
                }}
              >
                <Icon
                  style={{
                    width: 24,
                    height: 24,
                    color: "var(--color-stage)",
                    marginBottom: "14px",
                  }}
                  aria-hidden
                />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.45rem",
                    lineHeight: 1.05,
                    marginBottom: "14px",
                  }}
                >
                  {title}
                </h3>
                <div className="grid gap-2">
                  {items.map((item) => (
                    <p
                      key={item}
                      style={{ display: "flex", gap: 8, lineHeight: 1.45 }}
                    >
                      <CheckCircle2
                        style={{
                          width: 15,
                          height: 15,
                          color: "var(--color-stage)",
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <LineChart
                style={{
                  width: 28,
                  height: 28,
                  color: "var(--color-stage)",
                  marginBottom: 14,
                }}
                aria-hidden
              />
              <p
                className="eyebrow"
                style={{ color: "var(--color-stage)", marginBottom: 12 }}
              >
                Cuadro de proyección
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                Dos rutas, una misma inversión inicial.
              </h2>
              <p style={{ lineHeight: 1.75, color: "#444" }}>
                La diferencia principal no está en los materiales, sino en la
                intensidad mensual del profesor. Por eso separamos inversión
                inicial y sostenibilidad mensual.
              </p>
            </div>

            <div
              style={{
                overflowX: "auto",
                border: "2px solid var(--color-ink)",
                background: "var(--color-cream)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: "680px",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr
                    style={{ background: "var(--color-ink)", color: "white" }}
                  >
                    <th style={{ padding: "14px", textAlign: "left" }}>
                      Concepto
                    </th>
                    <th style={{ padding: "14px", textAlign: "left" }}>
                      3 días por semana
                    </th>
                    <th style={{ padding: "14px", textAlign: "left" }}>
                      Lunes a viernes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projectionRows.map((row) => (
                    <tr key={row.label}>
                      <td
                        style={{
                          padding: "13px 14px",
                          borderTop: "1px solid rgba(26,26,26,0.13)",
                          fontWeight: 700,
                        }}
                      >
                        {row.label}
                      </td>
                      <td
                        style={{
                          padding: "13px 14px",
                          borderTop: "1px solid rgba(26,26,26,0.13)",
                        }}
                      >
                        {row.threeDays}
                      </td>
                      <td
                        style={{
                          padding: "13px 14px",
                          borderTop: "1px solid rgba(26,26,26,0.13)",
                        }}
                      >
                        {row.weekdays}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <Section>
          <ProjectionBudgetSimulator />
        </Section>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--color-stage)", marginBottom: 12 }}
              >
                Respaldo de costos
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                Los números salen de mercado, no del aire.
              </h2>
              <p style={{ lineHeight: 1.75, color: "#444" }}>
                Los precios se manejan como referencia para decidir. Antes de
                comprar, la municipalidad debería solicitar cotización,
                disponibilidad y condiciones de entrega. La página deja visibles
                las fuentes base para revisión pública.
              </p>
              <div className="mt-5 grid gap-3">
                {costSources.map((source) => (
                  <article
                    key={source.group}
                    style={{
                      background: "var(--color-grain)",
                      border: "2px solid var(--color-ink)",
                      padding: "18px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        lineHeight: 1.05,
                        marginBottom: "8px",
                      }}
                    >
                      {source.group}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--color-stage)",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      {source.examples}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: "#444",
                      }}
                    >
                      {source.use}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <article
              style={{
                background: "var(--color-ink)",
                color: "var(--color-cream)",
                border: "2px solid var(--color-stage)",
                padding: "24px",
              }}
            >
              <p
                className="eyebrow"
                style={{ color: "var(--color-marquee)", marginBottom: 12 }}
              >
                Lectura de comunidad
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  lineHeight: 1,
                  marginBottom: "18px",
                }}
              >
                Lo que se repite entre entrenadores y jugadores.
              </h2>
              <div className="grid gap-3">
                {communityLessons.map((lesson) => (
                  <p
                    key={lesson}
                    style={{
                      display: "flex",
                      gap: 10,
                      lineHeight: 1.6,
                      color: "rgba(255,253,208,0.82)",
                    }}
                  >
                    <CheckCircle2
                      style={{
                        width: 16,
                        height: 16,
                        color: "var(--color-marquee)",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                      aria-hidden
                    />
                    <span>{lesson}</span>
                  </p>
                ))}
              </div>
              <p
                style={{
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "rgba(255,253,208,0.62)",
                  marginTop: "18px",
                }}
              >
                Esta lectura no reemplaza evidencia científica; ayuda a diseñar
                clases que los alumnos sí quieran sostener durante meses.
              </p>
            </article>
          </div>
        </Section>

        <div
          style={{
            background: "var(--color-stage)",
            color: "var(--color-cream)",
          }}
        >
          <Section>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p
                  className="eyebrow"
                  style={{ color: "rgba(255,253,208,0.76)", marginBottom: 12 }}
                >
                  Presupuesto operativo
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3.4rem)",
                    lineHeight: 1,
                    marginBottom: "16px",
                  }}
                >
                  El profesor se presupuesta como programa.
                </h2>
                <p
                  style={{ lineHeight: 1.75, color: "rgba(255,253,208,0.82)" }}
                >
                  La tarifa técnica de referencia es Q75 por hora, pero la
                  propuesta se presenta como paquete mensual porque incluye más
                  que la clase presencial: planificación, traslado, facturación,
                  preparación, seguimiento, control de grupo y dirección
                  técnica.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {teacherPackages.map((pack) => (
                  <article
                    key={pack.label}
                    style={{
                      background: "var(--color-ink)",
                      border: "2px solid rgba(255,253,208,0.2)",
                      padding: "24px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-poster)",
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        fontSize: "10px",
                        color: "var(--color-marquee)",
                        marginBottom: "10px",
                      }}
                    >
                      {pack.hours}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.55rem",
                        lineHeight: 1.05,
                        marginBottom: "12px",
                      }}
                    >
                      {pack.label}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "3rem",
                        color: "var(--color-marquee)",
                        lineHeight: 1,
                      }}
                    >
                      {pack.amount}
                    </p>
                    <p
                      style={{
                        marginTop: "12px",
                        lineHeight: 1.6,
                        color: "rgba(255,253,208,0.75)",
                      }}
                    >
                      {pack.note}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <Section>
          <div
            id="plan-anual"
            className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start"
          >
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--color-stage)", marginBottom: 12 }}
              >
                Plan anual
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                Una ruta de 12 meses, no una actividad pasajera.
              </h2>
              <p style={{ lineHeight: 1.75, color: "#444" }}>
                Los primeros meses ordenan el grupo y enseñan fundamentos.
                Después se introduce táctica, reloj, ranking, torneos internos y
                preparación para una competencia final.
              </p>
            </div>
            <div className="grid gap-3">
              {annualPlan.map((phase) => (
                <article
                  key={phase.range}
                  style={{
                    display: "grid",
                    gap: "12px",
                    background: "var(--color-grain)",
                    border: "2px solid var(--color-ink)",
                    padding: "18px",
                  }}
                  className="sm:grid-cols-[112px_1fr]"
                >
                  <p
                    style={{
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontSize: "10px",
                      color: "var(--color-stage)",
                      paddingTop: 4,
                    }}
                  >
                    {phase.range}
                  </p>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        lineHeight: 1.05,
                        marginBottom: "8px",
                      }}
                    >
                      {phase.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: "#444",
                      }}
                    >
                      {phase.result}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {phase.items.map((item) => (
                        <span
                          key={item}
                          style={{
                            border: "1px solid rgba(26,26,26,0.2)",
                            padding: "5px 8px",
                            fontSize: "12px",
                            background: "var(--color-cream)",
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <div
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
          }}
        >
          <Section>
            <div className="grid gap-8 lg:grid-cols-2">
              <article>
                <Medal
                  style={{
                    width: 26,
                    height: 26,
                    color: "var(--color-marquee)",
                    marginBottom: 14,
                  }}
                  aria-hidden
                />
                <p
                  className="eyebrow"
                  style={{ color: "var(--color-marquee)", marginBottom: 12 }}
                >
                  Meta anual
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3.2rem)",
                    lineHeight: 1,
                    marginBottom: "16px",
                  }}
                >
                  Una competencia que visibilice el talento local.
                </h2>
                <p style={{ lineHeight: 1.75, color: "rgba(255,253,208,0.8)" }}>
                  Al cerrar el primer año, la municipalidad puede apoyar una
                  competencia municipal con posibilidad de alcance regional o
                  departamental. Esta competencia mostraría el avance de los
                  alumnos e invitaría a otras comunidades, colegios o academias.
                </p>
              </article>

              <article
                style={{
                  border: "2px solid rgba(255,253,208,0.18)",
                  background: "rgba(255,253,208,0.04)",
                  padding: "24px",
                }}
              >
                <ClipboardCheck
                  style={{
                    width: 26,
                    height: 26,
                    color: "var(--color-marquee)",
                    marginBottom: 14,
                  }}
                  aria-hidden
                />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.7rem",
                    lineHeight: 1.05,
                    marginBottom: "16px",
                  }}
                >
                  Indicadores medibles
                </h3>
                <div className="grid gap-2">
                  {metrics.map((metric) => (
                    <p
                      key={metric}
                      style={{ display: "flex", gap: 10, lineHeight: 1.55 }}
                    >
                      <CheckCircle2
                        style={{
                          width: 16,
                          height: 16,
                          color: "var(--color-marquee)",
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                        aria-hidden
                      />
                      <span>{metric}</span>
                    </p>
                  ))}
                </div>
              </article>
            </div>
          </Section>
        </div>

        <Section>
          <div className="grid gap-5 lg:grid-cols-3">
            <article
              style={{
                background: "var(--color-grain)",
                border: "2px solid var(--color-ink)",
                boxShadow: "var(--shadow-card)",
                padding: "24px",
              }}
            >
              <Handshake
                style={{
                  width: 24,
                  height: 24,
                  color: "var(--color-stage)",
                  marginBottom: 14,
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
              >
                Profesores con experiencia competitiva
              </h2>
              <p style={{ lineHeight: 1.65, color: "#444" }}>
                El programa será impartido por profesores vinculados a procesos
                competitivos y de selección nacional en categorías inferiores,
                con experiencia práctica en formación ajedrecística.
              </p>
            </article>

            <article
              style={{
                background: "var(--color-cream)",
                border: "2px solid var(--color-ink)",
                padding: "24px",
              }}
            >
              <Calculator
                style={{
                  width: 24,
                  height: 24,
                  color: "var(--color-stage)",
                  marginBottom: 14,
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
              >
                Validación comunitaria
              </h2>
              <p style={{ lineHeight: 1.65, color: "#444" }}>
                Antes del PDF final, la propuesta puede revisarse con padres,
                jugadores, profesores y encargados municipales para ajustar
                dudas, costos y claridad.
              </p>
            </article>

            <article
              style={{
                background: "var(--color-ink)",
                color: "var(--color-cream)",
                border: "2px solid var(--color-stage)",
                padding: "24px",
              }}
            >
              <FileText
                style={{
                  width: 24,
                  height: 24,
                  color: "var(--color-marquee)",
                  marginBottom: 14,
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
              >
                Documento institucional
              </h2>
              <p
                style={{
                  lineHeight: 1.65,
                  color: "rgba(255,253,208,0.78)",
                  marginBottom: "18px",
                }}
              >
                Las propuestas descargables quedan disponibles para revisión
                municipal, consulta del Concejo y lectura pública del alcance
                solicitado.
              </p>
              <a
                href="/docs/chessitos/chessitos-salcaja-3-dias-dossier-visual.pdf"
                className="btn btn-secondary"
                target="_blank"
                rel="noreferrer"
              >
                Ver propuesta principal
                <Download style={{ width: 14, height: 14 }} aria-hidden />
              </a>
            </article>
          </div>
        </Section>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <ListChecks
                style={{
                  width: 28,
                  height: 28,
                  color: "var(--color-stage)",
                  marginBottom: 14,
                }}
                aria-hidden
              />
              <p
                className="eyebrow"
                style={{ color: "var(--color-stage)", marginBottom: 12 }}
              >
                Solicitud concreta
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                Qué se le pide a la Municipalidad.
              </h2>
              <p style={{ lineHeight: 1.75, color: "#444" }}>
                Para que la decisión sea clara, la solicitud se divide entre
                inversión inicial, sostenibilidad mensual y apoyo operativo. No
                se pide una estructura abstracta; se pide activar un programa
                medible.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {municipalRequests.map((request) => (
                <article
                  key={request}
                  style={{
                    display: "flex",
                    gap: "10px",
                    background: "var(--color-grain)",
                    border: "2px solid var(--color-ink)",
                    padding: "16px",
                  }}
                >
                  <CheckCircle2
                    style={{
                      width: 17,
                      height: 17,
                      color: "var(--color-stage)",
                      flexShrink: 0,
                      marginTop: 3,
                    }}
                    aria-hidden
                  />
                  <p style={{ lineHeight: 1.55, color: "#333" }}>{request}</p>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <div
          style={{
            background: "var(--color-grain)",
            borderTop: "2px solid var(--color-ink)",
            borderBottom: "2px solid var(--color-ink)",
          }}
        >
          <Section>
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <div>
                <p
                  className="eyebrow"
                  style={{ color: "var(--color-stage)", marginBottom: 12 }}
                >
                  Si se aprueba
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3.2rem)",
                    lineHeight: 1,
                    marginBottom: "16px",
                  }}
                >
                  Un arranque simple, con pasos visibles.
                </h2>
                <p style={{ lineHeight: 1.75, color: "#444" }}>
                  El programa puede iniciar sin burocracia innecesaria si se
                  ordenan sede, convocatoria, compra y registro de alumnos desde
                  el primer mes.
                </p>
              </div>
              <div className="grid gap-3">
                {nextSteps.map((step) => (
                  <article
                    key={step.label}
                    className="sm:grid-cols-[118px_1fr]"
                    style={{
                      display: "grid",
                      gap: "12px",
                      background: "var(--color-cream)",
                      border: "2px solid var(--color-ink)",
                      padding: "16px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-poster)",
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        fontSize: "10px",
                        color: "var(--color-stage)",
                        paddingTop: 4,
                      }}
                    >
                      {step.label}
                    </p>
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.35rem",
                          lineHeight: 1.05,
                          marginBottom: "6px",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: 1.55,
                          color: "#444",
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--color-stage)", marginBottom: 12 }}
              >
                Descargas públicas
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                Propuestas listas para revisar.
              </h2>
              <p style={{ lineHeight: 1.75, color: "#444" }}>
                Cada modalidad tiene una versión formal y una versión visual. La
                versión formal sirve para expediente; la visual ayuda a entender
                la propuesta más rápido.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pdfDownloads.map((download) => (
                <a
                  key={download.href}
                  href={download.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "start",
                    background: "var(--color-grain)",
                    border: "2px solid var(--color-ink)",
                    boxShadow: "var(--shadow-card)",
                    padding: "18px",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <Download
                    style={{
                      width: 20,
                      height: 20,
                      color: "var(--color-stage)",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                    aria-hidden
                  />
                  <span>
                    <strong
                      style={{
                        display: "block",
                        fontFamily: "var(--font-display)",
                        fontSize: "1.25rem",
                        lineHeight: 1.05,
                        marginBottom: "6px",
                      }}
                    >
                      {download.title}
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        lineHeight: 1.55,
                        color: "#555",
                      }}
                    >
                      {download.description}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Section>

        <div
          style={{
            background: "var(--color-grain)",
            borderTop: "2px solid var(--color-ink)",
          }}
        >
          <Section>
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <div>
                <p
                  className="eyebrow"
                  style={{ color: "var(--color-stage)", marginBottom: 12 }}
                >
                  Marco de referencia
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    lineHeight: 1,
                    marginBottom: "14px",
                  }}
                >
                  Serios con las promesas.
                </h2>
                <p style={{ lineHeight: 1.7, color: "#444" }}>
                  La propuesta no promete Elo oficial automático. Sí construye
                  una base técnica y competitiva para que los alumnos constantes
                  puedan aspirar a competir formalmente.
                </p>
              </div>
              <div className="grid gap-3">
                {references.map((ref) => (
                  <a
                    key={ref.title}
                    href={ref.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: "12px",
                      alignItems: "start",
                      background: "var(--color-cream)",
                      border: "2px solid var(--color-ink)",
                      padding: "14px 16px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <FileText
                      style={{
                        width: 18,
                        height: 18,
                        color: "var(--color-stage)",
                        marginTop: 2,
                      }}
                      aria-hidden
                    />
                    <span>
                      <strong style={{ display: "block", fontSize: "14px" }}>
                        {ref.title}
                      </strong>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          lineHeight: 1.55,
                          color: "#555",
                          marginTop: "2px",
                        }}
                      >
                        {ref.description}
                      </span>
                    </span>
                    <ArrowRight
                      style={{
                        width: 14,
                        height: 14,
                        color: "var(--color-stage)",
                        marginTop: 4,
                      }}
                      aria-hidden
                    />
                  </a>
                ))}
                {providerLinks.map((provider) => (
                  <a
                    key={provider.title}
                    href={provider.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: "12px",
                      alignItems: "start",
                      background: "var(--color-cream)",
                      border: "2px solid rgba(26,26,26,0.48)",
                      padding: "14px 16px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <PackageCheck
                      style={{
                        width: 18,
                        height: 18,
                        color: "var(--color-stage)",
                        marginTop: 2,
                      }}
                      aria-hidden
                    />
                    <span>
                      <strong style={{ display: "block", fontSize: "14px" }}>
                        {provider.title}
                      </strong>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          lineHeight: 1.55,
                          color: "#555",
                          marginTop: "2px",
                        }}
                      >
                        {provider.description}
                      </span>
                    </span>
                    <ExternalLink
                      style={{
                        width: 14,
                        height: 14,
                        color: "var(--color-stage)",
                        marginTop: 4,
                      }}
                      aria-hidden
                    />
                  </a>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--color-stage)", marginBottom: 12 }}
              >
                Preguntas frecuentes
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                Dudas normales antes de aprobar.
              </h2>
              <p style={{ lineHeight: 1.75, color: "#444" }}>
                La propuesta se entiende mejor cuando responde objeciones
                básicas: qué se compra, por qué hay profesor mensual, cómo se
                mide y qué queda para el municipio.
              </p>
            </div>
            <div className="grid gap-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  style={{
                    background: "var(--color-grain)",
                    border: "2px solid var(--color-ink)",
                    padding: "16px 18px",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      lineHeight: 1.1,
                      color: "var(--color-ink)",
                    }}
                  >
                    {faq.question}
                  </summary>
                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      color: "#444",
                    }}
                  >
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        <div
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderTop: "4px solid var(--color-stage)",
          }}
        >
          <Section>
            <div className="mx-auto max-w-2xl text-center">
              <p
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  fontSize: "4rem",
                  lineHeight: 1,
                  color: "var(--color-stage)",
                  marginBottom: "8px",
                }}
                aria-hidden
              >
                ♞
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.2rem, 6vw, 4rem)",
                  lineHeight: 0.95,
                  marginBottom: "16px",
                }}
              >
                Definamos el alcance.
              </h2>
              <p
                style={{
                  fontSize: "var(--text-base)",
                  lineHeight: 1.7,
                  color: "rgba(255,253,208,0.8)",
                  marginBottom: "28px",
                }}
              >
                El siguiente paso es confirmar cupos, sede, días de clase,
                materiales existentes y tipo de apoyo que se solicitará a la
                municipalidad.
              </p>
              <a
                href={`https://wa.me/${restaurantInfo.whatsapp}?text=${whatsappMessage}`}
                className="btn btn-primary"
                rel="noreferrer"
                target="_blank"
              >
                Coordinar reunión
                <ArrowRight style={{ width: 14, height: 14 }} aria-hidden />
              </a>
            </div>
          </Section>
        </div>
      </main>
    </PublicLayout>
  );
}
