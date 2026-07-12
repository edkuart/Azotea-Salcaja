# Guia de administracion

Esta guia describe el flujo operativo del panel admin del MVP.

## Acceso

Ruta principal:

```bash
/admin
```

Ruta de login preparada:

```bash
/admin/login
```

En el MVP actual el panel es una interfaz funcional de producto, pero la autenticacion real queda como tarea de produccion antes de publicar datos editables.

## Restaurante

Rutas:

- `/admin/productos`
- `/admin/productos/nuevo`
- `/admin/productos/[id]`
- `/admin/categorias`
- `/admin/eventos`
- `/admin/restaurante`

Operaciones previstas:

- Crear y editar productos.
- Activar/desactivar productos.
- Cambiar precio, categoria, descripcion e imagen.
- Marcar productos destacados.
- Administrar categorias.
- Crear eventos y promociones.
- En eventos, completar nombre del lugar, direccion visible y link de Google Maps para que el público pueda llegar.
- Editar horarios, contacto, ubicacion y redes sociales.

## Ajedrez oficial

Rutas:

- `/admin/ajedrez/torneos`
- `/admin/ajedrez/torneos/nuevo`
- `/admin/ajedrez/torneos/[id]`
- `/admin/ajedrez/torneos/[id]/publicacion`
- `/admin/ajedrez/jugadores`

Flujo recomendado:

1. Crear torneo oficial.
2. Definir sistema: suizo o round robin.
3. Definir rondas planificadas.
4. Registrar jugadores.
5. Elegir orden de desempates.
6. Generar primera ronda.
7. Registrar resultados.
8. Recalcular standings.
9. Generar rondas siguientes cuando los resultados necesarios esten listos.
10. Publicar tabla, galeria, resumen y ganadores.
11. Cerrar torneo.

### Jugadores y perfiles publicos

El roster del club vive en `/admin/ajedrez/jugadores`.

Uso recomendado para un piloto seguro:

1. Elegir 2 o 3 miembros con consentimiento confirmado.
2. Editar su ficha.
3. Completar nombre publico o alias y revisar la fecha de ingreso.
4. La categoria se calcula sola desde la fecha de nacimiento: Sub 10, Sub 12, Sub 14, Sub 16, Sub 18 o Libre.
5. Registrar fecha de autorizacion si se desea dejar trazabilidad.
6. Elegir visibilidad:
   - `Privado`: no aparece en el directorio.
   - `Iniciales`: aparece con identidad protegida.
   - `Publico`: aparece con nombre publico autorizado.
7. En "Avatar ilustrado del club", elegir uno de los 15 personajes o dejar "Usar iniciales".
8. Activar solo los campos autorizados: foto, rango de edad, estadisticas y compartir.
9. Guardar y abrir el enlace "Ver perfil" desde la fila del jugador.
10. Revisar el perfil en telefono antes de compartirlo.

Reglas de seguridad:

- Foto, rango de edad y QR compartible solo se habilitan en perfiles publicos.
- El avatar es ficticio y no reemplaza el permiso de una fotografia real. Si la foto publica esta autorizada, tiene prioridad; si no, se muestra el avatar elegido y luego las iniciales.
- Cambiar o quitar el avatar no borra la fotografia almacenada.
- Fecha de nacimiento, notas internas y datos administrativos no se muestran en la ficha publica.
- Si se cambia un perfil a privado, desaparece del directorio y el enlace deja de mostrar la ficha.
- La fecha "miembro desde" se llena automaticamente al registrar, pero se puede editar.
- Los jugadores existentes fueron fechados como miembros desde el 2026-07-06.

## Torneos privados

Ruta:

```bash
/ajedrez/crear
```

Uso:

1. El visitante crea un torneo rapido desde telefono.
2. Agrega nombres de jugadores.
3. Elige sistema y rondas.
4. Comparte el link de vista o admin.
5. El torneo no aparece en home, sitemap ni listados oficiales.

Notas:

- Los links privados usan token validado y rutas `noindex`.
- En el MVP los resultados privados se calculan desde el estado inicial del link. Persistencia colaborativa real requiere base de datos o storage temporal.

## Publicacion y marketing

Para torneos oficiales publicados se recomienda completar:

- Titulo claro.
- Fecha y hora.
- Estado del torneo.
- Foto principal.
- Resumen del evento.
- Galeria.
- Podium.
- Tabla de posiciones.
- Historial de rondas.

Asi el modulo de ajedrez suma marketing comunitario sin competir con el producto principal del restaurante.
