# Notas de entrega del MVP

## Version

Fase 10: Deploy y documentacion.

## Incluido

- Sitio publico del restaurante con home, menu, eventos y contacto.
- Seccion de ajedrez integrada al sitio del restaurante.
- Listado y detalle publico de torneos oficiales.
- Experiencia para crear torneos privados desde telefono.
- Links privados de vista y administracion.
- Panel admin separado por modulos.
- Motor de standings, pareos y desempates con pruebas unitarias.
- Seguridad base con headers, robots y rutas privadas no indexables.
- Sitemap publico.
- Documentacion de deploy, admin y produccion.
- Pruebas E2E con capturas desktop y mobile.

## Decisiones

- El restaurante se mantiene como producto principal.
- El ajedrez funciona como modulo comunitario, de marketing y gestion de torneos.
- Los torneos oficiales son publicables y aparecen en rutas publicas.
- Los torneos privados no aparecen en home, listados publicos ni sitemap.
- El MVP no incluye carrito, pagos ni pedidos en linea.
- El MVP no conecta todavia el admin visual a persistencia real.

## Limitaciones conocidas

- La autenticacion admin esta preparada a nivel de rutas/interfaz, pero debe conectarse antes de operar en produccion.
- Los CRUD admin usan datos y pantallas del MVP; falta persistencia con PostgreSQL/Supabase.
- Los links privados codifican la configuracion inicial; la colaboracion persistente requiere almacenamiento temporal o base de datos.
- Las imagenes son remotas/demo y deben reemplazarse por assets reales del restaurante.
- Falta configurar CI/CD con un repositorio dedicado.

## Verificacion esperada

```bash
npm run typecheck
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

## Siguiente fase recomendada

Conectar persistencia real:

1. Activar Supabase/PostgreSQL.
2. Completar migraciones Prisma.
3. Implementar autenticacion admin.
4. Convertir formularios admin en acciones reales.
5. Subir imagenes a Storage.
6. Persistir torneos privados opcionalmente con expiracion.
