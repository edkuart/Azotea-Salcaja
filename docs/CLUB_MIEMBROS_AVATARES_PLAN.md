# Plan profesional de avatares para miembros de Chessitos

Estado: colección e integración completadas; migración preparada y validación visual realizada en local.

Recursos disponibles:

- `public/images/chessitos/avatars/pilots/chessitos-m01-pilot.png`
- `public/images/chessitos/avatars/pilots/chessitos-m04-pilot.png`
- `public/images/chessitos/avatars/pilots/chessitos-f02-pilot.png`
- vista de revisión: `/avatar-pilots-preview.html`
- colección optimizada: `public/images/chessitos/avatars/*.webp`
- catálogo permitido: `src/modules/chess/avatars.ts`
- componente compartido: `src/components/chess/ClubMemberAvatar.tsx`

Los quince personajes están producidos: trece de presentación masculina y dos femenina. La galería administrativa, la validación del servidor y la prioridad fotografía autorizada → avatar → iniciales están implementadas.

## 1. Objetivo

Dar más vida al directorio, los perfiles, rankings y torneos mediante una familia propia de avatares ilustrados que el administrador pueda asignar cuando un miembro no tenga una fotografía pública autorizada.

La solución debe:

- sentirse parte de Chessitos y Azotea Salcajá;
- ser divertida sin verse infantil, genérica ni ajena al sitio;
- proteger la identidad de niños, jóvenes y adultos que no usan una foto real;
- funcionar de forma consistente en tamaños pequeños y grandes;
- permitir que el administrador elija el avatar, lo cambie o vuelva a iniciales;
- conservar la fotografía real como una opción separada y sujeta a autorización.

## 2. Diagnóstico del producto actual

Hoy no existe un único reemplazo visual. El producto usa:

- iniciales en el directorio, rankings, torneos y listados administrativos;
- un ícono neutro en el formulario de fotografía;
- fotografía real cuando `photoUrl` está disponible y autorizada;
- diferentes implementaciones visuales para representar a la misma persona.

El modelo ya separa la visibilidad del perfil y la autorización de fotografía mediante `profileVisibility` y `showPhoto`. Esa separación se debe conservar. Un avatar ilustrado no debe guardarse como si fuera una fotografía real ni depender del consentimiento de imagen personal, porque será un personaje ficticio sin parecido intencional con el miembro.

## 3. Dirección artística recomendada

### Concepto: retratos del club en estilo cartel editorial

La familia debe adoptar el lenguaje que ya tiene la página:

- ilustración plana en dos dimensiones, no 3D;
- contorno negro grueso y formas de lectura inmediata;
- paleta limitada a crema, azul marino, dorado, rojo escenario, café y negro;
- sombra dura desplazada y textura de grano muy sutil;
- busto frontal o en tres cuartos, centrado y recortable en círculo;
- uno o dos guiños ajedrecísticos discretos, por ejemplo cuello con patrón de tablero, pin de caballo o fondo geométrico; nunca disfrazar a todos como piezas de ajedrez;
- expresión amable, segura y competitiva, sin gestos agresivos ni caricaturas exageradas.

No se recomiendan avatares 3D brillantes, emojis, anime, fotografías sintéticas ni estilos mezclados. Chocarían con la identidad de cartel, vinilo y ajedrez clásico que ya usa Chessitos.

### Especificación visual

- Lienzo maestro: 512 × 512 px.
- Formato de producción: WebP local de 512 × 512, sin scripts, enlaces ni recursos externos.
- Zona segura: rostro y rasgos principales dentro del 72% central para soportar recorte circular.
- Fondo: una forma geométrica simple por avatar; nunca transparente si eso reduce la lectura en crema o azul marino.
- Silueta: cabeza y hombros suficientemente grandes para reconocerse a 32 px.
- Detalle: ningún rasgo esencial menor de 3 px en la versión de 32 px.
- Peso final: aproximadamente 21–35 KB por recurso y 435 KB para toda la colección.
- Sin texto dentro de los archivos.

### Movimiento

Los personajes deben ser estáticos. La sensación de vida vendrá de una microinteracción del componente: elevación de 1–2 px, sombra dura o pequeño cambio del fondo al pasar el puntero o seleccionar. No se recomiendan GIF, video ni animación facial continua: agregan distracción, peso y problemas de consistencia.

Toda microanimación debe respetar `prefers-reduced-motion`.

## 4. Colección inicial: 15 personajes

Se propone una colección de 15 retratos: 13 de presentación masculina y 2 de presentación femenina. La proporción masculina es 86.7%, alineada con el 87% comunicado para la membresía actual.

La proporción del catálogo no debe convertirse en una regla de asignación. El administrador puede elegir cualquier personaje para cualquier miembro. El sistema nunca debe inferir o asignar automáticamente un avatar por nombre, sexo, edad o apariencia.

| ID | Presentación | Etapa visual | Rasgos principales |
| --- | --- | --- | --- |
| `chessitos-m01` | Masculina | niñez | cabello corto ondulado, sonrisa abierta, fondo dorado |
| `chessitos-m02` | Masculina | niñez | cabello rizado, rostro redondo, fondo azul |
| `chessitos-m03` | Masculina | niñez | flequillo recto, expresión concentrada, fondo rojo |
| `chessitos-m04` | Masculina | adolescencia | cabello corto texturizado, gafas, pin de caballo |
| `chessitos-m05` | Masculina | adolescencia | cabello medio lacio, expresión tranquila, fondo crema y azul |
| `chessitos-m06` | Masculina | adolescencia | cabello rizado alto, sonrisa discreta, patrón de tablero |
| `chessitos-m07` | Masculina | adolescencia | corte corto lateral, cejas marcadas, fondo dorado y negro |
| `chessitos-m08` | Masculina | juventud | cabello ondulado, gafas redondas, cuello rojo |
| `chessitos-m09` | Masculina | juventud | cabello largo recogido, expresión segura, fondo azul profundo |
| `chessitos-m10` | Masculina | adultez | cabello corto, barba ligera, fondo crema y café |
| `chessitos-m11` | Masculina | adultez | cabello rapado, rostro alargado, pin de torre |
| `chessitos-m12` | Masculina | adultez | cabello entrecano, bigote discreto, fondo dorado |
| `chessitos-m13` | Masculina | adultez | calvicie parcial, gafas rectangulares, fondo rojo y azul |
| `chessitos-f01` | Femenina | niñez/adolescencia | cabello rizado medio, expresión alegre, fondo dorado y azul |
| `chessitos-f02` | Femenina | juventud/adultez | cabello corto ondulado, gafas, fondo crema y rojo |

La matriz final debe variar de manera combinada —no solamente cambiando el tono de piel— los siguientes aspectos:

- tonos de piel presentes en la comunidad guatemalteca;
- formas de rostro y nariz;
- texturas, largos y cortes de cabello;
- edades visuales sin indicar una edad exacta;
- gafas y rasgos cotidianos;
- expresiones y fondos.

No se debe usar vestimenta, color, peinado o accesorios como código rígido de género. Tampoco se deben emplear trajes indígenas, símbolos culturales o rasgos étnicos como decoración sin una revisión auténtica con personas de la comunidad.

## 5. Buenas prácticas derivadas de la investigación

### Inclusión y representación

Microsoft resume el diseño inclusivo en reconocer la exclusión, aprender de la diversidad y extender soluciones creadas con personas reales. Aplicado aquí, la matriz no debe decidirse únicamente desde el equipo técnico: tres a cinco miembros o responsables deberían revisar los primeros bocetos antes de producir la serie completa.

La guía de UNICEF para representar niños recomienda respetar dignidad, privacidad y contexto, evitar estereotipos positivos o negativos y no publicar imágenes que puedan ponerlos en riesgo. Los avatares ficticios son una buena alternativa de privacidad, siempre que no intenten imitar el rostro de una persona real y la fotografía continúe requiriendo autorización.

### Accesibilidad

W3C indica que las imágenes decorativas deben usar alternativa vacía y que las imágenes funcionales deben describir la acción. Por eso:

- junto al nombre del jugador, el avatar será decorativo con `alt=""`;
- cuando el avatar sea parte de un enlace, el enlace mantendrá un nombre accesible como `Ver perfil de Edwart`;
- en el selector administrativo, cada opción será un botón con nombre accesible, por ejemplo `Seleccionar avatar 04`;
- la selección tendrá borde, marca de verificación y texto; no dependerá solo del color;
- el foco visible conservará el anillo dorado que ya usa el sitio;
- se verificará contraste mínimo de 3:1 para bordes y elementos gráficos importantes;
- se probará teclado, lector de pantalla, zoom 200% y reducción de movimiento.

### Consistencia y control

Los sistemas de diseño recomiendan reutilizar el mismo componente y patrón para reducir carga cognitiva. El proyecto debe tener un solo componente de avatar para directorio, perfil, rankings, torneos y administración, con tamaños documentados.

Una biblioteca generativa como DiceBear puede servir para prototipos y demuestra el valor de semillas deterministas, pero no se recomienda consumir un servicio externo en producción. Chessitos necesita una familia original, control artístico, archivos alojados localmente y una licencia clara. Si se reutiliza una base de terceros, se debe auditar la licencia específica del estilo antes de modificar o publicar los recursos.

## 6. Experiencia del administrador

En la ficha del jugador, sustituir el bloque aislado de “Foto” por una sección denominada **Representación visual** con tres estados explícitos:

1. **Foto autorizada**: subir o conservar fotografía real; solo se muestra públicamente cuando el perfil y `showPhoto` lo permiten.
2. **Avatar del club**: abrir una galería con los 15 personajes y guardar uno.
3. **Iniciales**: opción neutra y reversible cuando no se quiere elegir un personaje.

### Selector propuesto

- Cuadrícula de 3 columnas en móvil y 5 en escritorio.
- Vista previa de cada avatar a 64 px y vista previa final a 96 px.
- Área completa de cada opción seleccionable, no solo la imagen.
- Estado seleccionado con borde negro de 3 px, sombra dura, check visible y texto `Seleccionado`.
- Botones `Guardar`, `Cancelar` y `Usar iniciales`.
- La opción guardada se muestra inmediatamente en la fila del jugador.
- No hace falta buscador ni filtros para una colección de solo 15 elementos.

El administrador debe poder cambiar la selección sin borrar la foto almacenada. Así puede ocultar una fotografía por privacidad, usar temporalmente un avatar y volver a la foto si existe autorización vigente.

## 7. Modelo de datos y reglas de prioridad

Agregar un campo independiente:

```text
avatarId String? @map("avatar_id")
```

No guardar el SVG completo ni una URL arbitraria en la base de datos. Guardar solamente un identificador permitido y resolverlo contra un catálogo versionado del proyecto.

Orden de representación pública:

1. fotografía, solo si existe y está públicamente autorizada;
2. avatar seleccionado del club;
3. iniciales;
4. ícono neutro únicamente si tampoco existe un nombre utilizable.

Reglas técnicas:

- validar `avatarId` en el servidor contra una lista cerrada;
- rechazar identificadores desconocidos en las rutas de creación y edición;
- mantener un catálogo central con ID, ruta, versión y descripción administrativa;
- nunca construir rutas de archivo directamente desde un valor recibido del cliente;
- mantener el fallback a iniciales si un archivo falta o no carga;
- no usar el sexo almacenado para asignar o restringir personajes.

## 8. Arquitectura propuesta

### Recursos

- `public/images/chessitos/avatars/chessitos-m01.webp` … `chessitos-f02.webp`
- `src/modules/chess/avatars.ts`: catálogo permitido y metadatos.

### Componente compartido

Crear un único `ClubMemberAvatar` con:

- nombre;
- fotografía pública autorizada opcional;
- `avatarId` opcional;
- tamaño;
- contexto decorativo o funcional;
- fallback a iniciales;
- tratamiento de error de carga.

Este componente reemplazará progresivamente las variantes actuales en:

- directorio de miembros;
- perfil individual;
- ELO del club;
- circuito anual e histórico;
- posiciones y páginas de torneos;
- tarjetas de pertenencia y QR;
- filas y formulario del administrador.

## 9. Fases de ejecución

### Fase 0 — Aprobación de dirección

Entregables:

- tablero de referencias visuales;
- mini guía de paleta, línea, proporción y fondos;
- tres avatares piloto: niñez masculina, adolescencia masculina y juventud/adultez femenina;
- prueba de los tres a 32, 56 y 96 px dentro de capturas reales del sitio.

Criterio de salida: el estilo se reconoce como Chessitos sin leer un logotipo.

### Fase 1 — Matriz y producción artística

Entregables:

- matriz aprobada de los 15 personajes;
- 15 SVG maestros consistentes;
- revisión de parecido accidental, estereotipos, recorte circular y legibilidad pequeña;
- optimización y manifiesto de recursos.

Criterio de salida: todos parecen pertenecer al mismo universo, pero cada uno se distingue a 32 px.

### Fase 2 — Datos y administración

Entregables:

- migración `avatarId`;
- catálogo y validación del servidor;
- galería accesible en alta/edición de jugadores;
- previsualización y opción de volver a iniciales.

Criterio de salida: el administrador puede elegir, guardar, cambiar y quitar un avatar sin afectar la fotografía.

### Fase 3 — Unificación pública

Entregables:

- componente compartido;
- reemplazo de fallbacks en todas las superficies públicas y administrativas;
- prioridad correcta entre foto, avatar e iniciales;
- conservación de permisos de fotografía.

Criterio de salida: el mismo miembro conserva la misma representación en todo el producto.

### Fase 4 — Calidad y lanzamiento

Pruebas:

- tamaños 24, 30, 32, 40, 44, 56, 96 y 160 px;
- móvil, tableta y escritorio;
- teclado, lector de pantalla, zoom y movimiento reducido;
- foto autorizada, foto oculta, avatar seleccionado, iniciales y recurso roto;
- perfiles públicos, de iniciales y privados;
- carga, caché y peso total;
- revisión visual con miembros o responsables antes de publicación general.

Criterio de salida: cero regresiones de privacidad y una representación consistente en las superficies críticas.

### Fase 5 — Gobierno de la colección

- Versionar recursos; no cambiar silenciosamente el dibujo de un ID ya asignado.
- Añadir nuevos avatares con IDs nuevos.
- Registrar autor, licencia y fecha de aprobación.
- Revisar la proporción del catálogo cuando cambie la composición real del club.
- Permitir que miembros o responsables soliciten cambio de avatar.

## 10. Estimación de trabajo

Una ejecución cuidada requiere aproximadamente 4 a 6 jornadas de trabajo:

- dirección y tres pilotos: 1 jornada;
- producción y revisión de los 15 retratos: 1.5 a 2.5 jornadas;
- datos, selector y componente compartido: 1 a 1.5 jornadas;
- integración completa y pruebas: 0.5 a 1 jornada.

La mejor forma de reducir riesgo es aprobar primero tres pilotos dentro de la interfaz real. No conviene producir los 15 antes de validar proporción, línea, expresiones y lectura a 32 px.

## 11. Criterios de aceptación

- Existen 15 opciones aprobadas y distinguibles.
- La colección conserva una tendencia masculina cercana al 87% sin restringir la selección.
- Ningún avatar representa o imita intencionalmente a un miembro real.
- El administrador controla foto, avatar e iniciales como estados separados.
- La fotografía nunca se publica sin las reglas de autorización ya existentes.
- Un solo componente representa al jugador en todo el producto.
- Todos los recursos funcionan en círculo y siguen siendo legibles a 32 px.
- El selector es usable con teclado y lector de pantalla.
- El producto funciona aunque un recurso ilustrado falle.
- Los archivos se sirven localmente, tienen licencia documentada y no dependen de un proveedor externo.

## 12. Fuentes consultadas

- Microsoft Inclusive Design, principios de diseño inclusivo: https://inclusive.microsoft.design/articles/inclusive-101-guidebook
- UNICEF, representación ética de niños y jóvenes: https://www.unicef.org/media/reporting-guidelines
- W3C WAI, tutorial de alternativas textuales para imágenes: https://www.w3.org/WAI/tutorials/images/
- Atlassian Design System, principios de accesibilidad y consistencia: https://atlassian.design/foundations/accessibility
- DiceBear, avatares deterministas y consideraciones de licencias: https://www.dicebear.com/ y https://www.dicebear.com/how-to-use/cli/
