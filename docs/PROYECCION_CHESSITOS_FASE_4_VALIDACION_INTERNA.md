# Proyección Chessitos - Fase 4: validación interna web

Fecha: 2026-06-20
Estado: implementación web validada internamente.

## 1. Alcance validado

Se rediseñó la página:

`/ajedrez/proyeccion`

Se agregó el componente interactivo:

`src/components/chess/ProjectionBudgetSimulator.tsx`

La página ahora incluye:

- Hero institucional municipal.
- Resumen ejecutivo.
- Problema y oportunidad.
- Modelo de apoyo municipal / Chessitos / comunidad.
- Simulador de inversión.
- Presupuesto mensual del profesor.
- Plan anual.
- Indicadores medibles.
- Meta de torneo regional/departamental.
- Perfil de profesores.
- Validación comunitaria.
- Bloque reservado para PDF institucional.

## 2. Pruebas ejecutadas

### TypeScript

Comando:

```bash
npm run typecheck
```

Resultado:

Pasó correctamente.

### Build

Comando:

```bash
npm run build
```

Resultado:

Pasó correctamente. La ruta `/ajedrez/proyeccion` se generó como página estática.

### ESLint dirigido

Comando:

```bash
npx eslint src/app/ajedrez/proyeccion/page.tsx src/components/chess/ProjectionBudgetSimulator.tsx
```

Resultado:

Pasó correctamente para los archivos de esta fase.

Nota:

`npm run lint` completo sigue fallando por errores existentes en archivos no relacionados con esta implementación.

## 3. Capturas generadas

Desktop:

`test-results/proyeccion-desktop.png`

Mobile:

`test-results/proyeccion-mobile.png`

Observaciones:

- Desktop se ve claro, con el simulador en dos columnas.
- El resumen del presupuesto aparece fuerte y legible.
- Mobile no presenta desbordes visibles.
- La página es larga, pero mantiene jerarquía clara por secciones.
- El bloque de PDF queda correctamente reservado y deshabilitado.

## 4. Prueba interactiva

Se probó el slider de alumnos con Playwright.

Resultado:

- Antes del cambio, el resumen mostraba 20 alumnos.
- Después de mover el slider a 30, el resumen cambió a 30 alumnos.
- El estado cambió a "Personalizado".

Esto confirma que el simulador actualiza estado y resumen en cliente.

## 5. Pendientes antes de validación externa

- Decidir si se quiere ajustar alguna frase antes de mostrarlo a terceros.
- Confirmar si la sección de profesores puede publicarse con el texto actual o si requiere nombres/logros.
- Confirmar si "torneo regional" debe cambiar a "departamental" o dejarse abierto.
- Confirmar si el bloque de PDF debe decir "en preparación" o "próximamente".
- Confirmar si el simulador debe iniciar con mobiliario activo, como está ahora.

## 6. Recomendación siguiente

Pasar a Fase 5: validación externa.

Validar con al menos tres perfiles:

- Un padre o madre de familia.
- Una persona vinculada a ajedrez.
- Una persona con criterio municipal/administrativo.

Preguntas clave:

- ¿Se entiende qué se está financiando?
- ¿El presupuesto parece claro?
- ¿Qué monto o rubro genera duda?
- ¿El plan anual parece alcanzable?
- ¿Qué faltaría para presentar esto al alcalde?
