# Plan maestro - Comunidad y miembros Chessitos

Fecha: 2026-07-10  
Estado: Fase 1 implementada como base segura. Fase 4 tiene un primer kit visual en perfiles autorizados; la emisión administrativa completa queda pendiente.

## 1. Propósito

Transformar la página actual de ranking en una experiencia de comunidad donde cada participante pueda reconocer su progreso, sentirse parte del club y tener una razón clara para regresar.

La evolución no reemplaza el motor actual de torneos, ELO y circuito anual. Lo utiliza como base para construir cinco capas de valor:

1. Identidad del miembro.
2. Progreso verificable.
3. Reconocimiento significativo.
4. Pertenencia al club.
5. Comunidad conectada.

## 2. Resultado esperado

Al completar las cinco fases, Chessitos tendrá:

- Directorio visual de miembros con perfiles públicos seguros.
- Historial individual derivado de torneos reales.
- Objetivos, rachas y evolución de desempeño.
- Logros individuales y colectivos con reglas transparentes.
- Carné digital y pasaporte de participación.
- Actividad reciente del club generada desde eventos reales.
- Retos semanales y enlaces opcionales con ecosistemas externos.
- Administración de permisos, autorización y visibilidad por miembro.

## 3. Principios de producto

### Progreso antes que decoración

Una insignia solo existe si representa una conducta, resultado o contribución verificable. No se agregarán puntos o premios desconectados de la actividad real.

### Más de una forma de destacar

La experiencia reconocerá competencia, constancia, progreso, colaboración y pertenencia. Ganar una clasificación no será el único camino de reconocimiento.

### Información pública mínima

La fecha de nacimiento, contactos y notas administrativas nunca serán públicos. Para menores, la visibilidad de nombre, fotografía, edad y perfil será configurable por separado.

### Datos derivados cuando sea posible

Partidas, torneos, resultados, ELO, posiciones y rachas se calcularán desde los torneos existentes. Solo se almacenará lo que no pueda reconstruirse con seguridad.

### Administración sencilla

La mayor parte de la experiencia debe actualizarse automáticamente. El administrador solo intervendrá para autorizaciones, reconocimientos editoriales, retos, correcciones y excepciones.

### Mobile-first y compartible

Los perfiles, carnés, certificados y retos deben funcionar primero en teléfono y producir enlaces o piezas visuales fáciles de compartir.

## 4. Arquitectura de información final

Ruta principal recomendada:

`/ajedrez/club`

Navegación interna:

- Comunidad: resumen, actividad y próximos hitos.
- Miembros: directorio y filtros.
- Ranking: ELO, circuito anual e histórico actuales.
- Logros: reconocimientos individuales y colectivos.
- Retos: actividades vigentes y anteriores.

Rutas de detalle:

- `/ajedrez/club/jugadores/[slug]`
- `/ajedrez/club/logros`
- `/ajedrez/club/retos`

El ranking actual permanece disponible durante toda la transición. Las nuevas secciones se incorporarán progresivamente sin bloquear el uso de torneos.

## 5. Mapa de fases

| Fase | Nombre              | Valor visible                                                 | Dependencia principal        |
| ---- | ------------------- | ------------------------------------------------------------- | ---------------------------- |
| 1    | Identidad           | Cada miembro tiene una ficha reconocible y segura             | Roster actual                |
| 2    | Progreso            | Cada miembro entiende su evolución y próximo objetivo         | Perfiles de fase 1 + torneos |
| 3    | Reconocimiento      | El club celebra logros diversos y verificables                | Métricas de fase 2           |
| 4    | Pertenencia         | La membresía se vuelve tangible y compartible                 | Identidad + logros           |
| 5    | Comunidad conectada | El club genera actividad continua dentro y fuera de los lunes | Todas las fases previas      |

## 6. Modelo de privacidad

Cada miembro tendrá un estado de publicación:

- `private`: visible solo en administración.
- `initials`: ficha pública con iniciales o alias y avatar neutro.
- `public`: ficha con los campos expresamente autorizados.

Permisos independientes recomendados:

- Mostrar nombre público.
- Mostrar fotografía.
- Mostrar rango de edad o categoría.
- Mostrar estadísticas.
- Permitir compartir perfil.
- Permitir carné descargable.
- Fecha de autorización.

La fecha de nacimiento exacta seguirá siendo privada. La interfaz pública utilizará categoría o rango de edad derivado.

## 7. Estrategia técnica transversal

- Mantener `ClubPlayer` como identidad permanente del club.
- Mantener el historial competitivo derivado de torneos finalizados.
- Agregar migraciones de Prisma pequeñas y reversibles por fase.
- Centralizar cálculos de métricas en el dominio `modules/chess`.
- Evitar lógica de negocio duplicada entre página pública y panel admin.
- Generar slugs estables, pero usar el ID interno como identidad real.
- Añadir pruebas unitarias para reglas y pruebas E2E para recorridos públicos/admin.
- Revisar la guía local de Next.js 16 antes de implementar rutas, caché, formularios o APIs.

## 8. Métricas de éxito

Las métricas se incorporarán gradualmente:

- Porcentaje de miembros activos con perfil configurado.
- Porcentaje de miembros con fecha de autorización registrada.
- Visitas a perfiles y uso del directorio, sin rastreo invasivo.
- Participantes únicos por mes.
- Repetición de asistencia a 30, 60 y 90 días.
- Miembros que completan un objetivo o logro.
- Carnés/certificados generados.
- Participación en retos.
- Actividad interclubes o digital enlazada.

## 9. Definición global de terminado

Una fase se considera terminada únicamente cuando:

- Su migración y contratos de datos están definidos.
- El panel admin permite operar la función sin editar datos manualmente.
- La experiencia pública funciona en móvil y escritorio.
- Los estados vacíos, privados, inactivos y con datos incompletos están resueltos.
- Las reglas tienen pruebas unitarias cuando aplican.
- Los flujos críticos tienen validación E2E.
- Typecheck, lint, pruebas y build pasan.
- Se validó visualmente con datos reales o representativos.
- La guía de administración y las notas de entrega están actualizadas.

## 10. Documentos de ejecución

- [Fase 1 - Identidad](./CLUB_MIEMBROS_FASE_1_IDENTIDAD.md)
- [Fase 2 - Progreso](./CLUB_MIEMBROS_FASE_2_PROGRESO.md)
- [Fase 3 - Reconocimiento](./CLUB_MIEMBROS_FASE_3_RECONOCIMIENTO.md)
- [Fase 4 - Pertenencia](./CLUB_MIEMBROS_FASE_4_PERTENENCIA.md)
- [Fase 5 - Comunidad conectada](./CLUB_MIEMBROS_FASE_5_COMUNIDAD.md)

## 11. Orden obligatorio de implementación

Las fases se implementarán en orden. Se permite preparar contratos técnicos futuros, pero no publicar una función que dependa de una fase incompleta. Al cerrar cada fase se realizará una revisión de datos reales antes de iniciar la siguiente.

## 12. Estado de implementación actual

- Fase 1: migración, proyección pública segura, directorio, perfil, controles de privacidad y protección de APIs administrativas.
- Fase 4 parcial: carné visual, pasaporte de progreso, constancia visual y QR descargable solo cuando el perfil permite compartirse.
- Pendiente: emisión formal, auditoría de certificados, revocación por token propio, lotes de impresión y previsualización administrativa completa.
