# Fase 1 - Identidad del miembro

Estado: implementada como primera versión segura.

## Objetivo

Convertir el roster actual en un directorio público seguro y visual, con ficha propia para cada miembro autorizado.

## Experiencia pública

- Evolucionar `/ajedrez/club` sin retirar el ranking.
- Directorio con búsqueda y filtros.
- Perfil `/ajedrez/club/jugadores/[slug]`.
- Avatar, nombre público, categoría, año de ingreso, ELO, posición y resumen competitivo según permisos.
- Estados correctos para perfil privado, inexistente o sin torneos.

## Administración

- Nombre público, alias, slug único y fecha de ingreso.
- Categoría automática por edad: Sub 10, Sub 12, Sub 14, Sub 16, Sub 18 o Libre.
- Visibilidad privada, por iniciales o pública.
- Permisos separados para nombre, fotografía, rango de edad, estadísticas y compartir.
- Fecha de autorización opcional.
- Previsualización exacta antes de publicar.

## Datos propuestos

Extender `ClubPlayer` con `publicSlug`, `publicName`, `memberSince`, `clubCategory`, `profileVisibility` y controles de campo. La categoría se deriva automáticamente desde la fecha de nacimiento y solo se presenta como subcategoría o rango público permitido.

## Reglas

- Un miembro privado no aparece en listados, sitemap o metadata.
- Sin foto autorizada se usa avatar neutro.
- El slug es estable.
- Desactivar no elimina historial.
- Notas y fecha de nacimiento nunca salen en la proyección pública.

## Fuera de alcance

Gráfica de ELO, logros avanzados, cuentas personales, mensajería e integraciones. El perfil ya incluye un primer kit visual de pertenencia, pero no emisión formal ni auditoría de certificados.

## Criterios de aceptación

- El admin configura y previsualiza el perfil.
- Un registro privado no puede descubrirse.
- Solo aparecen campos autorizados.
- Funciona con foto, sin foto, datos incompletos y cero torneos.
- El ranking actual permanece intacto.
- Funciona a 360 px y con teclado.
- Hay pruebas de permisos, slug y proyección pública.

## Entregables

Migración, servicio público seguro, directorio, perfil, controles admin, previsualización, pruebas y guía administrativa.
