# Fase 4: Frontend — Catálogo, Búsqueda, Detalle

## Contexto
[plan.md](./plan.md) | Depende de: Fase 2 | Paralelizable con: Fase 3

## Overview
- Prioridad: Alta
- Estado: Pending
- UI React consumiendo los endpoints de Fase 3, inspirada en FilmFlix pero mejorada visualmente

## Requirements

### Funcionales
- Página Home: grid de trending movies (poster, título, rating)
- Barra de búsqueda (debounced) → resultados en la misma vista o página `/search?q=`
- Página Detalle `/movie/:id`: sinopsis, cast, rating, trailer embed (YouTube si TMDB da video key)
- Responsive (móvil/tablet/desktop)
- Loading states y error states (si backend devuelve 502)

### No Funcionales
- Lazy loading de imágenes (poster)
- Code splitting por ruta (React Router lazy)

## Architecture
```
apps/web/src/
├── pages/
│   ├── HomePage.tsx
│   ├── SearchPage.tsx
│   └── MovieDetailPage.tsx
├── components/
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   ├── SearchBar.tsx
│   └── Loader.tsx
├── services/
│   └── api.ts          # axios wrapper, baseURL configurable por env
├── hooks/
│   └── useMovies.ts     # fetch + loading/error state
├── types/
│   └── movie.ts
└── App.tsx              # React Router setup
```

## Related Code Files
**Crear:** todos los listados en Architecture arriba.
**Modificar:** `apps/web/vite.config.ts` (proxy `/api` → `localhost:3000` en dev)

## Implementation Steps
1. Instalar: `react-router-dom`, `axios`
2. Configurar `vite.config.ts` con proxy: `server.proxy['/api'] = 'http://localhost:3000'` (evita CORS en dev)
3. Crear `services/api.ts`: instancia axios con `baseURL: '/api'`
4. Crear `types/movie.ts`: interfaces `Movie`, `MovieDetail`, `SearchResult` (mapeando shape de TMDB)
5. Crear `hooks/useMovies.ts`: hook genérico con loading/error/data para cualquier fetch
6. Implementar `MovieCard` + `MovieGrid` (grid responsive CSS)
7. Implementar `HomePage` usando `useMovies` contra `/api/movies/trending`
8. Implementar `SearchBar` con debounce (300ms) + `SearchPage` contra `/api/movies/search`
9. Implementar `MovieDetailPage` contra `/api/movies/:id`, incluir trailer embed si `video_key` disponible
10. Configurar `React Router` en `App.tsx` con rutas `/`, `/search`, `/movie/:id`, lazy-loaded
11. Estilos: CSS Modules o Tailwind (decidir según preferencia — Tailwind recomendado por velocidad)

## Todo List
- [ ] Proxy dev configurado, sin errores CORS en desarrollo
- [ ] HomePage muestra grid de trending
- [ ] Búsqueda funcional con debounce
- [ ] Detalle de película con toda la info
- [ ] Loading/error states visibles y probados (simular fallo de red)
- [ ] Responsive verificado en 3 breakpoints (móvil, tablet, desktop)

## Success Criteria
- Usuario puede navegar Home → buscar → ver detalle sin errores de consola
- Imágenes cargan lazy (verificar en Network tab)

## Risk Assessment
- Riesgo: shape de datos de TMDB cambia entre endpoints (trending vs detail tienen campos distintos) → normalizar en `types/movie.ts` y en el backend si es necesario

## Next Steps
→ Fase 5: build de producción + servir desde NestJS
