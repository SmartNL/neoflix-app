---
status: ready
mode: hard
created: 2026-09-24
pipeline: scout → brainstorm → plan(hard) → predict → red-team → validate → tdd
blockedBy: []
blocks: []
---

# Plan: FilmFlix Mejorada (NestJS + React + TMDB + Hostinger hPanel)

## Contexto
Brainstorm: `../reports/brainstorm-260924-1725-filmflix-nestjs-react-hostinger.md`

App tipo FilmFlix, repo NUEVO separado, monorepo NestJS+React, deploy demo en Hostinger hPanel shared (Phusion Passenger), MySQL, sin Redis, MVP solo lectura (catálogo/búsqueda/detalle).

## Fases

| # | Fase | Archivo | Estado |
|---|------|---------|--------|
| 1 | Setup repo + Git workflow avanzado | [phase-01-setup-repo-git-workflow.md](./phase-01-setup-repo-git-workflow.md) | ⬜ Pending |
| 2 | Setup monorepo (NestJS + React) | [phase-02-setup-monorepo.md](./phase-02-setup-monorepo.md) | ⬜ Pending |
| 3 | Backend: TMDB + Movies + Cache | [phase-03-backend-tmdb-movies-cache.md](./phase-03-backend-tmdb-movies-cache.md) | ⬜ Pending |
| 4 | Frontend: catálogo/búsqueda/detalle | [phase-04-frontend-catalog-search-detail.md](./phase-04-frontend-catalog-search-detail.md) | ⬜ Pending |
| 5 | Integración: servir React desde NestJS | [phase-05-integration-static-serving.md](./phase-05-integration-static-serving.md) | ⬜ Pending |
| 6 | Deployment Hostinger hPanel | [phase-06-deployment-hostinger-hpanel.md](./phase-06-deployment-hostinger-hpanel.md) | ⬜ Pending |

## Dependencias Clave
- Fase 1 → bloquea todas (repo debe existir primero)
- Fase 2 → bloquea 3, 4
- Fase 3 y 4 → paralelizables entre sí, ambas bloquean 5
- Fase 5 → bloquea 6

## Riesgos Críticos (de brainstorm)
1. Compatibilidad Passenger + NestJS (entry point) — validar en Fase 6
2. MySQL vs tipos de datos NestJS/TypeORM — validar en Fase 3
3. Cache in-memory se pierde en restart — deuda técnica aceptada para demo
4. Versión Node soportada en hPanel — verificar antes de fijar en package.json (Fase 1/6)

## Fuera de Alcance (Fase 2 futura)
Auth, watchlist, reviews, recomendaciones, Redis/VPS migration — documentado pero NO implementado ahora.

## Validación Completa
- [x] Predict (5 personas): Veredicto CAUTION → mitigaciones aplicadas a Fase 3 (throttler, cache max)
- [x] Red Team: 3 fallos encontrados → 2 corregidos en Fase 1 (Husky, orden branch protection) y Fase 5 (catch-all explícito), 1 aceptado como riesgo abierto (Passenger real behavior, solo verificable en Fase 6)
- [x] Validate: Node 20.x LTS confirmado, sin SSH confirmado (deploy manual vía File Manager)
- [x] TDD Strategy: [tdd-strategy.md](./tdd-strategy.md)

## Siguiente paso
1. Usuario crea el repo nuevo en GitHub (`neoflix-app` o nombre preferido)
2. `/ck:cocinar` Fase 1 (setup repo + git workflow)
3. `/ck:cocinar` Fase 2 (monorepo)
4. `/ck:cocinar` Fase 3 y 4 en paralelo (con tests de `tdd-strategy.md` primero)
5. `/ck:cocinar` Fase 5 (integración, con test de spa-fallback primero)
6. `/ck:cocinar` Fase 6 (deployment real en Hostinger)
