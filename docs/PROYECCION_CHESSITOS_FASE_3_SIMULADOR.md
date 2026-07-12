# Proyección Chessitos - Fase 3: diseño funcional del simulador

Fecha: 2026-06-20
Estado: especificación funcional. Sin implementación de código.

## 1. Objetivo de esta fase

Definir cómo funcionará el simulador de presupuesto antes de implementarlo en la página `/ajedrez/proyeccion`.

El simulador debe permitir que una autoridad municipal, encargado o aliado ajuste el alcance del programa y vea automáticamente:

- Inversión inicial en materiales.
- Pago mensual del programa.
- Costo operativo anual.
- Total estimado del primer año.
- Costo aproximado por alumno.

## 2. Principio funcional

La página debe evitar una tabla rígida. El simulador debe mostrar que el proyecto se puede adaptar a la realidad municipal:

- Si ya tienen mesas y sillas, se desactiva mobiliario.
- Si quieren iniciar pequeño, se usa mínimo operativo.
- Si quieren instalar una escuela más fuerte, se usa recomendado o institucional.
- Si cambian alumnos o materiales, los totales cambian en vivo.

## 3. Estado inicial recomendado

Preset inicial:

`recomendado`

Valores default:

| Control                      |         Valor inicial |
| ---------------------------- | --------------------: |
| Alumnos                      |                    20 |
| Frecuencia                   |     3 días por semana |
| Horas por jornada            |                     2 |
| Juegos completos             |                    15 |
| Bolsas/estuches              |                    15 |
| Relojes                      |                    10 |
| Tablero demo                 |                     1 |
| Papelería/material didáctico |             1 paquete |
| Premiación anual             | 1 paquete recomendado |
| Repuestos/reserva            |             1 paquete |
| Mesas                        |                    10 |
| Sillas                       |                    20 |
| Mobiliario activo            |                    Sí |

Totales esperados con este default:

- Materiales sin mobiliario: Q9,800.
- Materiales con mobiliario: Q18,000.
- Profesor mensual: Q2,250.
- Profesor anual: Q27,000.
- Total primer año con mobiliario: Q45,000.

## 4. Presets

### 4.1 Mínimo operativo

Uso:

Para iniciar con un presupuesto más bajo sin venderlo como escenario ideal.

Valores:

| Control          |             Valor |
| ---------------- | ----------------: |
| Alumnos          |                20 |
| Juegos completos |                10 |
| Bolsas           |                10 |
| Relojes          |                 5 |
| Tablero demo     |                 1 |
| Papelería        |    1 paquete bajo |
| Premiación       |    1 paquete bajo |
| Repuestos        |                 0 |
| Mesas            |                10 |
| Sillas           |                20 |
| Frecuencia       | 3 días por semana |

Totales:

- Sin mobiliario: Q5,600.
- Con mobiliario: Q13,800.
- Profesor anual: Q27,000.
- Año 1 con mobiliario: Q40,800.

Nota visible:

> Permite iniciar, pero limita práctica individual, reserva de equipo y competencia con reloj.

### 4.2 Recomendado

Uso:

Escenario de arranque serio para 20 alumnos.

Valores:

| Control          |                 Valor |
| ---------------- | --------------------: |
| Alumnos          |                    20 |
| Juegos completos |                    15 |
| Bolsas           |                    15 |
| Relojes          |                    10 |
| Tablero demo     |                     1 |
| Papelería        | 1 paquete recomendado |
| Premiación       | 1 paquete recomendado |
| Repuestos        |             1 paquete |
| Mesas            |                    10 |
| Sillas           |                    20 |
| Frecuencia       |     3 días por semana |

Totales:

- Sin mobiliario: Q9,800.
- Con mobiliario: Q18,000.
- Profesor anual: Q27,000.
- Año 1 con mobiliario: Q45,000.

Nota visible:

> Equilibra costo, continuidad y capacidad pedagógica. Es el escenario sugerido para iniciar con seriedad.

### 4.3 Institucional

Uso:

Escenario para una escuela con mayor durabilidad y capacidad de crecer.

Valores:

| Control          |                   Valor |
| ---------------- | ----------------------: |
| Alumnos          |                      30 |
| Juegos completos |                      25 |
| Bolsas           |                      25 |
| Relojes          |                      15 |
| Tablero demo     |                       1 |
| Papelería        | 1 paquete institucional |
| Premiación       | 1 paquete institucional |
| Repuestos        | 1 paquete institucional |
| Mesas            |                      15 |
| Sillas           |                      30 |
| Frecuencia       |         Lunes a viernes |

Totales:

- Sin mobiliario: Q25,800.
- Con mobiliario: Q42,450.
- Profesor anual: Q45,000.
- Año 1 con mobiliario: Q87,450.

Nota visible:

> Pensado para instalar una base más robusta, con mayor reserva, mejores relojes y capacidad de atender más alumnos.

### 4.4 Personalizado

Uso:

Se activa automáticamente cuando el usuario mueve cualquier slider después de elegir un preset.

Nota visible:

> Ajuste personalizado según cantidades seleccionadas.

## 5. Controles principales

### 5.1 Alumnos

Tipo:

Slider.

Rango:

- Mínimo: 10.
- Máximo: 40.
- Paso: 1.
- Default: 20.

Texto visible:

> Alumnos estimados

Ayuda:

> Para 20 alumnos se recomienda entre 15 y 20 juegos. El mínimo operativo es 10 juegos compartidos.

Impacto:

- No recalcula automáticamente todos los materiales si el usuario está en modo personalizado.
- En presets, define cantidades base.
- En resumen, afecta costo aproximado por alumno.

### 5.2 Frecuencia del programa

Tipo:

Segmented control o botones.

Opciones:

- 3 días por semana.
- Lunes a viernes.

Valores:

| Opción            | Días | Horas por día | Horas semanales | Profesor mensual | Profesor anual |
| ----------------- | ---: | ------------: | --------------: | ---------------: | -------------: |
| 3 días por semana |    3 |             2 |               6 |           Q2,250 |        Q27,000 |
| Lunes a viernes   |    5 |             2 |              10 |           Q3,750 |        Q45,000 |

Texto visible:

> Frecuencia de clases

Ayuda:

> Ambas modalidades consideran jornadas de 2 horas. El paquete mensual incluye planificación, traslado, factura, clase y seguimiento.

### 5.3 Mobiliario activo

Tipo:

Toggle.

Default:

Activo.

Texto visible:

> Incluir mesas y sillas

Ayuda:

> Desactívalo si la municipalidad ya cuenta con mobiliario adecuado.

Impacto:

- Si está apagado, mesas y sillas no suman al total.
- Los sliders pueden ocultarse o quedar deshabilitados, pero el resumen debe mostrar "Mobiliario no incluido".

### 5.4 Nivel de calidad

Tipo:

Segmented control opcional.

Opciones:

- Bajo.
- Recomendado.
- Institucional.

Uso:

No es obligatorio para primera implementación si los presets ya cubren esto. Si se incluye, cambia precios unitarios de categorías principales.

Recomendación:

Para la primera versión, usar presets como forma principal y dejar precios unitarios fijos por defecto recomendado. Evita que el simulador se vuelva demasiado técnico.

## 6. Controles de materiales

### 6.1 Juegos completos de ajedrez

Tipo:

Slider.

Rango:

- Mínimo: 0.
- Máximo: 40.
- Paso: 1.
- Default: 15.

Precio unitario recomendado:

Q180.

Texto visible:

> Juegos completos de ajedrez

Ayuda:

> Incluye tablero y piezas tipo club. Para 20 alumnos, 15 juegos es el punto recomendado.

### 6.2 Bolsas o estuches

Tipo:

Slider.

Rango:

- Mínimo: 0.
- Máximo: 40.
- Paso: 1.
- Default: 15.

Precio unitario recomendado:

Q70.

Texto visible:

> Bolsas o estuches

Ayuda:

> Sirven para cuidar piezas, transportar material e inventariar cada juego.

### 6.3 Relojes digitales

Tipo:

Slider.

Rango:

- Mínimo: 0.
- Máximo: 25.
- Paso: 1.
- Default: 10.

Precio unitario recomendado:

Q400.

Texto visible:

> Relojes digitales

Ayuda:

> Para 20 alumnos, 10 relojes permiten una ronda simultánea de torneo.

### 6.4 Mesas plegables

Tipo:

Slider condicionado por toggle de mobiliario.

Rango:

- Mínimo: 0.
- Máximo: 25.
- Paso: 1.
- Default: 10.

Precio unitario recomendado:

Q560.

Texto visible:

> Mesas plegables

Ayuda:

> Rubro opcional si la municipalidad ya tiene mobiliario.

### 6.5 Sillas plásticas

Tipo:

Slider condicionado por toggle de mobiliario.

Rango:

- Mínimo: 0.
- Máximo: 50.
- Paso: 1.
- Default: 20.

Precio unitario recomendado:

Q130.

Texto visible:

> Sillas plásticas

Ayuda:

> Rubro opcional si la sede ya cuenta con sillas.

### 6.6 Tablero demo

Tipo:

Stepper o slider pequeño.

Rango:

- Mínimo: 0.
- Máximo: 2.
- Paso: 1.
- Default: 1.

Precio unitario recomendado:

Q500.

Texto visible:

> Tablero demo para profesor

Ayuda:

> Ayuda a explicar posiciones frente al grupo.

### 6.7 Papelería y material didáctico

Tipo:

Selector o slider de paquetes.

Opciones:

- 0: No incluido.
- 1: Bajo Q150.
- 2: Recomendado Q300.
- 3: Institucional Q600.

Default:

2.

Texto visible:

> Material didáctico

Ayuda:

> Planillas de asistencia, hojas de anotación, lápices, impresiones y diplomas.

### 6.8 Premiación anual

Tipo:

Selector o slider de paquetes.

Opciones:

- 0: No incluido.
- 1: Básico Q300.
- 2: Recomendado Q750.
- 3: Institucional Q1,500.

Default:

2.

Texto visible:

> Premiación anual

Ayuda:

> Medallas, reconocimientos o premios para torneo municipal/regional.

### 6.9 Repuestos y reserva

Tipo:

Selector o input numérico simple.

Opciones:

- 0: No incluido.
- 1: Reserva básica Q500.
- 2: Reserva institucional Q1,000.

Default:

1.

Texto visible:

> Repuestos y reserva

Ayuda:

> Cubre pérdidas, piezas dañadas o material adicional para crecimiento.

## 7. Fórmulas

### 7.1 Materiales

```txt
equipmentSubtotal =
  chessSetsQty * chessSetUnitPrice
  + bagsQty * bagUnitPrice
  + clocksQty * clockUnitPrice
  + demoBoardsQty * demoBoardUnitPrice
  + teachingMaterialPackagePrice
  + awardsPackagePrice
  + reservePackagePrice
```

### 7.2 Mobiliario

```txt
furnitureSubtotal =
  includeFurniture
    ? tablesQty * tableUnitPrice + chairsQty * chairUnitPrice
    : 0
```

### 7.3 Inversión inicial

```txt
initialInvestment = equipmentSubtotal + furnitureSubtotal
```

### 7.4 Profesor mensual

```txt
monthlyTeacherCost =
  frequency === "three_days"
    ? 2250
    : 3750
```

### 7.5 Operación anual

```txt
annualTeacherCost = monthlyTeacherCost * 12
```

### 7.6 Total primer año

```txt
firstYearTotal = initialInvestment + annualTeacherCost
```

### 7.7 Costo por alumno

```txt
firstYearCostPerStudent =
  students > 0 ? firstYearTotal / students : 0
```

### 7.8 Ratio de juegos por alumno

```txt
studentsPerSet =
  chessSetsQty > 0 ? students / chessSetsQty : null
```

Uso:

Mostrar una recomendación automática:

- Si `studentsPerSet <= 1`: "Cobertura ideal".
- Si `studentsPerSet <= 1.5`: "Cobertura recomendada".
- Si `studentsPerSet <= 2`: "Cobertura operativa".
- Si `studentsPerSet > 2`: "Cobertura limitada".

## 8. Estructura de datos sugerida

```ts
type ProgramFrequency = "three_days" | "weekdays";
type BudgetPreset = "minimum" | "recommended" | "institutional" | "custom";
type PackageLevel = 0 | 1 | 2 | 3;

type BudgetState = {
  preset: BudgetPreset;
  students: number;
  frequency: ProgramFrequency;
  includeFurniture: boolean;
  chessSets: number;
  bags: number;
  clocks: number;
  demoBoards: number;
  tables: number;
  chairs: number;
  teachingMaterialLevel: PackageLevel;
  awardsLevel: PackageLevel;
  reserveLevel: 0 | 1 | 2;
};

type BudgetLineItem = {
  key: string;
  label: string;
  quantity: number;
  unitPrice: number;
  total: number;
  included: boolean;
  category: "equipment" | "furniture" | "operation";
};
```

## 9. Constantes sugeridas

```ts
const TEACHER_PACKAGES = {
  three_days: {
    label: "3 días por semana",
    daysPerWeek: 3,
    hoursPerDay: 2,
    weeklyHours: 6,
    monthlyCost: 2250,
  },
  weekdays: {
    label: "Lunes a viernes",
    daysPerWeek: 5,
    hoursPerDay: 2,
    weeklyHours: 10,
    monthlyCost: 3750,
  },
};

const UNIT_PRICES = {
  chessSet: 180,
  bag: 70,
  clock: 400,
  demoBoard: 500,
  table: 560,
  chair: 130,
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
};
```

## 10. Presets sugeridos en datos

```ts
const BUDGET_PRESETS = {
  minimum: {
    students: 20,
    frequency: "three_days",
    includeFurniture: true,
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
    students: 20,
    frequency: "three_days",
    includeFurniture: true,
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
```

## 11. Layout desktop

Estructura:

- Sección con fondo claro o `var(--color-grain)`.
- Encabezado con título y explicación breve.
- Grid de dos columnas:
  - Columna izquierda: controles.
  - Columna derecha: resumen fijo/sticky.

Columna izquierda:

1. Presets.
2. Alumnos y frecuencia.
3. Materiales de ajedrez.
4. Mobiliario.
5. Paquetes anuales.

Columna derecha:

1. Total año 1.
2. Inversión inicial.
3. Profesor mensual.
4. Operación anual.
5. Costo por alumno.
6. Estado de cobertura de tableros.
7. Desglose corto.

## 12. Layout mobile

Estructura:

1. Presets.
2. Resumen compacto superior.
3. Controles por grupos colapsables o bloques cortos.
4. Resumen final.

Regla:

El usuario no debe tener que llegar hasta el final para entender el impacto. Después de presets y frecuencia, debe aparecer al menos un total compacto.

## 13. Microcopy de resumen

### Total primer año

Label:

> Total estimado del primer año

Ayuda:

> Incluye inversión inicial y 12 meses de operación del programa.

### Inversión inicial

Label:

> Inversión inicial

Ayuda:

> Materiales, equipo, mobiliario activo y paquetes iniciales.

### Profesor mensual

Label:

> Programa mensual

Ayuda:

> Incluye planificación, traslado, factura, clase y seguimiento.

### Costo por alumno

Label:

> Costo anual por alumno

Ayuda:

> Estimación usando el total del primer año dividido entre alumnos configurados.

## 14. Alertas y recomendaciones automáticas

### Pocos tableros

Condición:

`students / chessSets > 2`

Texto:

> La cobertura de tableros es limitada. Se recomienda aumentar juegos o reducir cupos.

### Sin relojes

Condición:

`clocks === 0`

Texto:

> Sin relojes se puede iniciar la formación, pero la preparación competitiva queda limitada.

### Sin mobiliario

Condición:

`includeFurniture === false`

Texto:

> Mobiliario no incluido. Este cálculo asume que la municipalidad ya cuenta con mesas y sillas.

### Modalidad intensiva

Condición:

`frequency === "weekdays"`

Texto:

> La modalidad intensiva aumenta el costo operativo, pero permite mayor continuidad y avance.

## 15. Accesibilidad y usabilidad

- Cada slider debe tener label visible, valor actual y total calculado.
- No usar solo color para mostrar estados.
- Los rangos deben ser legibles en mobile.
- Los botones de preset deben mostrar nombre y breve descripción.
- Los montos deben usar formato `Q18,000`.
- El resumen debe actualizarse sin salto visual.
- En mobile, los controles no deben quedar demasiado juntos.

## 16. Decisiones para primera implementación

Estas decisiones quedan recomendadas para avanzar:

- Usar presets como control principal.
- Usar sliders para cantidades.
- No permitir editar precios unitarios en la primera versión pública.
- Mostrar precios como referenciales.
- Mantener mobiliario activo por defecto.
- Permitir apagar mobiliario con toggle.
- Usar Q2,250 y Q3,750 como paquetes oficiales del simulador.
- No mostrar `Q75/hora` como dato principal del resumen; explicarlo en texto si hace falta.
- Mostrar proveedores en una nota inferior, no como parte del simulador.

## 17. Criterios de aprobación de Fase 3

La Fase 3 se considera lista cuando:

- Los presets están definidos.
- Los sliders tienen mínimos, máximos y defaults.
- Las fórmulas están documentadas.
- El resumen tiene campos claros.
- El comportamiento mobile está definido.
- Hay reglas para advertencias automáticas.
- El usuario puede pasar a implementación sin rediseñar cálculos.

## 18. Próximo paso

Pasar a Fase 4: implementación web.

Antes de implementar, leer:

- `AGENTS.md`.
- Documentación local de Next en `node_modules/next/dist/docs/`, por la regla del proyecto.
- Página actual `/ajedrez/proyeccion`.
- Componentes públicos existentes.

La implementación debe mantener los documentos como fuente de producto, pero estructurar los datos del simulador en constantes limpias para poder actualizar precios después.
