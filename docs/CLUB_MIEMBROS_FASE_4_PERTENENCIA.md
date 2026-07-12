# Fase 4 - Pertenencia tangible

Estado: implementación parcial segura en perfiles autorizados. La emisión administrativa completa queda pendiente.

## Objetivo

Convertir identidad y logros en símbolos seguros que los miembros puedan conservar, mostrar y compartir.

## Carné digital

- Marca Chessitos, nombre público o alias, foto autorizada o avatar.
- Número inmutable de miembro, categoría, año de ingreso y vigencia.
- Logro destacado opcional y QR seguro.
- Descarga como imagen y salida preparada para impresión.
- Aviso de que no es identificación legal.

## Pasaporte y certificados

- Sellos por participación, aprendizaje, representación y colaboración.
- Etapas completadas, siguiente etapa y versión imprimible.
- Certificados de participación, podio, progreso, constancia, representación y reconocimiento humano.
- Historia colectiva con hitos, campeones y resumen anual.

## Seguridad

El QR contiene solo una URL revocable o token opaco; nunca fecha de nacimiento, teléfono o ID interno. Si cambia la privacidad, responde de forma neutra. No concede acceso admin ni se indexa automáticamente.

## Datos y administración

Número de miembro, vigencia, token rotatable, logro destacado, versión de plantilla y auditoría de emisión/revocación. El admin puede previsualizar, emitir, rotar, revocar, generar lotes y registrar sellos manuales. Las imágenes se reproducen desde plantillas versionadas cuando sea posible.

## Fuera de alcance

Identificación legal, cerraduras, pagos, saldo, datos médicos o escolares, monedas y NFTs.

## Criterios de aceptación

- Funciona con y sin fotografía.
- El QR solo revela contenido autorizado y la revocación es inmediata.
- Certificados incluyen evidencia, fecha y responsable.
- Exportación con calidad de impresión y diseño móvil correcto.
- Emisiones y revocaciones auditadas.

## Entregables

Numeración, credencial, plantillas, generador individual/por lote, pasaporte, QR seguro y guía de impresión.

## Implementado ahora

- Carné visual dentro del perfil público autorizado.
- Número visual derivado del slug público, sin exponer ID interno.
- Pasaporte de progreso basado en estadísticas ya autorizadas.
- Constancia visual según participación, progreso o podio.
- QR descargable solo cuando el perfil tiene permiso para compartirse.

## Pendiente para cerrar la fase

- Número de miembro persistente administrado.
- Token QR rotatable independiente del slug.
- Emisión, revocación y auditoría desde administración.
- Generador por lote y salida de impresión formal.
- Certificados con responsable, evidencia y fecha oficial.
