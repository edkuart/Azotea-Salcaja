# Diseño de implementación - Proyección Chessitos

Fecha: 2026-06-20
Estado: diseño de producto. Sin implementación de código.

## 1. Objetivo

Convertir la página de Proyección Chessitos en una propuesta institucional seria para municipalidades, alcaldía, empresas aliadas y comunidad externa.

La página debe explicar, cuantificar y defender el proyecto como un programa municipal de ajedrez a largo plazo. No debe sentirse como una simple página de clases privadas. Debe responder tres preguntas:

- Qué se quiere construir.
- Cuánto puede costar.
- Qué resultados medibles puede esperar la municipalidad en 3, 6 y 12 meses.

El PDF final se trabajará al final del proceso, cuando existan logotipo, identidad visual final, nombres de responsables, precios revisados y estructura aprobada.

## 2. Principios de diseño

- Usar componentes existentes del sitio público: `PublicLayout`, `Section`, botones, estructura responsive y estilos ya presentes.
- Mantener coherencia con los colores, tipografías e imágenes públicas del ecosistema de ajedrez.
- Evitar duplicar sistemas visuales nuevos si ya existe un patrón funcional.
- Hacer que la página funcione como argumento de venta, no solo como contenido informativo.
- Separar claramente inversión inicial, operación mensual y visión anual.
- Permitir validación por personas externas: padres, jugadores, profesores, funcionarios municipales y posibles patrocinadores.
- Reservar logos, portada formal, firmas y descarga profesional para el PDF final.

## 3. Arquitectura propuesta de la página

La ruta recomendada sigue siendo:

`/ajedrez/proyeccion`

No conviene crear otra página todavía. La proyección debe vivir en una sola narrativa para que luego pueda exportarse o adaptarse a PDF.

Estructura propuesta:

1. Hero institucional.
2. Resumen ejecutivo.
3. Problema y oportunidad municipal.
4. Modelo del programa.
5. Simulador de inversión.
6. Presupuesto del profesor.
7. Materiales municipales.
8. Plan anual.
9. Torneo regional/departamental.
10. Perfil de profesores.
11. Validación comunitaria.
12. Próximos pasos.
13. Bloque reservado para descarga PDF.

## 4. Secciones clave

### 4.1 Hero institucional

Debe cambiar el tono de "página de alianza" a "propuesta municipal cuantificada".

Mensaje sugerido:

> Programa municipal de ajedrez para formación, competencia y desarrollo juvenil en Salcajá.

Elementos:

- Título fuerte: "Proyección Chessitos".
- Subtítulo: formación infantil y juvenil, materiales propios, profesores competitivos y ruta anual.
- CTA principal: "Ver presupuesto estimado".
- CTA secundario: "Ver plan anual".

Componentes:

- `PublicLayout`.
- `Section`.
- Imagen pública existente de `chessCommunity.image` o futura imagen propia.
- Botones existentes `btn btn-primary` y `btn btn-secondary`.

### 4.2 Resumen ejecutivo

Debe ser una sección breve, útil para funcionarios.

Contenido:

- El programa busca instalar una escuela municipal de ajedrez.
- La municipalidad puede invertir en materiales propios.
- Chessitos aporta metodología, profesores y seguimiento.
- El objetivo anual incluye ranking, torneos internos y una competencia regional o departamental.

Formato:

- Tres tarjetas: "Formación", "Equipamiento", "Competencia".
- Un bloque de cifras rápidas: alumnos objetivo, horas semanales, inversión inicial estimada, costo mensual del profesor.

### 4.3 Simulador de inversión

Esta será la sección más importante de la página.

Objetivo:

Permitir que el alcalde, encargado o comunidad vea cómo cambia el presupuesto al mover cantidades.

Controles:

- Slider de alumnos: 10 a 30.
- Selector de frecuencia: 3 días por semana o lunes a viernes.
- Selector de modalidad: mínima, recomendada, institucional.
- Sliders de materiales:
  - Juegos completos de ajedrez.
  - Bolsas o estuches.
  - Relojes digitales.
  - Mesas plegables.
  - Sillas plásticas.
  - Tablero mural o tablero demo.
  - Planillas/cuadernos/lápices.
  - Medallas/premios.
  - Repuestos.

Resultados automáticos:

- Total de inversión inicial.
- Costo mensual del profesor.
- Costo operativo anual.
- Total primer año.
- Costo aproximado por alumno.

Valores default recomendados:

- Alumnos: 20.
- Juegos completos: 15.
- Bolsas: 15.
- Relojes: 10.
- Mesas: 10.
- Sillas: 20.
- Tablero mural: 1.
- Medallas/premios: 1 paquete anual.
- Repuestos: 10% aproximado de juegos.

Regla pedagógica:

- Mínimo operativo: 10 juegos para 20 alumnos.
- Recomendado: 15 juegos para 20 alumnos.
- Ideal: 20 juegos para 20 alumnos.

### 4.4 Presupuesto del profesor

La tarifa interna será Q75 por hora, pero se debe presentar como paquete mensual de proyecto.

Escenarios:

| Modalidad         | Horas por semana | Costo mensual base | Paquete recomendado |
| ----------------- | ---------------: | -----------------: | ------------------: |
| 3 días por semana |              6 h |          Q1,948.50 |     Q2,100 - Q2,250 |
| Lunes a viernes   |             10 h |          Q3,247.50 |     Q3,500 - Q3,750 |

Notas:

- El cálculo usa 4.33 semanas por mes.
- El monto cubre clase, planificación, factura, transporte, preparación técnica y seguimiento.
- La página debe evitar venderlo como "solo hora de profesor".

Texto sugerido:

> El pago no cubre únicamente la presencia del instructor. Cubre planificación, traslado, facturación, preparación pedagógica, registro de avances y dirección técnica del grupo.

### 4.5 Materiales municipales

Esta sección debe explicar por qué conviene que la municipalidad compre materiales propios.

Argumentos:

- El equipo queda inventariado como patrimonio municipal.
- Se reduce dependencia de materiales privados.
- Permite continuidad aunque cambie el profesor o sede.
- Facilita torneos internos, clases y actividades comunitarias.

Categorías:

- Juegos de ajedrez.
- Relojes.
- Bolsas/estuches.
- Mobiliario.
- Material didáctico.
- Premiación.

La página puede mostrar proveedores como referencia, pero no debe depender de un proveedor único.

### 4.6 Plan anual

Debe verse como una hoja de ruta medible.

Meses 1-2:

- Diagnóstico.
- Reglas, piezas, jaque mate, disciplina de tablero.
- Primer control de asistencia.

Meses 3-4:

- Táctica básica.
- Mini torneos.
- Primeras evaluaciones por nivel.

Meses 5-6:

- Uso de reloj.
- Finales básicos.
- Ranking interno inicial.

Meses 7-9:

- Partidas anotadas.
- Preparación competitiva.
- Selección de alumnos constantes.

Meses 10-12:

- Torneo municipal.
- Invitación regional o departamental.
- Medallas, premios y reporte final.

Indicadores:

- Alumnos inscritos.
- Asistencia promedio.
- Alumnos activos al mes 3, 6 y 12.
- Torneos internos realizados.
- Partidas registradas.
- Alumnos seleccionados para competencia externa.

### 4.7 Torneo regional o departamental

La propuesta debe dejar sembrado desde el inicio que el programa no termina en clases.

Objetivo:

En un año, buscar apoyo municipal para una competencia regional o departamental.

Necesidades:

- Medallas.
- Premios.
- Sede.
- Mesas y sillas.
- Convocatoria.
- Contactos con municipios/colegios/academias.
- Apoyo logístico.

Texto sugerido:

> La meta anual es que el programa no solo enseñe ajedrez, sino que genere una primera competencia municipal con alcance regional o departamental, capaz de visibilizar el talento local y motivar continuidad.

### 4.8 Perfil de profesores

Debe dar credibilidad sin prometer títulos que no estén documentados.

Texto base:

> El programa será impartido por profesores vinculados a procesos competitivos y de selección nacional en categorías inferiores, con experiencia práctica en formación ajedrecística y continuidad del legado competitivo local.

Pendiente antes de publicar:

- Confirmar nombres.
- Confirmar logros.
- Confirmar categorías.
- Confirmar si se pueden mostrar fotos.
- Confirmar si se puede usar el término "selección nacional" con respaldo.

### 4.9 Validación comunitaria

Esta sección puede aparecer como fase de proceso, no necesariamente como encuesta pública en la primera versión.

Objetivo:

Que la propuesta pueda ser revisada por:

- Padres de familia.
- Jugadores locales.
- Profesores.
- Encargados municipales.
- Posibles patrocinadores.

Mecanismos:

- Botón de WhatsApp para comentarios.
- Formulario futuro.
- Revisión por 3 perfiles externos antes de cerrar PDF.
- Preguntas rápidas: claridad, confianza, precio, materiales, resultados esperados.

## 5. Diseño del simulador

### 5.1 Layout desktop

Dos columnas:

- Izquierda: controles.
- Derecha: resumen fijo del presupuesto.

La derecha debe mostrar:

- Inversión inicial.
- Operación mensual.
- Total año 1.
- Modalidad seleccionada.
- Capacidad sugerida.

### 5.2 Layout mobile

Una columna:

1. Controles.
2. Totales.
3. Detalle por categoría.

El total debe ser visible después de cada bloque de sliders para que no se pierda la relación entre cantidad y precio.

### 5.3 Estados

- Default recomendado.
- Mínimo operativo.
- Institucional completo.
- Ajuste personalizado.

### 5.4 Texto de protección

Debe incluir una nota legal/comercial:

> Los precios son referenciales y deben confirmarse con proveedor antes de compra. Pueden variar por disponibilidad, envío, impuestos, tipo de cambio y calidad seleccionada.

## 6. Datos necesarios antes de implementación

Materiales:

- Precio local de juego básico.
- Precio internacional de juego completo.
- Precio de bolsa básica.
- Precio de reloj económico.
- Precio de reloj recomendado.
- Precio de mesa plegable.
- Precio de silla plástica.
- Precio de tablero mural/demo.
- Precio de medallas/premios.

Operación:

- Sede.
- Cupos iniciales.
- Rango de edades.
- Días disponibles.
- Horario probable.
- Responsable municipal.
- Profesor o profesores disponibles.

Identidad:

- Logotipo Chessitos.
- Logotipo municipal si aplica.
- Logotipo Azotea si aplica.
- Fotos propias del programa.
- Nombres de responsables.

## 7. Fases de trabajo

### Fase 1 - Investigación y datos base

Entregable:

- Tabla de materiales con precios bajo, medio e institucional.
- Fuentes consultadas.
- Supuestos de tipo de cambio, envío y buffer.
- Lista de proveedores posibles.

Criterios de aprobación:

- Los precios son defendibles.
- Hay mínimo dos referencias por categoría importante.
- Se distinguen precios locales e internacionales cuando existan.
- Se entiende qué incluye y qué no incluye cada costo.

### Fase 2 - Diseño narrativo de la propuesta

Entregable:

- Copy final de secciones.
- Argumento municipal.
- Justificación de inversión propia.
- Perfil de profesores.
- Plan anual.

Criterios de aprobación:

- Un funcionario entiende el proyecto en menos de 3 minutos.
- La propuesta no promete Elo ni resultados imposibles.
- La ruta anual se siente seria y medible.
- El tono es institucional, no improvisado.

### Fase 3 - Diseño funcional del simulador

Entregable:

- Lista final de sliders.
- Valores mínimos, máximos y default.
- Fórmulas de cálculo.
- Estados: mínimo, recomendado, institucional.

Criterios de aprobación:

- El presupuesto cambia claramente al mover cantidades.
- Los totales son fáciles de leer.
- El sistema permite desactivar mobiliario si la municipalidad ya lo tiene.
- El resultado sirve para conversación con alcalde.

### Fase 4 - Implementación web

Entregable:

- Página `/ajedrez/proyeccion` rediseñada.
- Simulador funcional.
- Responsive desktop/mobile.
- Uso de componentes públicos existentes.

Criterios de aprobación:

- No rompe navegación existente.
- Mantiene coherencia visual con Chessitos/Azotea.
- El simulador funciona sin recargar.
- Los textos y números son editables desde una estructura clara.

### Fase 5 - Validación externa

Entregable:

- Revisión con mínimo 3 perfiles externos.
- Ajustes de claridad.
- Ajustes de presupuesto.
- Registro de dudas frecuentes.

Criterios de aprobación:

- Padres entienden beneficios.
- Encargados municipales entienden costos.
- Profesores validan que la ruta anual sea realista.
- Posibles patrocinadores identifican dónde pueden aportar.

### Fase 6 - PDF institucional

Entregable:

- PDF descargable y presentable.
- Logotipos.
- Portada.
- Presupuesto final.
- Plan anual.
- Firmas o responsables.
- Petición formal al alcalde.

Criterios de aprobación:

- Se ve profesional.
- Puede imprimirse.
- Puede enviarse por WhatsApp.
- Resume la página sin depender de que el alcalde navegue todo el sitio.

## 8. Bloque PDF reservado

La página puede incluir desde ahora una sección pequeña al final:

> Documento institucional
> La versión descargable de la propuesta se preparará al finalizar la validación de costos, logotipos y responsables del proyecto.

Botón inicial:

- Estado deshabilitado o "Próximamente".

Cuando esté listo:

- "Descargar propuesta para alcaldía".

## 9. Validación con comunidad externa

Preguntas sugeridas:

- ¿Se entiende qué está comprando o financiando la municipalidad?
- ¿El presupuesto parece transparente?
- ¿Qué rubro genera más duda?
- ¿La frecuencia de clases se percibe suficiente?
- ¿El plan anual parece alcanzable?
- ¿Qué faltaría para aprobarlo?
- ¿Qué materiales ya podría tener la municipalidad?
- ¿Qué empresa local podría patrocinar premios, relojes o transporte?

La validación no debe usarse para pedir permiso creativo, sino para detectar puntos confusos antes de presentar formalmente.

## 10. Riesgos

- Prometer avance competitivo demasiado rápido.
- Mezclar precios internacionales sin explicar envío, impuestos o variación.
- Presentar la tarifa del profesor como hora suelta, reduciendo percepción de valor.
- Depender de material privado.
- No diferenciar entre mínimo operativo y recomendación profesional.
- Hacer el PDF antes de cerrar identidad visual y responsables.

## 11. Decisiones pendientes

- Si la página mantendrá el nombre "Proyección Chessitos" o se presentará como "Programa Municipal de Ajedrez Chessitos".
- Si se mostrará Azotea como apoyo, sede, aliado o solo origen del ecosistema.
- Si se incluirán nombres/fotos de profesores en la versión web.
- Si el simulador mostrará proveedores específicos o solo rangos referenciales.
- Si la petición al alcalde irá como carta formal, presupuesto institucional o ambos.
- Si la competencia anual se planteará como regional o departamental desde el inicio.

## 12. Próximo paso recomendado

Completar la Fase 1 con investigación de materiales y precios.

Después de aprobar datos, pasar a Fase 2 para cerrar narrativa y copy antes de tocar código.
