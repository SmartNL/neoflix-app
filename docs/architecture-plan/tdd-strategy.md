# TDD Strategy: FilmFlix NestJS+React

Tests a escribir ANTES de la implementación de cada fase (Red-Green-Refactor). Referencia: [plan.md](./plan.md)

## Fase 3 — Backend (TMDB, Movies, Cache)

**Escribir primero (Jest + Supertest):**
```
apps/api/src/tmdb/tmdb.service.spec.ts
  - "getTrending() devuelve lista mapeada correctamente cuando TMDB responde 200"
  - "getTrending() lanza HttpException(502) cuando TMDB responde error"
  - "search(query) construye la URL con encodeURIComponent del query"

apps/api/src/movies/movies.service.spec.ts
  - "getMovieDetail(id) usa cache en la segunda llamada (mock TmdbService, verificar 1 sola invocación)"
  - "getMovieDetail(id) invalida cache tras TTL (usar jest.useFakeTimers)"

apps/api/test/movies.e2e-spec.ts
  - "GET /api/movies/trending devuelve 200 y array"
  - "GET /api/movies/search?q=matrix devuelve 200"
  - "GET /api/movies/:id con id inválido devuelve 404 o 502 según corresponda"
  - "GET /api/movies/trending repetido 25 veces en 1 min devuelve 429 (throttler)"
```
**Luego implementar** `TmdbService`, `MoviesService`, `MoviesController` hasta que estos tests pasen.

## Fase 4 — Frontend (catálogo, búsqueda, detalle)

**Escribir primero (Vitest + React Testing Library):**
```
apps/web/src/hooks/useMovies.test.ts
  - "devuelve loading=true inicialmente, luego data cuando resuelve fetch"
  - "devuelve error cuando fetch rechaza"

apps/web/src/components/MovieCard.test.tsx
  - "renderiza título y poster cuando recibe movie prop"
  - "renderiza placeholder cuando poster_path es null"

apps/web/src/pages/SearchPage.test.tsx
  - "no dispara fetch hasta pasar el debounce (300ms)"
  - "muestra 'sin resultados' cuando la API devuelve array vacío"
```
**Luego implementar** componentes/hooks hasta que pasen.

## Fase 5 — Integración (SPA fallback)

**Escribir primero (Supertest contra app completa):**
```
apps/api/test/spa-fallback.e2e-spec.ts
  - "GET /movie/123 (ruta no-API) devuelve 200 con Content-Type text/html"
  - "GET /api/movies/trending sigue devolviendo JSON (no interceptado por catch-all)"
  - "GET /assets/index-abc123.js devuelve el archivo estático real, no index.html"
```
Este test es el que valida el Fallo 3 detectado en red-team — **no marcar Fase 5 completa sin que este test pase**.

## Fase 6 — Deployment
No aplica TDD tradicional (infraestructura). En su lugar: **checklist de humo post-deploy** (ya definido en `phase-06-deployment-hostinger-hpanel.md` → Success Criteria), ejecutado manualmente contra el dominio real.

## Cobertura Objetivo
- Backend (`apps/api`): 70%+ en `services/` (lógica de negocio), sin exigir 100% en controllers triviales
- Frontend (`apps/web`): tests en hooks y lógica de estado; NO exigir tests exhaustivos de estilos/CSS

## Orden de Ejecución
1. Escribir tests de Fase 3 → Red → implementar backend → Green
2. Escribir tests de Fase 4 → Red → implementar frontend → Green (paralelo a 3 si hay 2 developers)
3. Escribir test de Fase 5 (spa-fallback) → Red → implementar catch-all controller → Green
4. Fase 6: checklist manual, no tests automatizados (fuera del alcance de shared hosting sin CI/CD)
