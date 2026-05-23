# Azotea Salcaja - Technical Design

Fecha de investigacion: 2026-05-23  
Estado: Fase 0, investigacion y diseno tecnico. Sin implementacion.

## 1. Resumen ejecutivo

Azotea Salcaja debe construirse como una web de restaurante local con un modulo comunitario de ajedrez integrado, pero jerarquicamente secundario. La web publica debe resolver primero las necesidades de un cliente que busca comer: ver menu, precios, fotos, horarios, ubicacion, contacto y eventos. El ajedrez debe funcionar como activo de comunidad, marketing y administracion de torneos, sin convertir la home en una plataforma deportiva.

La recomendacion tecnica es un monolito modular con Next.js, TypeScript, Tailwind CSS, PostgreSQL en Supabase, Prisma, Supabase Storage y despliegue en Vercel. Esta combinacion permite lanzar rapido, mantener una sola base de codigo y separar dominios internamente: restaurante, eventos, ajedrez, admin, imagenes y autenticacion.

El modulo de ajedrez debe modelarse desde el inicio como motor de torneos, no como pantallas sueltas. Los elementos clave son participantes, rondas, partidas, resultados, byes, ausencias, standings, desempates y bitacora de cambios. Para torneos oficiales, los datos se guardan y se publican de forma controlada. Para torneos casuales, se propone una experiencia sin login mediante links privados con tokens de vista y administracion.

## 2. Objetivos del proyecto

- Presentar profesionalmente el restaurante Azotea Salcaja.
- Publicar un catalogo digital de productos sin carrito ni pagos en el MVP.
- Permitir al administrador editar productos, precios, fotos, categorias, eventos, horarios y contacto.
- Integrar una seccion de ajedrez coherente con la marca del restaurante.
- Permitir torneos oficiales administrados por el restaurante.
- Permitir torneos privados/casuales creados desde telefono sin login obligatorio.
- Soportar sistema suizo, round robin, byes, resultados, standings y desempates configurables.
- Preparar la arquitectura para pedidos en linea, reservas, pagos y torneos mas formales en el futuro.

## 3. Investigacion realizada

### Restaurantes, menu digital y SEO local

Google Business Profile recomienda representar el negocio de forma fiel, mantener direccion, horarios, telefono y web precisos, y usar menus completos y representativos. Tambien distingue que una URL de menu de restaurante no debe apuntar directamente a servicios externos de delivery. Esto refuerza que Azotea Salcaja necesita una pagina propia de menu, no solo imagenes o links a redes.

Google Search Central recomienda usar datos estructurados `LocalBusiness` con subtipo especifico como `Restaurant`, incluyendo direccion, coordenadas, URL de menu, horarios, telefono, URL, rango de precios y tipo de cocina cuando aplique. Esto favorece buscabilidad local y resultados enriquecidos.

Square y Toast muestran patrones actuales de gestion de menus: categorias, productos, disponibilidad, imagenes, precios y edicion desde un panel. Aunque sus plataformas suelen estar orientadas a POS y pedidos, sus flujos validan una estructura de catalogo por categorias que puede empezar sin carrito y evolucionar despues.

### Torneos de ajedrez

FIDE C.04.1, vigente desde el 1 de febrero de 2026, establece reglas base del sistema suizo: numero de rondas declarado antes, no repetir enfrentamientos, bye cuando hay participantes impares, emparejar preferentemente por misma puntuacion, balancear colores y mantener reglas transparentes que el arbitro pueda explicar.

FIDE C.04.2 establece que los sistemas de pareo para torneos FIDE deben ser objetivos, imparciales y reproducibles. Para Azotea Salcaja, que tendra torneos principalmente locales/casuales, la meta del MVP no debe ser certificacion FIDE, sino un sistema explicable, consistente y usable. Aun asi, las reglas FIDE deben guiar el diseno.

FIDE C.07 regula desempates como lista ordenada y configurable. La version publica detallada consultada fue la C.07 efectiva desde agosto de 2024, y FIDE publico en marzo de 2026 que C.07 fue actualizada desde el 1 de marzo de 2026 con mejoras en Buchholz, desempates adicionales y tratamiento de partidas no jugadas. Decision: implementar desempates de forma modular y documentada, con una bandera de "modo casual" y una futura revision si se desea compatibilidad formal con FIDE 2026.

Plataformas actuales como ChessManager, PawnArena, Vega, Swiss-Manager y ChessPairing validan los patrones clave: creacion guiada, administracion desde telefono, pareos automaticos, standings en tiempo real, links publicos, tiebreaks configurables, registros de resultados, exportacion o publicacion y soporte para sistemas suizo y round robin.

## 4. Fuentes consultadas

- Google Business Profile Guidelines: https://support.google.com/business/answer/3038177
- Google Search Central, LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Square, create and update menus: https://square.site/help/us/en/article/6424-create-menus-with-square-for-restaurants
- Toast, optimize Toast websites: https://support.toasttab.com/en/article/Optimize-Toast-Websites
- FIDE C.04.1 Basic Rules for Swiss Systems, effective from 2026-02-01: https://handbook.fide.com/chapter/C0401202507
- FIDE C.04.2 General Handling Rules for Swiss Tournaments, effective from 2026-02-01: https://handbook.fide.com/chapter/GeneralHandlingRulesForSwissTournaments202602
- FIDE C.07 Tie-Break Regulations, effective from 2024-08-01: https://handbook.fide.com/chapter/TieBreakRegulations082024
- FIDE notice on updated Play-Off and Tie-Break Regulations, effective from 2026-03-01: https://www.fide.com/fide-reminds-organizers-and-arbiters-of-updated-play-off-and-tie-break-regulations-effective-march-1-2026/
- Swiss-Manager overview on Chess.com: https://www.chess.com/article/view/swiss-manager
- Swiss-Manager manual: https://swiss-manager.at/unload/swissmanagerhelp_eng.pdf
- Vega Chess tournament software: https://www.vegachess.com/v/
- ChessManager: https://www.chessmanager.com/
- PawnArena: https://pawnarena.com/seo/en
- Supabase Storage access control: https://supabase.com/docs/guides/storage/security/access-control
- Next.js authentication guide: https://nextjs.org/docs/app/guides/authentication
- Prisma with Next.js and Vercel: https://docs.prisma.io/docs/guides/frameworks/nextjs
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

## 5. Buenas practicas encontradas

### Restaurante

- El menu debe ser HTML administrable, no solo PDF o imagen.
- Cada producto debe tener nombre, precio, categoria, descripcion corta, foto opcional, disponibilidad y bandera de destacado.
- La home debe priorizar decision rapida: que es, que venden, donde estan, cuando abren y como contactar.
- WhatsApp debe estar visible como accion primaria, especialmente en mobile.
- Horarios, direccion y telefono deben coincidir con Google Business Profile.
- La ubicacion debe mostrarse con mapa/enlace a Google Maps y texto legible.
- Los eventos deben vivir como contenido propio, con fecha, hora, descripcion, fotos y estado.
- El ajedrez debe presentarse como actividad de comunidad: "Lunes de ajedrez", no como producto principal.

### Ajedrez

- Las rondas deben declararse antes de iniciar.
- El sistema no debe repetir enfrentamientos en suizo.
- Los byes deben registrarse como resultado especial.
- La siguiente ronda no debe generarse hasta resolver resultados requeridos.
- La correccion manual debe existir, pero con bitacora.
- Los desempates deben ser configurables por torneo y recalculables.
- La experiencia movil debe permitir crear torneo, agregar jugadores y registrar resultados con pocos pasos.
- Debe haber separacion visual y funcional entre torneos oficiales y casuales.

## 6. Alcance del MVP

### Incluido

- Web publica: home, menu, contacto, eventos y ajedrez.
- Catalogo digital por categorias con precios, fotos, descripcion y destacados.
- Boton WhatsApp, ubicacion, horarios y redes.
- Admin restaurante: CRUD de productos, categorias, eventos, info del restaurante y fotos.
- Admin ajedrez: torneos oficiales, jugadores, rondas, partidas, resultados y standings.
- Torneos oficiales publicables con slug publico.
- Torneos casuales sin login con link privado.
- Sistema suizo inicial y round robin.
- Byes, ausencias, retiros, resultados editables.
- Desempates MVP: puntos, progresivo, Buchholz, Buchholz Cut 1, Median Buchholz, Sonneborn-Berger, resultado directo, victorias y victorias con negras.

### No incluido en MVP

- Carrito, pagos, delivery o reservas.
- Integracion POS.
- Certificacion FIDE del motor.
- Exportacion TRF/FIDE.
- Ratings oficiales.
- Cuentas publicas de jugadores.
- Chat, notificaciones push o transmisiones en vivo.

## 7. Alcance futuro

- Pedidos por WhatsApp con preseleccion de productos.
- Carrito sin pago en linea.
- Pagos en linea.
- Reservas de mesa.
- Cupones y promociones programadas.
- Galerias avanzadas de eventos.
- Torneos con inscripcion publica.
- Exportacion/importacion CSV.
- Exportacion PDF de pareos y standings.
- Modo arbitro con permisos parciales.
- Compatibilidad mas estricta con FIDE/JaVaFo o integracion con motor externo.

## 8. Arquitectura propuesta

Arquitectura recomendada: monolito modular con Next.js App Router.

Capas:

- `app`: rutas publicas, admin, API route handlers y layouts.
- `modules/restaurant`: dominio de productos, categorias, horarios, contacto y promociones.
- `modules/events`: eventos del restaurante y eventos de ajedrez publicados.
- `modules/chess`: dominio de torneos, pareos, resultados, standings y desempates.
- `modules/admin`: permisos, formularios admin y dashboards.
- `lib/db`: Prisma client y consultas compartidas.
- `lib/auth`: sesion, roles y proteccion de rutas.
- `lib/storage`: subida, transformacion y eliminacion de imagenes.
- `lib/validation`: schemas Zod.

Razonamiento:

- Un backend separado con Express no aporta suficiente valor en el MVP.
- Next.js permite SSR/SEO para restaurante y route handlers para mutaciones.
- La separacion real debe estar en modulos de dominio y servicios, no necesariamente en repositorios distintos.
- PostgreSQL permite modelar correctamente torneos y relaciones.

## 9. Stack recomendado

- Frontend: Next.js App Router, TypeScript, Tailwind CSS.
- Componentes UI: componentes propios ligeros, Radix UI para primitives si se necesita, lucide-react para iconos.
- Backend: Route Handlers de Next.js.
- ORM: Prisma.
- Base de datos: PostgreSQL en Supabase.
- Storage: Supabase Storage para imagenes.
- Auth admin: Supabase Auth o Auth.js con sesiones httpOnly. Recomendacion inicial: Supabase Auth si se usa Supabase como plataforma principal.
- Validacion: Zod.
- Testing: Vitest para logica, Playwright para flujos criticos, tests unitarios del motor de ajedrez.
- Deploy: Vercel + Supabase.

Decision Prisma vs Drizzle:

- Prisma es recomendado para este proyecto por velocidad de desarrollo, migraciones claras, esquema legible y buen soporte con Next.js/Vercel.
- Drizzle seria una buena alternativa si se prioriza SQL mas explicito y bundles minimos, pero el equipo ganaria menos velocidad inicial.

## 10. Diseno de modulos

### Modulo restaurante

Responsabilidades:

- Productos.
- Categorias.
- Precios.
- Fotos.
- Destacados.
- Promociones.
- Horarios.
- Contacto.
- Redes.
- Datos estructurados SEO.

Regla: el restaurante domina la home y navegacion primaria.

### Modulo eventos

Responsabilidades:

- Eventos gastronomicos.
- Actividades especiales.
- Lunes de ajedrez.
- Galeria simple.
- Estado: borrador, publicado, archivado.

### Modulo ajedrez

Responsabilidades:

- Torneos oficiales.
- Torneos casuales.
- Jugadores.
- Rondas.
- Partidas.
- Pareos.
- Resultados.
- Standings.
- Desempates.
- Publicacion.

Regla: el modulo de ajedrez no debe depender de productos/restaurante, salvo para presentar ubicacion y marca.

### Modulo admin

Responsabilidades:

- Autenticacion.
- Roles.
- Formularios.
- Subida de imagenes.
- Publicar/despublicar.
- Auditoria de cambios sensibles.

## 11. Modelo de base de datos propuesto

### Identidad y admin

`users`

- `id`
- `email`
- `name`
- `role`: `owner`, `admin`, `editor`
- `created_at`
- `updated_at`

`admin_audit_logs`

- `id`
- `user_id`
- `entity_type`
- `entity_id`
- `action`
- `before_json`
- `after_json`
- `created_at`

### Restaurante

`restaurant_profiles`

- `id`
- `name`
- `slug`
- `description`
- `address`
- `maps_url`
- `latitude`
- `longitude`
- `phone`
- `whatsapp_phone`
- `email`
- `instagram_url`
- `facebook_url`
- `tiktok_url`
- `price_range`
- `serves_cuisine`
- `hero_image_id`
- `created_at`
- `updated_at`

`business_hours`

- `id`
- `restaurant_id`
- `day_of_week`
- `opens_at`
- `closes_at`
- `is_closed`
- `note`

`menu_categories`

- `id`
- `restaurant_id`
- `name`
- `slug`
- `description`
- `sort_order`
- `is_active`

`products`

- `id`
- `category_id`
- `name`
- `slug`
- `description`
- `price_cents`
- `currency`
- `image_id`
- `is_featured`
- `is_available`
- `sort_order`
- `created_at`
- `updated_at`

`promotions`

- `id`
- `title`
- `description`
- `starts_at`
- `ends_at`
- `image_id`
- `is_published`

### Eventos e imagenes

`events`

- `id`
- `title`
- `slug`
- `type`: `restaurant`, `chess`, `community`
- `description`
- `starts_at`
- `ends_at`
- `location_label`
- `image_id`
- `status`: `draft`, `published`, `archived`
- `created_at`
- `updated_at`

`media_assets`

- `id`
- `bucket`
- `path`
- `public_url`
- `alt_text`
- `mime_type`
- `width`
- `height`
- `size_bytes`
- `created_by_user_id`
- `created_at`

### Ajedrez

`chess_tournaments`

- `id`
- `kind`: `official`, `private`
- `visibility`: `draft`, `published`, `unlisted`, `archived`
- `title`
- `slug`
- `description`
- `system`: `swiss`, `round_robin`
- `rounds_planned`
- `current_round_number`
- `status`: `setup`, `active`, `closed`, `cancelled`
- `starts_at`
- `location_label`
- `bye_points`
- `forfeit_win_points`
- `forfeit_loss_points`
- `draw_points`
- `win_points`
- `loss_points`
- `tie_break_order_json`
- `public_token_hash`
- `manage_token_hash`
- `created_by_user_id`
- `created_at`
- `updated_at`

`chess_players`

- `id`
- `tournament_id`
- `name`
- `rating`
- `seed`
- `photo_id`
- `status`: `active`, `withdrawn`, `absent`
- `withdrawn_after_round`
- `created_at`

`chess_rounds`

- `id`
- `tournament_id`
- `round_number`
- `status`: `pending`, `paired`, `in_progress`, `completed`, `locked`
- `generated_at`
- `locked_at`

`chess_games`

- `id`
- `tournament_id`
- `round_id`
- `board_number`
- `white_player_id`
- `black_player_id`
- `result`: `white_win`, `black_win`, `draw`, `white_forfeit`, `black_forfeit`, `double_forfeit`, `bye`, `unplayed`
- `white_score`
- `black_score`
- `is_bye`
- `is_forfeit`
- `reported_by_user_id`
- `reported_at`
- `updated_at`

`chess_standings_snapshots`

- `id`
- `tournament_id`
- `round_number`
- `standings_json`
- `created_at`

`chess_pairing_attempts`

- `id`
- `tournament_id`
- `round_number`
- `algorithm`
- `input_json`
- `output_json`
- `warnings_json`
- `created_at`

`private_tournament_sessions`

- `id`
- `tournament_id`
- `device_label`
- `manage_token_hash`
- `last_seen_at`
- `created_at`

## 12. Relaciones entre tablas

- Un restaurante tiene muchas categorias, horarios y productos.
- Un producto pertenece a una categoria y puede tener una imagen.
- Un evento puede tener una imagen principal y galeria futura.
- Un torneo tiene muchos jugadores, rondas, partidas y snapshots de standings.
- Una ronda tiene muchas partidas.
- Una partida referencia jugador blanco y jugador negro; para bye, uno puede ser `null` segun implementacion.
- Un torneo oficial puede tener `created_by_user_id`; un torneo privado puede no tener usuario.
- Los tokens de torneos privados nunca se guardan en texto plano, solo hash.

## 13. Flujo del panel administrador

### Admin restaurante

1. Login.
2. Dashboard con accesos: productos, categorias, eventos, informacion, horarios, promociones.
3. Productos:
   - Crear producto.
   - Editar nombre, descripcion, precio, categoria, disponibilidad, destacado y foto.
   - Desactivar antes que eliminar si ya fue publicado.
4. Categorias:
   - Ordenar categorias.
   - Activar/desactivar.
5. Restaurante:
   - Editar contacto, ubicacion, redes y horarios.
6. Eventos:
   - Crear evento.
   - Guardar borrador.
   - Publicar.
   - Archivar.

### Admin ajedrez

1. Lista de torneos oficiales.
2. Crear torneo.
3. Configurar datos base: titulo, fecha, sistema, rondas, desempates, puntuacion.
4. Agregar jugadores.
5. Generar ronda.
6. Registrar resultados.
7. Recalcular standings.
8. Publicar tabla y pareos.
9. Cerrar torneo.
10. Publicar ganadores, fotos y resumen.

## 14. Flujo de torneo oficial

1. Admin crea torneo en estado `setup`.
2. Admin agrega participantes y fotos opcionales.
3. Admin elige sistema: suizo o round robin.
4. Admin elige numero de rondas.
5. Admin elige desempates.
6. Admin genera ronda 1.
7. Sistema crea pareos y guarda intento de pareo.
8. Admin registra resultados.
9. Sistema recalcula tabla.
10. Admin genera siguiente ronda cuando la anterior esta completa.
11. Al finalizar, sistema calcula ganadores.
12. Admin cierra torneo.
13. Admin publica pagina publica con standings, rondas, galeria y resumen.

## 15. Flujo de torneo privado

1. Visitante entra a `/ajedrez/crear`.
2. Escribe nombre del torneo.
3. Agrega jugadores por lista rapida, uno por linea.
4. Elige sistema: suizo o todos contra todos.
5. Elige rondas: 3, 5, 7 u otro numero valido.
6. Elige configuracion simple de desempates.
7. Crea torneo.
8. Sistema genera:
   - Link de vista.
   - Link de administracion opcional.
9. Creador registra resultados desde telefono.
10. Standings se actualizan.
11. Torneo no aparece en home ni en listas oficiales.

Estrategia sin login:

- Guardar torneo privado en base de datos como `visibility = unlisted`.
- Crear `public_token` para vista y `manage_token` para editar.
- Guardar solo hashes en base de datos.
- Mostrar link de administracion una vez y guardar permiso en localStorage o cookie segura cuando sea posible.
- Permitir revocar/regenerar link en una fase futura.

## 16. Algoritmo de pareos propuesto

### Sistema suizo MVP

Objetivos:

- No repetir rivales.
- Emparejar por grupos de puntuacion.
- Manejar byes.
- Balancear colores razonablemente.
- Ser explicable y determinista.

Entrada:

- Lista de jugadores activos.
- Historial de partidas.
- Puntos actuales.
- Historial de colores.
- Ronda actual.
- Configuracion de puntuacion.

Proceso:

1. Excluir jugadores retirados.
2. Si hay numero impar, asignar bye:
   - Preferir jugador activo con menor puntuacion.
   - Evitar quien ya tuvo bye o victoria sin jugar equivalente a bye.
   - Usar seed como criterio final.
3. Agrupar jugadores por puntuacion descendente.
4. Dentro de cada grupo, ordenar por puntos, desempates parciales y seed.
5. Intentar parear primera mitad contra segunda mitad.
6. Si hay conflicto por enfrentamiento repetido, probar permutaciones locales.
7. Si el grupo no se resuelve, bajar jugador flotante al siguiente grupo.
8. Asignar colores:
   - Preferir color con menos partidas.
   - Evitar tres colores iguales consecutivos.
   - Evitar diferencia mayor a 2 cuando sea posible.
   - Si ambos prefieren el mismo color, resolver por mayor urgencia de color y luego seed.
9. Guardar pareos y advertencias.

Nota: este algoritmo es adecuado para torneos casuales/locales. Para torneos formales FIDE, se debe evaluar integrar JaVaFo o implementar el sistema Dutch completo con verificador.

### Round robin MVP

Usar metodo circular/Berger:

1. Si hay jugadores impares, agregar BYE fantasma.
2. Fijar un jugador y rotar los demas.
3. Generar `n - 1` rondas si el numero es par; `n` rondas si se agrego BYE.
4. Alternar colores por ronda y ajustar para balance.
5. Para doble round robin futuro, repetir calendario invirtiendo colores.

## 17. Algoritmos de desempate propuestos

Arquitectura:

- Cada desempate implementa una interfaz comun:

```ts
type TieBreakCode =
  | "points"
  | "progressive"
  | "buchholz"
  | "median_buchholz"
  | "buchholz_cut_1"
  | "sonneborn_berger"
  | "direct_encounter"
  | "wins"
  | "black_wins"
  | "manual";
```

Cada calculador recibe:

- torneo,
- jugadores,
- partidas,
- standings base,
- configuracion de puntuacion,
- politica de partidas no jugadas.

### Puntos

Suma de puntos de cada jugador:

- Victoria: 1.
- Tablas: 0.5.
- Derrota: 0.
- Bye: configurable, normalmente 1.
- Incomparecencia: configurable.

### Progresivo / acumulativo

Suma de la puntuacion acumulada despues de cada ronda.

Ejemplo: si un jugador tiene acumulados 1, 1.5, 2.5 y 3.5, su progresivo es 8.5.

### Buchholz

Suma de los puntos finales de los rivales enfrentados. Mide fuerza de oposicion.

Decision de diseno: parametrizar tratamiento de byes, ausencias y partidas no jugadas, porque FIDE ha ajustado estos criterios y los torneos casuales pueden preferir reglas simples.

### Medio Buchholz / Median Buchholz

Ordena las puntuaciones de rivales, elimina la mas alta y la mas baja, y suma las restantes. Si hay pocos rivales, se debe definir minimo de rondas para aplicarlo o caer a Buchholz normal.

### Buchholz Cut 1

Suma Buchholz excluyendo el rival con menor puntuacion.

### Sonneborn-Berger

Suma:

- Puntos finales del rival derrotado.
- Mitad de puntos finales del rival con quien se empato.
- Cero por derrota.

Es especialmente util en round robin, aunque tambien puede aplicarse en suizo si la configuracion lo permite.

### Resultado directo

Si todos los jugadores empatados jugaron entre si de forma suficiente, ordenar por puntos obtenidos entre ellos. Si no aplica, continuar con el siguiente desempate.

### Mayor numero de victorias

Cuenta partidas ganadas. Se debe decidir si cuenta victoria por bye o forfeit; recomendacion MVP: victorias jugadas por tablero primero, y forfeit como configurable.

### Mayor numero de victorias con negras

Cuenta victorias con piezas negras. No cuenta byes.

### Manual / sorteo

Ultimo recurso. Debe exigir accion admin y guardar auditoria.

### Ordenes recomendados

Casual:

1. Puntos.
2. Progresivo.
3. Buchholz.
4. Median Buchholz.
5. Victorias.

Formal local:

1. Puntos.
2. Buchholz Cut 1.
3. Buchholz.
4. Sonneborn-Berger.
5. Resultado directo.
6. Victorias.
7. Victorias con negras.
8. Manual.

## 18. Rutas frontend

Publicas:

- `/`
- `/menu`
- `/menu/[categoria]`
- `/contacto`
- `/eventos`
- `/eventos/[slug]`
- `/ajedrez`
- `/ajedrez/torneos`
- `/ajedrez/torneos/[slug]`
- `/ajedrez/crear`
- `/ajedrez/privado/[token]`
- `/ajedrez/privado/[token]/admin`

Admin:

- `/admin`
- `/admin/login`
- `/admin/productos`
- `/admin/productos/nuevo`
- `/admin/productos/[id]`
- `/admin/categorias`
- `/admin/eventos`
- `/admin/eventos/[id]`
- `/admin/restaurante`
- `/admin/ajedrez/torneos`
- `/admin/ajedrez/torneos/nuevo`
- `/admin/ajedrez/torneos/[id]`
- `/admin/ajedrez/torneos/[id]/jugadores`
- `/admin/ajedrez/torneos/[id]/rondas`
- `/admin/ajedrez/torneos/[id]/resultados`
- `/admin/ajedrez/torneos/[id]/publicacion`

## 19. Rutas backend/API

Restaurante:

- `GET /api/menu`
- `POST /api/admin/products`
- `PATCH /api/admin/products/[id]`
- `DELETE /api/admin/products/[id]`
- `POST /api/admin/categories`
- `PATCH /api/admin/categories/[id]`
- `PATCH /api/admin/restaurant-profile`
- `PATCH /api/admin/business-hours`

Eventos:

- `GET /api/events`
- `POST /api/admin/events`
- `PATCH /api/admin/events/[id]`
- `POST /api/admin/events/[id]/publish`
- `POST /api/admin/events/[id]/archive`

Ajedrez:

- `POST /api/admin/chess/tournaments`
- `PATCH /api/admin/chess/tournaments/[id]`
- `POST /api/admin/chess/tournaments/[id]/players`
- `PATCH /api/admin/chess/players/[id]`
- `POST /api/admin/chess/tournaments/[id]/generate-round`
- `POST /api/admin/chess/games/[id]/result`
- `POST /api/admin/chess/tournaments/[id]/recalculate`
- `POST /api/admin/chess/tournaments/[id]/publish`
- `POST /api/admin/chess/tournaments/[id]/close`
- `POST /api/chess/private`
- `GET /api/chess/private/[token]`
- `POST /api/chess/private/[token]/players`
- `POST /api/chess/private/[token]/generate-round`
- `POST /api/chess/private/[token]/games/[gameId]/result`

Imagenes:

- `POST /api/admin/media/sign-upload`
- `POST /api/admin/media/confirm`
- `DELETE /api/admin/media/[id]`

## 20. Servicios internos

`restaurantService`

- Obtener menu publico.
- Crear/editar productos.
- Ordenar categorias.
- Generar JSON-LD de restaurante.

`eventService`

- Publicar eventos.
- Filtrar eventos futuros.
- Archivar eventos pasados.

`chessTournamentService`

- Crear torneo.
- Cambiar estado.
- Validar transiciones.

`pairingService`

- Generar suizo.
- Generar round robin.
- Asignar byes.
- Asignar colores.

`resultService`

- Registrar resultado.
- Editar resultado.
- Validar que la ronda permita cambios.

`standingService`

- Calcular puntos.
- Aplicar desempates en orden.
- Crear snapshot.

`tieBreakRegistry`

- Registrar calculadores.
- Permitir agregar desempates nuevos sin tocar UI ni modelo central.

`mediaService`

- Crear signed upload URLs.
- Guardar metadata.
- Validar tipo y tamano.

## 21. Separacion entre restaurante y ajedrez

Separacion recomendada:

- Dominios separados en carpetas y servicios.
- Tablas de ajedrez prefijadas con `chess_`.
- Rutas publicas separadas bajo `/ajedrez`.
- Admin separado bajo `/admin/ajedrez`.
- Eventos de ajedrez pueden aparecer en `events`, pero el motor de torneos vive en `chess_*`.
- Home del restaurante puede mostrar un bloque pequeno: "Lunes de ajedrez", proximo torneo o actividad.

Regla de producto: el ajedrez atrae comunidad; el restaurante convierte visitas.

## 22. Estrategia de autenticacion para administrador

Recomendacion:

- Supabase Auth con email/password para admin.
- Tabla `users` o `admin_profiles` para rol interno.
- Proteger rutas admin en servidor.
- Validar permisos tambien en API/DAL, no solo en middleware.
- Cookies seguras, httpOnly y sameSite.
- Reautenticacion para acciones sensibles futuras: cambiar email/password o borrar contenido masivo.
- Auditoria para cambios de resultados, publicaciones y eliminaciones.

## 23. Estrategia para torneos privados sin login

- Crear torneos privados con tokens criptograficamente fuertes.
- Separar link de vista y link de administracion.
- Guardar hashes, no tokens planos.
- No indexar con `noindex`.
- No mostrar en listados oficiales.
- Rate limit para creacion y mutaciones.
- Permitir continuar desde mismo dispositivo guardando referencia local.
- Mostrar claramente que es "Torneo casual/no oficial".

## 24. Estrategia para links compartibles

Torneos oficiales:

- URL publica por slug: `/ajedrez/torneos/[slug]`.
- Solo si `visibility = published`.
- Compartible en WhatsApp/Facebook con metadata Open Graph.

Torneos privados:

- URL no listada por token: `/ajedrez/privado/[token]`.
- Admin link separado: `/ajedrez/privado/[token]/admin?key=...` o flujo equivalente.
- `noindex`, sin aparicion en sitemap.
- Aviso visual: "Privado casual".

## 25. Estrategia para imagenes

- Supabase Storage con buckets:
  - `public-restaurant`
  - `public-events`
  - `public-chess`
  - `private-temp`
- Validar MIME, extension y peso.
- Generar versiones optimizadas desde Next Image cuando aplique.
- Guardar alt text obligatorio para imagenes principales.
- Usar nombres con UUID, no nombres originales.
- Borrado logico en DB antes de borrar fisicamente si hay referencias.

## 26. Estrategia de seguridad

- Validacion con Zod en cada mutacion.
- Autorizacion en DAL/API.
- Rate limit en endpoints publicos de torneos privados.
- CSRF protection si se usan cookies para mutaciones.
- Sesiones seguras con cookies httpOnly.
- Sanitizar texto enriquecido o evitar HTML libre en MVP.
- Usar `noindex` en torneos privados.
- Tokens largos, aleatorios y hasheados.
- Logs de auditoria para admin.
- Politicas RLS en Supabase Storage.
- Variables de entorno separadas por ambiente.
- No exponer service role key al cliente.

## 27. Estrategia de validaciones

Restaurante:

- Precio no negativo.
- Moneda por defecto GTQ.
- Producto requiere categoria activa.
- Slug unico.
- Imagen valida.
- Horarios con apertura/cierre coherentes.

Ajedrez:

- No iniciar torneo sin minimo de jugadores.
- Suizo requiere rondas >= 1.
- Round robin no debe permitir rondas mayores al calendario generado, salvo doble vuelta futura.
- No generar ronda si la anterior tiene resultados pendientes.
- No repetir rivales en suizo.
- Un jugador no puede recibir mas de un bye asignado por pareo.
- Resultado debe coincidir con jugadores de la partida.
- No permitir editar ronda bloqueada sin permiso admin.

## 28. Estrategia responsive/mobile-first

Publico restaurante:

- Home con acciones visibles: Menu, WhatsApp, Como llegar.
- Menu con categorias horizontales o sticky tabs en mobile.
- Productos en lista escaneable, no tarjetas enormes.
- Fotos optimizadas y no obligatorias para cada producto.
- Contacto y horarios faciles de leer.

Ajedrez:

- Crear torneo con flujo paso a paso.
- Entrada de jugadores por textarea rapido.
- Registro de resultado por botones grandes: 1-0, 1/2-1/2, 0-1, forfeit.
- Standings compactos con columnas esenciales.
- Pareos por ronda en lista clara.

Admin:

- Navegacion por modulos.
- Tablas responsivas con acciones visibles.
- Formularios cortos, secciones plegables cuando crezca.
- Estados claros: borrador, publicado, activo, cerrado.

## 29. Estrategia de testing

Unit tests:

- Calculo de puntos.
- Buchholz.
- Median Buchholz.
- Buchholz Cut 1.
- Sonneborn-Berger.
- Resultado directo.
- Swiss pairing sin repetidos.
- Bye unico.
- Balance de colores basico.
- Round robin con pares e impares.

Integration tests:

- Crear producto.
- Publicar evento.
- Crear torneo oficial.
- Generar ronda.
- Registrar resultados.
- Recalcular standings.
- Crear torneo privado y acceder por link.

E2E:

- Cliente ve menu y contacta por WhatsApp.
- Admin crea producto y aparece en menu.
- Admin crea torneo oficial y publica tabla.
- Visitante crea torneo casual desde telefono.

## 30. Estrategia de despliegue

Ambientes:

- Local.
- Preview en Vercel por branch.
- Produccion en Vercel.

Servicios:

- Vercel para Next.js.
- Supabase para PostgreSQL, Auth y Storage.

Variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET` o equivalente si se usa Auth.js
- `APP_URL`

Deploy:

1. Crear proyecto Supabase.
2. Configurar Storage buckets.
3. Ejecutar migraciones Prisma.
4. Configurar Vercel env vars.
5. Deploy preview.
6. Smoke test.
7. Deploy produccion.

## 31. Fases de desarrollo

### Fase 0: Investigacion y diseno tecnico

Entregable: este documento. Sin codigo de aplicacion.

### Fase 1: Setup del proyecto

Crear Next.js, TypeScript, Tailwind, Prisma, estructura modular, linting, estilos base y layout.

### Fase 2: Web publica del restaurante

Home, menu, contacto, horarios, ubicacion, eventos publicos y base visual mobile-first.

### Fase 3: Panel administrador del restaurante

Auth admin, CRUD de productos, categorias, horarios, contacto, eventos, promociones e imagenes.

### Fase 4: Base del modulo de ajedrez

Modelos, pantallas base, torneos, jugadores, rondas, partidas y resultados.

### Fase 5: Pareos y resultados

Suizo MVP, round robin, byes, ausencias, retiros, registro de resultados y standings base.

### Fase 6: Desempates

Implementar registry de desempates y calculadores: progresivo, Buchholz, Median, Cut 1, Sonneborn-Berger, directo, victorias y negras.

### Fase 7: Torneos publicos oficiales

Publicacion de torneos, tabla publica, ganadores, fotos, historial de rondas y Open Graph.

### Fase 8: Torneos privados/casuales

Crear torneo rapido, links compartibles, permisos por token, noindex y experiencia movil.

### Fase 9: Testing, seguridad y pulido

Validaciones, edge cases, permisos, responsive, auditoria, pruebas unitarias/E2E.

### Fase 10: Deploy y documentacion

Produccion, variables, guia admin, guia de torneos y checklist operativo.

Justificacion: mantiene el restaurante funcional antes de profundizar en ajedrez, pero disena la base de datos del ajedrez temprano para evitar rehacer modelos.

## 32. Riesgos tecnicos

- Implementar un sistema suizo completo estilo FIDE es mas complejo de lo que parece.
- Desempates con partidas no jugadas tienen detalles normativos que pueden cambiar.
- Torneos privados sin login requieren buen manejo de tokens para evitar ediciones no deseadas.
- Imagenes pueden crecer en costo si no se limita peso y dimensiones.
- Admin mobile puede volverse incomodo si se replica una tabla de escritorio.
- Mezclar restaurante y ajedrez sin jerarquia clara puede diluir la marca.
- Usar service role de Supabase incorrectamente puede exponer datos.
- El proyecto puede crecer hacia e-commerce; conviene no bloquear esa evolucion con modelos demasiado rigidos.

## 33. Decisiones pendientes

- Nombre visual exacto de la marca: "Azotea Salcaja" o "Azotea Salcaja" con tilde en Salcaja segun identidad oficial.
- Moneda y formato final: GTQ, simbolo Q.
- Direccion exacta, coordenadas y links oficiales.
- Horarios reales.
- Telefono y WhatsApp oficial.
- Redes sociales.
- Categorias iniciales del menu.
- Si el admin sera una sola persona o varios roles.
- Si los torneos privados deben expirar automaticamente.
- Si el link de administracion privado puede ser compartido con todos o solo con organizador.
- Si se necesita exportar PDF/CSV desde MVP.
- Si los torneos oficiales deben permitir inscripcion publica.

## 34. Preguntas antes de construir

1. Cual es el nombre exacto de marca que debe verse en la web?
2. Cual es la direccion exacta y link de Google Maps?
3. Cuales son horarios reales por dia?
4. Cual es el numero de WhatsApp?
5. Que categorias de productos tendra el menu inicial?
6. Hay fotos existentes o debemos preparar placeholders temporales?
7. Los precios cambiaran frecuentemente?
8. Cuantos administradores usaran el panel?
9. Los torneos oficiales deben mostrar fotos de todos los jugadores o solo ganadores/evento?
10. En torneos casuales, cualquier persona con link de admin puede editar resultados?
11. Deben expirar los torneos casuales despues de cierto tiempo?
12. El restaurante quiere que el "Lunes de ajedrez" aparezca siempre en home?

## 35. Recomendacion final

Recomiendo construir primero un sitio de restaurante solido, rapido y administrable, con una seccion de ajedrez presentada como comunidad del restaurante. Tecnologicamente, Next.js + Prisma + Supabase + Vercel es una opcion correcta para el MVP porque reduce infraestructura y permite evolucionar.

Para ajedrez, recomiendo no prometer compatibilidad FIDE oficial en el MVP. Si se necesita un torneo formal en el futuro, se puede integrar un motor certificado o ajustar el algoritmo contra reglas FIDE completas. Para el uso real descrito - torneos de lunes por la noche, desde telefono, con rondas configurables y resultados rapidos - un motor suizo explicable, probado y auditable es la mejor primera version.

El siguiente paso, despues de aprobar este documento, seria iniciar la Fase 1 con el setup del proyecto en esta misma carpeta.
