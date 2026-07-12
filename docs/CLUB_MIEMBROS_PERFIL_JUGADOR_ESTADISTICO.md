# Perfil estadístico del jugador

## Intención

Convertir cada perfil público del club en una página viva de evolución: no solo una foto y datos básicos, sino una historia deportiva que muestre cómo el jugador progresa, participa y se consolida dentro de Chessitos.

La inspiración viene de patrones visibles en plataformas como Lichess y Chess.com: identidad del jugador, rating actual, actividad, juegos/torneos, estadísticas y señales de recorrido. La adaptación para este proyecto debe ser más cuidadosa porque el club trabaja con niños y jóvenes; el perfil debe motivar sin exponer información sensible.

## Estado actual del proyecto

Ya existe la ruta pública:

- `/ajedrez/club/jugadores/[slug]`

Hoy muestra:

- foto o iniciales;
- nombre público;
- categoría;
- año de ingreso;
- ELO actual;
- torneos jugados;
- primeros lugares;
- puntos históricos;
- QR/kit de pertenencia cuando aplica.

También existen bases importantes para elevar el perfil:

- los torneos guardan `clubPlayerId` cuando el participante viene del roster del club;
- las tablas de posiciones ya llevan `photoUrl` y `clubPlayerId`;
- el ranking del club se deriva de torneos finalizados y marcados como `clubRanked`;
- el ELO actual ya se recalcula desde partidas reales, no desde un campo manual aislado;
- la visibilidad pública ya distingue entre perfil privado, iniciales y perfil público.

Eso significa que el perfil avanzado puede construirse sin inventar una segunda base de estadísticas. El torneo sigue siendo la fuente de verdad.

## Principios de diseño

1. La cara del jugador debe ser una puerta de entrada, no decoración.
   Donde la foto o avatar del jugador aparezca públicamente, debe poder llevar al perfil cuando ese perfil esté autorizado.

2. La privacidad manda.
   Si el jugador está privado, no se enlaza. Si está como iniciales, se puede enlazar al perfil protegido solo si el club decide que ese modo representa autorización pública limitada. La fecha de nacimiento nunca se publica.

3. El perfil debe contar progreso, no solo ranking.
   Un niño que no está en primer lugar también debe poder ver señales positivas: más partidas, más constancia, mejor ELO personal, mejor posición, rachas y objetivos alcanzables.

4. La versión móvil es prioritaria.
   El perfil debe leerse bien desde teléfono: tarjetas compactas, gráfica simple, historial bajo demanda y botones grandes.

5. El header no se sobrecarga.
   La navegación hacia perfiles debe suceder desde los lugares naturales: avatar, nombre en ranking, tabla de torneo, directorio de miembros y tarjetas destacadas.

## Qué debe mostrar el perfil

### 1. Encabezado del jugador

Debe contener:

- foto autorizada o iniciales;
- nombre público;
- categoría actual automática: Sub 10, Sub 12, Sub 14, Sub 16, Sub 18 o Libre;
- miembro desde;
- ELO actual;
- estado de actividad: activo, reciente o sin actividad reciente.

El encabezado debe sentirse como “tarjeta deportiva” del club.

### 2. Resumen competitivo

Tarjetas principales:

- ELO actual;
- cambio de ELO desde el inicio;
- mejor ELO alcanzado;
- partidas valoradas;
- torneos jugados;
- primeros lugares;
- puntos históricos del circuito;
- última participación.

### 3. Evolución de ELO

Gráfica sencilla y accesible:

- línea de ELO por torneo o por ronda;
- punto inicial;
- punto actual;
- mejor punto;
- caída/subida reciente.

Para accesibilidad, la gráfica debe tener también una tabla resumida debajo o un texto alternativo tipo:

“Empezó en 1200, llegó a 1264 en el Torneo 003 y actualmente está en 1242.”

### 4. Historial de torneos

Lista cronológica con:

- torneo;
- fecha;
- posición;
- puntos obtenidos;
- partidas: ganadas, tablas, perdidas;
- cambio de ELO en ese torneo;
- enlace al torneo público si está publicado.

En móvil, cada torneo puede ser una tarjeta expandible.

### 5. Últimas partidas

Cuando los datos estén disponibles:

- ronda;
- rival público o “Rival del torneo” si no debe exponerse el nombre;
- color;
- resultado;
- cambio estimado de ELO;
- torneo relacionado.

Esta sección debe ser configurable porque publicar rivales de menores puede requerir más cuidado.

### 6. Fortalezas y trayectoria

Bloques motivacionales:

- mejor racha de participación;
- mejor posición histórica;
- mejor torneo;
- mayor subida de ELO en un torneo;
- constancia: participación en los últimos 30, 90 y 365 días;
- objetivo siguiente.

Ejemplos de objetivo:

- “Jugar 3 torneos para activar historial completo.”
- “Faltan 2 partidas valoradas para llegar a 10.”
- “Está a 18 puntos de superar su mejor ELO.”
- “Un torneo más para completar la racha del mes.”

## Dónde debe ser clickeable la foto/avatar

### Directorio de miembros

Ya existe como lugar natural. La tarjeta completa puede seguir enlazando, pero la foto debe reforzar la acción.

### Ranking del club

En las listas de ELO, circuito anual e histórico, el avatar y/o nombre deben enlazar al perfil público si existe.

### Página pública de torneo

Donde aparece el podio o tabla de posiciones, el avatar debe enlazar si:

- el jugador tiene `clubPlayerId`;
- ese `clubPlayerId` corresponde a un perfil público o iniciales permitido;
- el torneo es público o publicado;
- la visibilidad del jugador permite mostrarlo.

Si no cumple, se muestra igual como avatar normal sin enlace.

### Vista live de torneo

La vista en vivo debe ser más conservadora:

- puede enlazar únicamente cuando el torneo sea público y el perfil esté autorizado;
- si es una pantalla para sala/proyección, el enlace no debe estorbar;
- en móvil sí puede ser útil tocar el jugador para abrir perfil.

### Tarjetas destacadas o ganadores

Si el home del club, agenda o resumen del torneo muestra campeones, podios o miembros destacados, el avatar debe usar la misma regla de enlace.

## Componente recomendado

Crear un componente reutilizable:

`ClubPlayerAvatarLink`

Responsabilidad:

- recibir nombre, foto, tamaño, `clubPlayerId` o slug público;
- decidir si renderiza enlace o avatar estático;
- usar texto accesible: “Ver perfil de [nombre público]”;
- respetar foto pública, iniciales y perfil privado;
- evitar duplicar reglas en cada tabla.

Esto evita que cada página implemente su propia lógica de privacidad.

## Motor de estadísticas recomendado

Crear una capa de dominio:

`getPublicClubMemberProfileStats(slug)`

Debe devolver:

- datos públicos del jugador;
- resumen actual;
- serie de ELO;
- historial de torneos;
- últimas partidas publicables;
- marcas personales;
- objetivo sugerido;
- permisos de visibilidad.

La lógica base puede vivir junto al ranking:

- `computeClubRanking` sigue resolviendo la tabla actual;
- un nuevo cálculo, por ejemplo `computeClubPlayerProgress`, reconstruye la evolución paso a paso.

No se debe guardar una tabla paralela de ELO histórico al inicio. Primero se deriva todo desde torneos. Si después hay muchos torneos y se vuelve lento, se evalúa una caché.

## Fases de implementación

### Fase 1: Datos de perfil avanzado

Objetivo: tener el motor de estadísticas sin cambiar todavía la UI grande.

Entregables:

- función de progreso por jugador;
- serie de ELO;
- historial por torneo;
- métricas de mejores marcas;
- pruebas con 0, 1 y varios torneos;
- confirmación de que el ELO actual coincide con el ranking.

### Fase 2: Perfil visual tipo “historia deportiva”

Objetivo: transformar `/ajedrez/club/jugadores/[slug]` en una página más valiosa.

Entregables:

- encabezado mejorado;
- tarjetas de resumen;
- gráfica de evolución;
- historial de torneos;
- estado vacío para jugadores nuevos;
- versión móvil cuidada.

### Fase 3: Avatares clickeables en club

Objetivo: que el ranking y directorio conecten naturalmente con el perfil.

Entregables:

- componente `ClubPlayerAvatarLink`;
- integración en ranking ELO;
- integración en circuito anual;
- integración en histórico;
- integración en directorio si conviene centralizarlo.

### Fase 4: Avatares clickeables en torneos

Objetivo: que desde torneos públicos se pueda llegar al perfil del jugador.

Entregables:

- resolver slug público desde `clubPlayerId`;
- integrar en tabla de posiciones;
- integrar en podio/destacados;
- revisar vista live;
- asegurar que invitados y perfiles privados no enlacen.

### Fase 5: Refinamiento motivacional

Objetivo: que el perfil no sea solo estadística fría.

Entregables:

- objetivos automáticos;
- logros suaves;
- mejores marcas;
- mensajes de progreso;
- filtros de historial;
- posible Open Graph del perfil para compartir.

## Reglas de privacidad

- Perfil privado: no aparece en directorio y no se enlaza desde torneos/rankings.
- Perfil con iniciales: muestra identidad protegida; decidir antes de implementación si también se permite enlace desde avatar.
- Perfil público: puede mostrar nombre público, foto si `showPhoto` está activo, estadísticas si `showStats` está activo.
- Fecha de nacimiento: nunca se muestra.
- Categoría: se muestra calculada automáticamente.
- Rivales: solo se muestran si el torneo y ambos perfiles son publicables; si no, usar texto neutral.
- Objetivos: no deben avergonzar; deben formularse como siguiente paso positivo.

## Criterios de aceptación

- El ELO del perfil coincide con el ranking del club.
- Corregir un resultado de torneo actualiza el perfil sin duplicar estadísticas.
- La foto/avatar enlaza únicamente cuando hay perfil público permitido.
- Un jugador privado no queda descubrible por slug ni por links desde tablas.
- La página se lee bien en móvil sin tablas enormes obligatorias.
- La gráfica tiene alternativa accesible en texto o tabla.
- Jugadores nuevos tienen una experiencia digna aunque no tengan historial.
- Invitados de torneo nunca reciben perfil accidental.

## Preguntas antes de implementar

1. ¿El modo “iniciales” debe tener página pública clickeable o solo aparecer en directorio de forma limitada?
2. ¿Mostramos rivales en últimas partidas o solo resultados agregados?
3. ¿La evolución de ELO debe ser por torneo terminado o por ronda/partida?
4. ¿Queremos que el perfil pueda compartirse en redes con imagen automática?
5. ¿Los perfiles de menores deben poder indexarse en Google cuando `allowSharing` esté activo, o preferimos mantenerlos no indexables aunque sean compartibles por enlace?

## Recomendación inicial

Empezar con evolución por torneo, no por partida. Es más simple, más legible para padres y jugadores, y reduce el riesgo de sobrecargar el perfil. Después se puede abrir una vista más detallada con partidas si el club lo necesita.

También recomiendo que los avatares sean clickeables primero en el ranking del club y el directorio. Luego se integra en torneos públicos, porque ahí la privacidad y los invitados requieren más cuidado.

## Referencias de producto

- Lichess usa perfiles con ratings por modalidad, actividad, juegos y datos de cuenta: https://lichess.org/@/DrNykterstein
- Chess.com organiza el perfil con identidad, fecha de ingreso, comunidad y secciones como Overview, Games, Stats, Friends, Awards y Clubs: https://www.chess.com/member/Hikaru
