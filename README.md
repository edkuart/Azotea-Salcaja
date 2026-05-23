# Azotea Salcajá

Web mobile-first para Azotea Salcajá: catalogo digital del restaurante, eventos, contacto y modulo comunitario de ajedrez con torneos oficiales y privados.

## Estado del MVP

- Web publica del restaurante: home, menu, eventos, contacto y ajedrez.
- Panel admin visual: resumen, productos, categorias, eventos, datos del restaurante y torneos oficiales.
- Modulo de ajedrez: torneos oficiales publicados, standings, rondas, galeria, podium y torneos privados por link.
- Motor local de torneo: sistema suizo, round robin, byes, resultados, standings y desempates principales.
- Seguridad base: headers, rutas admin/privadas no indexables, validacion de tokens privados y paginas de error.
- Testing: unit tests con Vitest y flujos E2E con Playwright, incluyendo capturas desktop/mobile.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Prisma 7
- PostgreSQL / Supabase
- Supabase Storage o Cloudinary para imagenes
- Vitest
- Playwright
- Vercel

## Comandos

```bash
npm run dev
npm run typecheck
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

## Variables de entorno

Usa `.env.example` como base:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/azotea_salcaja"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/azotea_salcaja"
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
APP_URL="http://localhost:3000"
AUTH_SECRET=""
```

En produccion, `APP_URL` debe apuntar al dominio final, por ejemplo `https://azotea-salcaja.vercel.app` o el dominio propio.

## Rutas principales

- `/`
- `/menu`
- `/eventos`
- `/contacto`
- `/ajedrez`
- `/ajedrez/torneos`
- `/ajedrez/torneos/[slug]`
- `/ajedrez/crear`
- `/ajedrez/privado/[token]`
- `/ajedrez/privado/[token]/admin`
- `/admin`
- `/admin/productos`
- `/admin/categorias`
- `/admin/eventos`
- `/admin/restaurante`
- `/admin/ajedrez/torneos`

## Documentacion

- Diseno tecnico: `AZOTEA_SALCAJA_TECHNICAL_DESIGN.md`
- Deploy: `docs/DEPLOYMENT.md`
- Guia admin: `docs/ADMIN_GUIDE.md`
- Checklist de produccion: `docs/PRODUCTION_CHECKLIST.md`
- Notas de entrega: `docs/RELEASE_NOTES.md`

## Capturas y pruebas visuales

Playwright genera capturas en:

```bash
test-results/screenshots
```

El set actual cubre escritorio y mobile para home, menu, eventos, contacto, ajedrez, torneos oficiales, detalle oficial, admin y flujo privado.
