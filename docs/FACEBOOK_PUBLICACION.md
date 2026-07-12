# Publicar resultados en la página de Facebook de Chessitos

Al finalizar un torneo, la pestaña **Tabla** del admin muestra la tarjeta
**"Compartir resultados"** con el póster PNG generado automáticamente.

Hay dos maneras de llevarlo a Facebook:

## 1. Compartir manual (funciona hoy, sin configurar nada)

Desde el teléfono:

1. Abre el torneo terminado en el admin → pestaña **Tabla**.
2. Toca **Copiar texto** (el caption con el podio y el link al ranking).
3. Toca **Compartir** → elige Facebook → selecciona publicar como página
   **Chessitos** → pega el texto copiado → publica.

Si el navegador no soporta compartir archivos, el botón descarga el PNG para
subirlo a mano (también sirve **Descargar PNG** + Meta Business Suite).

## 2. Botón "Publicar en Facebook" (automático, requiere configurar una vez)

Publica el póster + caption directo en la página con un clic. Necesita dos
variables de entorno (local en `.env`, producción en Vercel → Settings →
Environment Variables):

- `FACEBOOK_PAGE_ID` — el ID numérico de la página Chessitos.
- `FACEBOOK_PAGE_ACCESS_TOKEN` — token de página **de larga duración**.

### Cómo generar el token (una sola vez, ~15 minutos)

Requisito: ser administrador de la página de Facebook con la cuenta que usarás.

1. **Crear la app de Meta**: entra a <https://developers.facebook.com/apps> →
   *Create App* → tipo **Business** (u *Other*). No hace falta publicarla para
   nadie más: tú serás el único usuario.
2. **Token de usuario corto**: abre el *Graph API Explorer*
   (<https://developers.facebook.com/tools/explorer>), selecciona tu app,
   *Get User Access Token* y marca los permisos: `pages_show_list`,
   `pages_read_engagement`, `pages_manage_posts`, `pages_manage_metadata`.
   Acepta el diálogo de Facebook.
3. **Alargar el token**: en la misma pantalla, abre el *Access Token Tool* /
   *Debug* (<https://developers.facebook.com/tools/debug/accesstoken>) y usa
   **Extend Access Token** (lo vuelve válido ~60 días).
4. **Token de página (no expira)**: con el token largo, consulta
   `https://graph.facebook.com/v23.0/me/accounts?access_token=TOKEN_LARGO`.
   La respuesta lista tus páginas: copia `id` (→ `FACEBOOK_PAGE_ID`) y
   `access_token` (→ `FACEBOOK_PAGE_ACCESS_TOKEN`) de Chessitos. Los tokens de
   página derivados de un token largo **no expiran** (verifícalo en el Debug
   tool: "Expires: Never").
5. Configura ambas variables y redespliega. El botón aparece solo cuando las
   dos existen.

### Cosas que hay que saber

- **Modo de la app**: mientras la app de Meta esté en *Development mode*, las
  publicaciones hechas por API **solo las ven los administradores de la
  página**. Para que el público las vea, cambia la app a **Live** en el
  dashboard (App Mode → Live). Con acceso estándar y siendo tú el admin de la
  app y de la página, no hace falta App Review.
- El token se invalida si cambias la contraseña de Facebook o cierras sesión
  en todos los dispositivos → repite los pasos 2–4.
- El póster se sube como binario, así que el botón también funciona probando
  desde localhost.
- El endpoint es `POST /api/admin/facebook-publish` (protegido por la sesión
  del admin) y publica en `graph.facebook.com/v23.0/{PAGE_ID}/photos`.
