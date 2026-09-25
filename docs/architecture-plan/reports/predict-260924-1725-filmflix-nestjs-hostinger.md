# Prediction Report: FilmFlix Mejorada (NestJS+React en Hostinger hPanel shared)

## Verdict: CAUTION

### Agreements (todas las personas alinean)
- Diferir MySQL/auth a Fase 2 es correcto — reduce superficie de riesgo del MVP
- TMDB key solo en backend está bien resuelto en el plan
- El mayor riesgo técnico real es la Fase 5 (ServeStaticModule + SPA fallback) y la Fase 6 (comportamiento real de Passenger) — ambas ya marcadas como "riesgo alto" en el plan, correctamente
- Ninguna persona encuentra un bloqueador de seguridad crítico ni incompatibilidad fundamental confirmada — son riesgos de implementación, no de diseño

### Conflicts & Resolutions

| Topic | Architect | Security | Performance | UX | Devil's Advocate | Resolution |
|-------|-----------|----------|-------------|-----|-----------------|------------|
| Servir frontend desde NestJS vs sitio estático separado | Válido para 1-proceso-Passenger | Neutral | Neutral, pero cold starts complican cache | Neutral | Cuestiona si vale la pena el riesgo de Fase 5 vs subir el build de React como hosting estático normal (fuera de Node) | **Mantener plan actual** (ya decidido en brainstorm), pero añadir a Fase 5 un fallback documentado: si `ServeStaticModule` + catch-all falla en producción, plan B es servir `apps/web/dist` como sitio estático normal de Hostinger (fuera de la app Node) y la API Node solo en subdominio/subpath. Esto no cambia el plan ahora, solo evita bloqueo si Fase 5/6 falla en producción real |
| NestJS vs stack más ligero (Express/Fastify) para 3 endpoints proxy | NestJS es "correcto" pero pesado para el caso de uso | N/A | Arranque más lento, mayor bundle backend | N/A | Cuestiona el overhead, pero stack ya decidido explícitamente por el usuario | **No aplica cambio** — decisión de stack es del usuario, no reabrir |
| Rate limiting de entrada (cliente → nuestra API) | No mencionado en plan | Riesgo: abuso de `/search` agota cuota TMDB | Impacto directo si no se limita | N/A | N/A | **Añadir a Fase 3**: throttling básico (`@nestjs/throttler`) en los 3 endpoints, gratis y evita agotar cuota TMDB por abuso o loops accidentales del frontend |

### Risk Summary

| Risk | Severity | Mitigation |
|------|----------|------------|
| Passenger recicla/duerme el proceso Node por inactividad en shared hosting → cache in-memory se invalida constantemente, no solo en restarts planeados | Medium | Ya aceptado como deuda técnica en brainstorm; documentar explícitamente en Fase 3 que el cache es "best-effort", no confiar en TTLs largos para reducir carga real a TMDB |
| `ServeStaticModule` de NestJS no garantiza fallback automático a `index.html` para rutas SPA sin configuración explícita de catch-all | High | Fase 5 ya lo marca "validar al implementar" — reforzar: escribir un test manual explícito (`curl /movie/999999`) ANTES de dar la fase por completa, no asumir que funciona |
| hPanel puede no soportar npm workspaces (monorepo) igual que un `npm install` estándar | Medium | Fase 6 ya tiene plan B (subir `node_modules` pre-instalado) — mantener, pero probar plan A primero en un entorno de staging antes de la demo con cliente |
| Sin rate limiting de entrada, un loop de frontend o abuso agota cuota TMDB (afecta a TODOS los usuarios, no solo al abusador) | Medium | Añadir `@nestjs/throttler` en Fase 3 (nuevo ítem, ver Conflicts) |
| Cache in-memory sin límite de tamaño (`max` no definido) podría crecer sin bound bajo tráfico alto de búsquedas variadas | Low | Definir `max: 100` items en `CacheModule.register()` — ajuste trivial en Fase 3 |

### Recommendations
1. **Fase 3**: añadir `@nestjs/throttler` (rate limit básico, ej. 20 req/min por IP) a los 3 endpoints — previene agotar cuota TMDB por abuso, bajo costo de implementación
2. **Fase 3**: definir `max` en `CacheModule.register()` para evitar crecimiento sin límite del cache in-memory
3. **Fase 5**: antes de marcar la fase como completa, ejecutar prueba explícita de fallback SPA (`curl` a ruta profunda) — no asumir que `ServeStaticModule` lo resuelve solo
4. **Fase 6**: documentar plan B (frontend como sitio estático separado de la app Node) como contingencia si Fase 5 falla en producción real de Hostinger — no implementar ahora, solo tenerlo escrito para no bloquear la demo si el plan A falla
5. **General**: el plan es sólido para una demo de bajo tráfico; el veredicto CAUTION refleja riesgos de implementación específicos de Passenger/shared-hosting, no fallas de diseño — proceder a Red Team para estresar estos mismos puntos con un reviewer hostil
