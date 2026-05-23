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
- Editar horarios, contacto, ubicacion y redes sociales.

## Ajedrez oficial

Rutas:

- `/admin/ajedrez/torneos`
- `/admin/ajedrez/torneos/nuevo`
- `/admin/ajedrez/torneos/[id]`
- `/admin/ajedrez/torneos/[id]/publicacion`

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
