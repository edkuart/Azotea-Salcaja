# Fase 2 - Progreso verificable

## Objetivo

Que cada miembro entienda cómo ha evolucionado, qué hizo recientemente y cuál es su próximo objetivo alcanzable.

## Alcance

- Historial de torneos y partidas derivado de datos reales.
- Evolución de ELO por torneo, mejor ELO y mejor posición.
- Actividad a 30, 90 y 365 días.
- Racha de jornadas elegibles consecutivas.
- Últimos resultados y resumen mensual.
- Próximo objetivo automático con progreso: participar, alcanzar una cantidad de torneos o partidas, superar una marca personal o acercarse al siguiente puesto.

## Diseño

Cada perfil tendrá “Tu progreso”, gráfica accesible, últimos tres torneos, racha, objetivo y línea de tiempo. La comparación principal será contra la trayectoria propia, no solo contra el líder.

## Motor de métricas

Una capa de dominio reconstruirá totales, serie de ELO, rachas, marcas, posiciones y objetivo desde torneos finalizados vinculados por `clubPlayerId`. El torneo sigue siendo la fuente de verdad; no se duplica estadística salvo que luego se justifique una caché.

## Reglas por cerrar con casos reales

- Participación válida y jornada elegible.
- Tratamiento de ausencia, retiro, bye e incomparecencia.
- Fecha de orden y correcciones posteriores.
- Una semana sin torneo no rompe la racha; se cuentan jornadas celebradas.

## Privacidad

Se respeta `showStats`; no se publican rivales de torneos privados, calendarios detallados de asistencia ni objetivos que avergüencen al participante.

## Fuera de alcance

Logros visuales, premios manuales, certificados, análisis de jugadas e IA de entrenamiento.

## Criterios de aceptación

- Métricas deterministas e idempotentes.
- Corregir resultados actualiza todo sin duplicar.
- No cuentan torneos cancelados o no elegibles.
- Un miembro nuevo recibe un objetivo útil.
- La gráfica resuelve 0, 1 y muchos puntos.
- Hay pruebas de rachas, serie de ELO, marcas y objetivos.

## Entregables

Módulo de métricas, panel de progreso, línea de tiempo, gráfica, motor de objetivos y pruebas.

## Diseño detallado

El perfil estadístico del jugador queda documentado en:

- `docs/CLUB_MIEMBROS_PERFIL_JUGADOR_ESTADISTICO.md`

Ese documento baja esta fase a una implementación concreta: qué datos calcular, cómo hacer clickeables las fotos/avatares desde rankings y torneos, qué mostrar en móvil y qué reglas de privacidad deben cumplirse antes de publicar estadísticas más profundas.
