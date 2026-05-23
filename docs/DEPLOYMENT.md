# Deploy de Azotea Salcaja

Esta guia deja el camino recomendado para publicar el MVP en Vercel con PostgreSQL/Supabase.

## 1. Preparar repositorio

El proyecto vive en:

```bash
C:\Users\Dell\Projects\Azotea-Salcaja
```

Antes de produccion conviene usar un repositorio dedicado para esta carpeta. En esta maquina el `git` detecta como raiz `C:\Users\Dell`, asi que no se recomienda commitear desde la raiz del usuario.

## 2. Crear proyecto de Supabase

1. Crear un proyecto nuevo en Supabase.
2. Copiar la cadena PostgreSQL para `DATABASE_URL`.
3. Copiar la cadena directa o pooler adecuada para `DIRECT_URL`.
4. Crear buckets de imagenes:
   - `restaurant-products`
   - `events`
   - `chess-tournaments`
   - `chess-players`
5. Definir politicas de Storage:
   - Lectura publica para imagenes publicadas.
   - Escritura solo para usuario admin/autenticado o server role.

## 3. Variables de entorno en Vercel

Configurar:

```bash
DATABASE_URL=...
DIRECT_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
APP_URL=https://dominio-final
AUTH_SECRET=valor-largo-aleatorio
```

`APP_URL` alimenta metadata y sitemap. Debe ser el dominio real antes de lanzar.

## 4. Base de datos

Cuando se conecte la base real:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Si se usa Supabase en produccion, ejecutar migraciones contra la base de produccion solo cuando el modelo este aprobado.

## 5. Validacion previa

Ejecutar localmente:

```bash
npm run typecheck
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

Revisar capturas en:

```bash
test-results/screenshots
```

## 6. Deploy en Vercel

1. Importar el repositorio dedicado en Vercel.
2. Configurar variables de entorno.
3. Confirmar framework `Next.js`.
4. Build command: `npm run build`.
5. Output: automatico de Next.js.
6. Publicar preview.
7. Validar rutas publicas y headers.
8. Promover a produccion.

## 7. Validacion post deploy

Revisar:

- `/`
- `/menu`
- `/eventos`
- `/contacto`
- `/ajedrez`
- `/ajedrez/torneos`
- `/ajedrez/crear`
- `/admin`
- `/robots.txt`
- `/sitemap.xml`

Confirmar que `/admin/*` y `/ajedrez/privado/*` tengan `X-Robots-Tag: noindex, nofollow`.

## 8. Bloqueos actuales para deploy real

- Falta definir dominio final.
- Falta crear proyecto Supabase real.
- Falta definir autenticacion admin real.
- Falta conectar CRUD persistente a base de datos.
- Falta decidir proveedor definitivo de imagenes: Supabase Storage o Cloudinary.
