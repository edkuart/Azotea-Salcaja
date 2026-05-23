# Checklist de produccion

## Producto

- [ ] Confirmar logo, nombre comercial y tono visual final.
- [ ] Reemplazar imagenes demo por fotos reales del restaurante.
- [ ] Confirmar categorias del menu.
- [ ] Confirmar productos, precios y descripciones.
- [ ] Confirmar telefono de WhatsApp.
- [ ] Confirmar direccion exacta y link de mapa.
- [ ] Confirmar horarios.
- [ ] Confirmar eventos recurrentes.
- [ ] Confirmar textos de ajedrez y horario de lunes 7:30 p.m.

## Tecnico

- [ ] Crear repositorio dedicado para `Azotea-Salcaja`.
- [ ] Crear proyecto Supabase.
- [ ] Configurar `DATABASE_URL` y `DIRECT_URL`.
- [ ] Crear buckets de Storage.
- [ ] Definir proveedor final de imagenes.
- [ ] Conectar CRUD admin a base real.
- [ ] Activar autenticacion admin real.
- [ ] Proteger acciones admin en servidor.
- [ ] Agregar rate limiting a acciones sensibles.
- [ ] Revisar vulnerabilidades con `npm audit`.
- [ ] Configurar dominio final en `APP_URL`.
- [ ] Verificar `/robots.txt` y `/sitemap.xml`.
- [ ] Ejecutar build y pruebas en CI.

## Ajedrez

- [ ] Validar reglas de bye con el organizador.
- [ ] Confirmar puntaje para incomparecencia.
- [ ] Confirmar orden de desempates para torneos oficiales.
- [ ] Definir si los torneos privados expiran.
- [ ] Definir si links privados permiten colaboracion o solo vista.
- [ ] Definir permisos para editar resultados privados.
- [ ] Validar pareos suizos con casos reales de la comunidad.

## Seguridad

- [ ] Definir `AUTH_SECRET` largo y unico.
- [ ] Revisar politicas de Supabase Storage.
- [ ] No exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.
- [ ] Confirmar headers de seguridad en produccion.
- [ ] Confirmar que admin y privados no se indexen.
- [ ] Agregar logs de acciones admin cuando exista persistencia.

## QA

- [ ] Ejecutar `npm run typecheck`.
- [ ] Ejecutar `npm run lint`.
- [ ] Ejecutar `npm test -- --run`.
- [ ] Ejecutar `npm run test:e2e`.
- [ ] Revisar capturas desktop/mobile.
- [ ] Probar desde telefono real.
- [ ] Probar navegacion lenta o offline parcial.
- [ ] Probar errores 404 y errores de aplicacion.

## Deploy

- [ ] Crear preview en Vercel.
- [ ] Validar rutas publicas.
- [ ] Validar rutas admin.
- [ ] Validar token privado valido e invalido.
- [ ] Validar headers.
- [ ] Promover a produccion.
- [ ] Documentar credenciales y procedimiento de actualizacion.
