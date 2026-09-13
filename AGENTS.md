# Base de conocimiento del proyecto

## Propósito y alcance

- **Nombre visible:** Stream Wrestling.
- **Función:** cliente web de búsqueda y reproducción de videos de wrestling hospedados en **YouTube** y **Dailymotion**.
- Este repositorio contiene **solo el frontend**. El backend remoto, su código, su base de datos y su especificación no están presentes aquí.

## Stack y ejecución

- React 19 + TypeScript, compilado con Vite 7.
- UI: Material UI (MUI) y Emotion.
- Navegación: React Router DOM 7 (`BrowserRouter`).
- Estado compartido: Zustand.
- Scripts: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`.

## Estructura relevante

| Ruta | Responsabilidad |
| --- | --- |
| `src/main.tsx` | Arranque React, `StrictMode` y `BrowserRouter`. |
| `src/App.tsx` | Cabecera, botón de donación y definición efectiva de rutas. |
| `src/pages/VideoSearchPage.tsx` | Búsqueda, grilla de resultados, paginación manual y reproducción en la misma página. |
| `src/pages/VideoDetailPage.tsx` | Reproductor y metadatos del video seleccionado. |
| `src/api/` | Cliente HTTP, autenticación y caché de token. |
| `src/hooks/useVideoSearch.ts` | Orquesta las búsquedas paginadas. |
| `src/stores/videoStore.ts` | Estado global efímero: `results` y `selectedVideo`. |
| `src/utils/videoMapper.ts` | Convierte un video del backend a `VideoSource` para los reproductores. |
| `src/components/` | Buscador, tarjetas y reproductores específicos de cada proveedor. |

`src/router.tsx` también declara las rutas, pero actualmente **no se importa**: las rutas que se usan están en `App.tsx`.

## Flujo frontend ↔ backend

Las variables Vite necesarias viven en `.env` (ignorado por Git; no registrar valores ni secretos):

- `VITE_API_URL`: URL base del backend. El código concatena rutas como `${VITE_API_URL}auth/token`, por lo que normalmente debe terminar en `/`.
- `VITE_API_KEY`: clave enviada en el encabezado `x-api-key` para obtener un token.
- `VITE_TOKEN_TTL_MINUTES` (opcional): duración del token en minutos; por defecto se asumen 55 minutos.

Secuencia de una búsqueda:

```text
Usuario escribe consulta
  → SearchBar → VideoSearchPage(query)
  → useVideoSearch(query)
  → searchVideos({ q, page, limit: 12 })
  → fetchWithAuth()
  → getValidToken()
      ├─ token válido en memoria/localStorage: reutilizarlo
      └─ sin token/expirado: POST {VITE_API_URL}auth/token con x-api-key
  → GET {VITE_API_URL}videos/search?q=<q>&page=<page>&limit=12
       Authorization: Bearer <accessToken>
  → JSON array de videos → Zustand (`results`) → VideoCard
```

Contrato observado (no hay contrato formal en el repo):

- `POST auth/token`: requiere `x-api-key`; responde al menos `{ "accessToken": "..." }`.
- `GET videos/search`: requiere Bearer token; recibe `q`, `page` y `limit`; el frontend espera un **array**. Si llega vacío, deja de mostrar “Load more”.
- Cada video debe aportar, como mínimo: `_id`, `title`, `thumbnail`, `provider` y `url`. Para el detalle se muestran además `company`, `show`, `year` y `stipulation` si existen.

Ante HTTP 401, `fetchWithAuth` elimina solo el token propio, pide uno nuevo y reintenta una vez la misma solicitud. El token se guarda en `videos_api_token` y su vencimiento en `videos_api_expires_at`; las solicitudes concurrentes comparten la misma renovación.

## Reproducción por proveedor

- `videoMapper` admite `provider` `youtube` y `dailymotion` (aunque el tipo también incluye `vimeo`, sin reproductor ni mapeo implementados).
- YouTube: extrae `v` de `video.url` y carga dinámicamente la IFrame API (`https://www.youtube.com/iframe_api`). Al evento `ENDED` ejecuta `onEnded`.
- Dailymotion: extrae el texto posterior a `/video/` de `video.url`, renderiza un iframe `https://www.dailymotion.com/embed/video/<id>` y recibe finalización mediante `postMessage` (`api=postMessage`, `origin=window.location.origin`). Muestra un aviso temporal de inestabilidad; en escritorio el contenedor ocupa `70vh`.
- En la página de búsqueda, al terminar un video se avanza al siguiente resultado cargado. Al clicar una tarjeta se navega a `/video/:id`; esa ruta usa el video previamente guardado en Zustand.

## Limitaciones y precauciones conocidas

- Abrir o refrescar directamente `/video/:id` redirige a `/`, porque `selectedVideo` no persiste ni se vuelve a pedir al backend.
- `useVideoSearch` espera 350 ms desde la última pulsación antes de consultar e ignora respuestas de consultas obsoletas.
- El estado y la API usan `any`; reforzar el contrato con tipos antes de cambios amplios.
- El mapeo de URL es frágil para URLs alternativas: YouTube solo acepta `?v=...` y Dailymotion solo URLs que incluyan `/video/`.
- El CSS global es en gran parte el del template de Vite y condiciona el layout (`body` flex y `#root` centrado). Validar responsive al tocar pantallas.
- En el código hay algunos comentarios/textos con mojibake (problemas de codificación). Mantener archivos en UTF-8.

## Convenciones para cambios futuros

- Centralizar nuevas llamadas backend en `src/api/` y pasar las rutas protegidas por `fetchWithAuth`.
- No exponer claves reales en código, documentación, commits ni respuestas. Recordar que toda variable `VITE_*` queda embebida en el bundle del navegador; el backend debe tratar `VITE_API_KEY` como una clave pública/restringida.
- Si el backend cambia el formato de sus videos, actualizar primero el tipo/normalizador y después `VideoCard`, las páginas y `videoMapper`.
- Tras cambios de TypeScript o UI, ejecutar `npm run lint` y `npm run build`.
