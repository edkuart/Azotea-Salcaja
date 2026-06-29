"use client";

import { useMemo, useState } from "react";

type Frequency = "threeDays" | "weekdays";
type Preset = "minimum" | "recommended" | "institutional" | "custom";
type PriceTier = "budget" | "recommended" | "institutional";
type PackageLevel = 0 | 1 | 2 | 3;
type ReserveLevel = 0 | 1 | 2;

type BudgetState = {
  preset: Preset;
  priceTier: PriceTier;
  students: number;
  frequency: Frequency;
  includeFurniture: boolean;
  chessSets: number;
  bags: number;
  clocks: number;
  demoBoards: number;
  tables: number;
  chairs: number;
  teachingMaterialLevel: PackageLevel;
  awardsLevel: PackageLevel;
  reserveLevel: ReserveLevel;
};

const TEACHER_PACKAGES: Record<
  Frequency,
  {
    label: string;
    shortLabel: string;
    weeklyHours: number;
    monthlyCost: number;
    note: string;
  }
> = {
  threeDays: {
    label: "3 días por semana",
    shortLabel: "3 días",
    weeklyHours: 6,
    monthlyCost: 2250,
    note: "Inicio sostenible con buen ritmo.",
  },
  weekdays: {
    label: "Lunes a viernes",
    shortLabel: "5 días",
    weeklyHours: 10,
    monthlyCost: 3750,
    note: "Ruta intensiva de mayor continuidad.",
  },
};

const UNIT_PRICES: Record<
  PriceTier,
  {
    chessSet: number;
    bag: number;
    clock: number;
    demoBoard: number;
    table: number;
    chair: number;
  }
> = {
  budget: {
    chessSet: 180,
    bag: 70,
    clock: 400,
    demoBoard: 500,
    table: 560,
    chair: 130,
  },
  recommended: {
    chessSet: 180,
    bag: 70,
    clock: 400,
    demoBoard: 500,
    table: 560,
    chair: 130,
  },
  institutional: {
    chessSet: 350,
    bag: 110,
    clock: 700,
    demoBoard: 700,
    table: 750,
    chair: 180,
  },
};

const PACKAGE_PRICES = {
  teachingMaterial: {
    0: 0,
    1: 150,
    2: 300,
    3: 600,
  },
  awards: {
    0: 0,
    1: 300,
    2: 750,
    3: 1500,
  },
  reserve: {
    0: 0,
    1: 500,
    2: 1000,
  },
} as const;

const PRESETS: Record<Exclude<Preset, "custom">, BudgetState> = {
  minimum: {
    preset: "minimum",
    priceTier: "budget",
    students: 20,
    frequency: "threeDays",
    includeFurniture: false,
    chessSets: 10,
    bags: 10,
    clocks: 5,
    demoBoards: 1,
    tables: 10,
    chairs: 20,
    teachingMaterialLevel: 2,
    awardsLevel: 1,
    reserveLevel: 0,
  },
  recommended: {
    preset: "recommended",
    priceTier: "recommended",
    students: 20,
    frequency: "threeDays",
    includeFurniture: false,
    chessSets: 15,
    bags: 15,
    clocks: 10,
    demoBoards: 1,
    tables: 10,
    chairs: 20,
    teachingMaterialLevel: 2,
    awardsLevel: 2,
    reserveLevel: 1,
  },
  institutional: {
    preset: "institutional",
    priceTier: "institutional",
    students: 30,
    frequency: "weekdays",
    includeFurniture: true,
    chessSets: 25,
    bags: 25,
    clocks: 15,
    demoBoards: 1,
    tables: 15,
    chairs: 30,
    teachingMaterialLevel: 3,
    awardsLevel: 3,
    reserveLevel: 2,
  },
};

const PRESET_META: Record<
  Exclude<Preset, "custom">,
  { label: string; description: string }
> = {
  minimum: {
    label: "Mínimo operativo",
    description:
      "Permite iniciar con lo esencial, pero limita reservas y práctica individual.",
  },
  recommended: {
    label: "Recomendado",
    description:
      "Compra inicial ajedrecística, asumiendo que la municipalidad facilita mobiliario.",
  },
  institutional: {
    label: "Institucional",
    description: "Base robusta para crecer a 20-30 alumnos con mejor equipo.",
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("GTQ", "Q");
}

function presetLabel(preset: Preset) {
  if (preset === "custom") {
    return "Personalizado";
  }

  return PRESET_META[preset].label;
}

export function ProjectionBudgetSimulator() {
  const [budget, setBudget] = useState<BudgetState>(PRESETS.recommended);

  const prices = UNIT_PRICES[budget.priceTier];
  const teacherPackage = TEACHER_PACKAGES[budget.frequency];

  const totals = useMemo(() => {
    const equipmentSubtotal =
      budget.chessSets * prices.chessSet +
      budget.bags * prices.bag +
      budget.clocks * prices.clock +
      budget.demoBoards * prices.demoBoard +
      PACKAGE_PRICES.teachingMaterial[budget.teachingMaterialLevel] +
      PACKAGE_PRICES.awards[budget.awardsLevel] +
      PACKAGE_PRICES.reserve[budget.reserveLevel];

    const furnitureSubtotal = budget.includeFurniture
      ? budget.tables * prices.table + budget.chairs * prices.chair
      : 0;

    const initialInvestment = equipmentSubtotal + furnitureSubtotal;
    const annualTeacherCost = teacherPackage.monthlyCost * 12;
    const firstYearTotal = initialInvestment + annualTeacherCost;
    const costPerStudent =
      budget.students > 0 ? firstYearTotal / budget.students : 0;
    const studentsPerSet =
      budget.chessSets > 0 ? budget.students / budget.chessSets : null;

    return {
      equipmentSubtotal,
      furnitureSubtotal,
      initialInvestment,
      annualTeacherCost,
      firstYearTotal,
      costPerStudent,
      studentsPerSet,
    };
  }, [budget, prices, teacherPackage.monthlyCost]);

  const coverage =
    totals.studentsPerSet === null
      ? "Sin cobertura de tableros"
      : totals.studentsPerSet <= 1
        ? "Cobertura ideal"
        : totals.studentsPerSet <= 1.5
          ? "Cobertura recomendada"
          : totals.studentsPerSet <= 2
            ? "Cobertura operativa"
            : "Cobertura limitada";

  function updateBudget(update: Partial<BudgetState>) {
    setBudget((current) => ({
      ...current,
      ...update,
      preset: "custom",
    }));
  }

  function applyPreset(preset: Exclude<Preset, "custom">) {
    setBudget(PRESETS[preset]);
  }

  const lineItems = [
    {
      label: "Juegos completos",
      quantity: budget.chessSets,
      total: budget.chessSets * prices.chessSet,
    },
    {
      label: "Bolsas o estuches",
      quantity: budget.bags,
      total: budget.bags * prices.bag,
    },
    {
      label: "Relojes digitales",
      quantity: budget.clocks,
      total: budget.clocks * prices.clock,
    },
    {
      label: "Tablero demo",
      quantity: budget.demoBoards,
      total: budget.demoBoards * prices.demoBoard,
    },
    {
      label: "Mesas",
      quantity: budget.includeFurniture ? budget.tables : 0,
      total: budget.includeFurniture ? budget.tables * prices.table : 0,
    },
    {
      label: "Sillas",
      quantity: budget.includeFurniture ? budget.chairs : 0,
      total: budget.includeFurniture ? budget.chairs * prices.chair : 0,
    },
  ];

  return (
    <div
      id="presupuesto"
      style={{
        background: "var(--color-grain)",
        border: "2px solid var(--color-ink)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="mb-6">
            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: "10px",
                color: "var(--color-stage)",
                marginBottom: "10px",
              }}
            >
              Simulador municipal
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.3rem)",
                lineHeight: 1,
                color: "var(--color-ink)",
              }}
            >
              Ajusta el presupuesto según la realidad de la municipalidad.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.7,
                color: "#444",
                marginTop: "14px",
                maxWidth: "680px",
              }}
            >
              Los precios son referenciales. El simulador separa inversión
              inicial ajedrecística, requerimientos operativos y sostenibilidad
              mensual del programa.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(PRESET_META) as Array<Exclude<Preset, "custom">>).map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  style={{
                    border: "2px solid var(--color-ink)",
                    background:
                      budget.preset === preset
                        ? "var(--color-ink)"
                        : "var(--color-cream)",
                    color:
                      budget.preset === preset
                        ? "var(--color-cream)"
                        : "var(--color-ink)",
                    padding: "14px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontSize: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    {PRESET_META[preset].label}
                  </strong>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      lineHeight: 1.45,
                      opacity: 0.82,
                    }}
                  >
                    {PRESET_META[preset].description}
                  </span>
                </button>
              ),
            )}
          </div>

          <div className="mt-7 grid gap-5">
            <RangeControl
              label="Alumnos estimados"
              value={budget.students}
              min={10}
              max={40}
              unit="alumnos"
              help="Para 20 alumnos se recomienda entre 15 y 20 juegos. El mínimo operativo es 10 juegos compartidos."
              onChange={(students) => updateBudget({ students })}
            />

            <div
              style={{
                border: "2px solid rgba(26,26,26,0.14)",
                background: "var(--color-cream)",
                padding: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontSize: "10px",
                  color: "var(--color-stage)",
                  marginBottom: "12px",
                }}
              >
                Frecuencia de clases
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(TEACHER_PACKAGES) as Frequency[]).map(
                  (frequency) => (
                    <button
                      key={frequency}
                      type="button"
                      onClick={() => updateBudget({ frequency })}
                      style={{
                        border: "2px solid var(--color-ink)",
                        background:
                          budget.frequency === frequency
                            ? "var(--color-stage)"
                            : "transparent",
                        color:
                          budget.frequency === frequency
                            ? "var(--color-cream)"
                            : "var(--color-ink)",
                        padding: "14px",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <strong
                        style={{
                          display: "block",
                          fontFamily: "var(--font-body)",
                          fontSize: "16px",
                          marginBottom: "4px",
                        }}
                      >
                        {TEACHER_PACKAGES[frequency].label}
                      </strong>
                      <span style={{ fontSize: "13px", lineHeight: 1.5 }}>
                        {TEACHER_PACKAGES[frequency].weeklyHours} h/semana ·{" "}
                        {formatCurrency(
                          TEACHER_PACKAGES[frequency].monthlyCost,
                        )}
                        /mes
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <RangeControl
                label="Juegos completos"
                value={budget.chessSets}
                min={0}
                max={40}
                unit="juegos"
                total={budget.chessSets * prices.chessSet}
                onChange={(chessSets) => updateBudget({ chessSets })}
              />
              <RangeControl
                label="Bolsas o estuches"
                value={budget.bags}
                min={0}
                max={40}
                unit="bolsas"
                total={budget.bags * prices.bag}
                onChange={(bags) => updateBudget({ bags })}
              />
              <RangeControl
                label="Relojes digitales"
                value={budget.clocks}
                min={0}
                max={25}
                unit="relojes"
                total={budget.clocks * prices.clock}
                help="Para 20 alumnos, 10 relojes permiten una ronda simultánea."
                onChange={(clocks) => updateBudget({ clocks })}
              />
              <RangeControl
                label="Tablero demo"
                value={budget.demoBoards}
                min={0}
                max={2}
                unit="tableros"
                total={budget.demoBoards * prices.demoBoard}
                onChange={(demoBoards) => updateBudget({ demoBoards })}
              />
            </div>

            <div
              style={{
                border: "2px solid rgba(26,26,26,0.14)",
                background: "var(--color-cream)",
                padding: "16px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                }}
              >
                <input
                  type="checkbox"
                  checked={budget.includeFurniture}
                  onChange={(event) =>
                    updateBudget({ includeFurniture: event.target.checked })
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--color-stage)",
                  }}
                />
                Cotizar mesas y sillas como compra adicional
              </label>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: "#555",
                  marginTop: "6px",
                }}
              >
                Para la propuesta de Salcajá se plantea como requerimiento
                operativo municipal. Actívalo solo si también se desea estimar
                compra de mobiliario.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <RangeControl
                  label="Mesas plegables"
                  value={budget.tables}
                  min={0}
                  max={25}
                  unit="mesas"
                  disabled={!budget.includeFurniture}
                  total={
                    budget.includeFurniture ? budget.tables * prices.table : 0
                  }
                  onChange={(tables) => updateBudget({ tables })}
                />
                <RangeControl
                  label="Sillas plásticas"
                  value={budget.chairs}
                  min={0}
                  max={50}
                  unit="sillas"
                  disabled={!budget.includeFurniture}
                  total={
                    budget.includeFurniture ? budget.chairs * prices.chair : 0
                  }
                  onChange={(chairs) => updateBudget({ chairs })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <PackageControl
                label="Material didáctico"
                value={budget.teachingMaterialLevel}
                options={[
                  { value: 0, label: "No incluido", price: 0 },
                  { value: 1, label: "Bajo", price: 150 },
                  { value: 2, label: "Recomendado", price: 300 },
                  { value: 3, label: "Institucional", price: 600 },
                ]}
                onChange={(teachingMaterialLevel) =>
                  updateBudget({ teachingMaterialLevel })
                }
              />
              <PackageControl
                label="Premiación anual"
                value={budget.awardsLevel}
                options={[
                  { value: 0, label: "No incluido", price: 0 },
                  { value: 1, label: "Básico", price: 300 },
                  { value: 2, label: "Recomendado", price: 750 },
                  { value: 3, label: "Institucional", price: 1500 },
                ]}
                onChange={(awardsLevel) => updateBudget({ awardsLevel })}
              />
              <PackageControl
                label="Repuestos"
                value={budget.reserveLevel}
                options={[
                  { value: 0, label: "No incluido", price: 0 },
                  { value: 1, label: "Básico", price: 500 },
                  { value: 2, label: "Institucional", price: 1000 },
                ]}
                onChange={(reserveLevel) => updateBudget({ reserveLevel })}
              />
            </div>
          </div>
        </div>

        <aside
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            borderTop: "2px solid var(--color-ink)",
          }}
          className="p-5 sm:p-7 lg:sticky lg:top-0 lg:min-h-full lg:p-8"
        >
          <p
            style={{
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "10px",
              color: "var(--color-marquee)",
              marginBottom: "10px",
            }}
          >
            {presetLabel(budget.preset)}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(255,253,208,0.76)",
            }}
          >
            {teacherPackage.label} · {teacherPackage.weeklyHours} horas
            semanales · {budget.students} alumnos
          </p>

          <div style={{ marginTop: "24px" }}>
            <SummaryNumber
              label="Inversión inicial solicitada"
              value={totals.initialInvestment}
              featured
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <SummaryNumber
                label="Sostenibilidad mensual"
                value={teacherPackage.monthlyCost}
              />
              <SummaryNumber
                label="Proyección anual del profesor"
                value={totals.annualTeacherCost}
              />
              <SummaryNumber
                label="Primer año si se proyecta completo"
                value={totals.firstYearTotal}
              />
              <SummaryNumber
                label="Referencia anual por alumno"
                value={totals.costPerStudent}
              />
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,253,208,0.22)",
              padding: "14px",
              marginTop: "22px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: "10px",
                color: "var(--color-marquee)",
                marginBottom: "8px",
              }}
            >
              Lectura rápida
            </p>
            <div className="grid gap-2">
              <BudgetNote text={coverage} />
              {budget.clocks === 0 ? (
                <BudgetNote text="Sin relojes: la preparación competitiva queda limitada." />
              ) : null}
              {!budget.includeFurniture ? (
                <BudgetNote text="Mobiliario no incluido en compra: se plantea como apoyo operativo municipal." />
              ) : null}
              {budget.frequency === "weekdays" ? (
                <BudgetNote text="La modalidad intensiva aumenta continuidad y costo operativo." />
              ) : null}
            </div>
          </div>

          <div style={{ marginTop: "22px" }}>
            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: "10px",
                color: "var(--color-marquee)",
                marginBottom: "10px",
              }}
            >
              Desglose
            </p>
            <div className="grid gap-2">
              {lineItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    fontSize: "13px",
                    color: "rgba(255,253,208,0.8)",
                  }}
                >
                  <span>
                    {item.label} · {item.quantity}
                  </span>
                  <strong>{formatCurrency(item.total)}</strong>
                </div>
              ))}
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              lineHeight: 1.55,
              color: "rgba(255,253,208,0.62)",
              marginTop: "22px",
            }}
          >
            Los montos son referenciales y deben confirmarse con proveedor antes
            de compra. Pueden variar por calidad, disponibilidad, envío,
            impuestos y tipo de cambio.
          </p>
        </aside>
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  unit,
  total,
  help,
  disabled = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  total?: number;
  help?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div
      style={{
        border: "2px solid rgba(26,26,26,0.14)",
        background: disabled ? "rgba(232,228,220,0.55)" : "var(--color-cream)",
        padding: "16px",
        opacity: disabled ? 0.62 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
        }}
      >
        <label
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--color-ink)",
          }}
        >
          {label}
        </label>
        <strong
          style={{
            fontFamily: "var(--font-poster)",
            fontSize: "13px",
            color: "var(--color-stage)",
            whiteSpace: "nowrap",
          }}
        >
          {value} {unit}
        </strong>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{
          width: "100%",
          marginTop: "12px",
          accentColor: "var(--color-stage)",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "#666",
          marginTop: "2px",
        }}
      >
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {typeof total === "number" ? (
        <p style={{ fontSize: "13px", color: "#444", marginTop: "8px" }}>
          Subtotal: <strong>{formatCurrency(total)}</strong>
        </p>
      ) : null}
      {help ? (
        <p
          style={{
            fontSize: "12px",
            color: "#666",
            lineHeight: 1.5,
            marginTop: "8px",
          }}
        >
          {help}
        </p>
      ) : null}
    </div>
  );
}

function PackageControl<T extends number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; price: number }>;
  onChange: (value: T) => void;
}) {
  return (
    <div
      style={{
        border: "2px solid rgba(26,26,26,0.14)",
        background: "var(--color-cream)",
        padding: "16px",
      }}
    >
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          fontWeight: 700,
          color: "var(--color-ink)",
          marginBottom: "10px",
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value) as T)}
        style={{
          width: "100%",
          border: "2px solid var(--color-ink)",
          background: "var(--color-grain)",
          padding: "10px",
          fontFamily: "var(--font-body)",
          color: "var(--color-ink)",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} · {formatCurrency(option.price)}
          </option>
        ))}
      </select>
    </div>
  );
}

function SummaryNumber({
  label,
  value,
  featured = false,
}: {
  label: string;
  value: number;
  featured?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-poster)",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontSize: "9px",
          color: "rgba(255,253,208,0.56)",
          marginBottom: "4px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: featured ? "clamp(2.4rem, 6vw, 4rem)" : "2rem",
          lineHeight: 0.95,
          color: featured ? "var(--color-marquee)" : "var(--color-cream)",
        }}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function BudgetNote({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        lineHeight: 1.45,
        color: "rgba(255,253,208,0.78)",
      }}
    >
      {text}
    </p>
  );
}
