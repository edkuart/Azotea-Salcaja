# Chessitos on Railway

Production: https://web-production-5f909.up.railway.app

Railway project: `bbd95870-4d38-4ab1-a5b9-6ac647972773` (`chessitos`), service `web`.

The source was recovered from Vercel deployment `dpl_EZErEdDTBMVx6D7jHuf9DEbxGgVa` on 2026-09-29. All 268 source files matched their Vercel SHA-1 identifiers. The GitHub `main` branch was older than this deployment.

The app continues to use the existing Supabase project and PostgreSQL database. Do not replace `DATABASE_URL` or `DIRECT_URL` with a new database, and do not run Prisma migrations as part of a hosting change. On migration day the database contained 12 permanent club players, 18 tournament blobs, and 4 class enrollments. A read-only backup of all public tables is stored at `D:\chessitos-backup\chessitos-2026-09-29.json.gz.aes`; its DPAPI-protected key is alongside it. Both files are required for recovery, and the key is tied to the Windows user profile that created it.

Railway variables: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`. Store their values in Railway only. The Supabase server key is used for media uploads. The admin credentials are environment variables and do not change player records.

Build: `npm ci` then `npm run build`. Start: `npm start`. The Next.js build uses two workers to fit constrained build environments. The app must be deployed as a running Node service; static export would lose its database-backed routes.

Check the public club, tournament, and admin login pages after each deployment. Compare player and tournament counts against the existing Supabase database before any data migration.
