# Fase 6: Deployment en Hostinger hPanel

## Contexto
[plan.md](./plan.md) | Depende de: Fase 5

## Overview
- Prioridad: Alta (objetivo final: demo visible para cliente)
- Estado: Pending
- Configurar hPanel "Node.js App" para correr el proceso NestJS que sirve todo (API + estáticos)

## Key Insights
- hPanel gestiona apps Node vía Phusion Passenger — el panel pide: entry point (`.js` file), versión de Node, y variables de entorno
- Sin acceso SSH root en shared hosting básico — algunos planes de Hostinger sí dan SSH limitado; verificar en el panel real antes de asumir
- MySQL se crea desde hPanel → phpMyAdmin, pero como decidimos diferir DB a Fase 2, esta fase NO requiere configurar MySQL todavía

## Requirements
- App accesible en dominio/subdominio asignado por el cliente
- HTTPS activo (Hostinger da SSL gratis vía Let's Encrypt, activar desde hPanel)
- Variables de entorno (`TMDB_API_KEY`, `PORT`, `WEB_DIST_PATH`) configuradas vía panel, NUNCA en código
- Build de producción subido (git pull en servidor si hPanel soporta, o subida manual/FTP como fallback)

## Implementation Steps

1. **Verificar versión Node disponible en hPanel** (hPanel → Advanced → Node.js) — ANTES de fijar versión en `.nvmrc`/`engines` de Fase 2, ajustar retroactivamente si difiere
2. **Crear la app Node en hPanel:**
   - Application root: carpeta donde se sube el repo (ej. `neoflix-app`)
   - Application URL: dominio o subdominio del cliente
   - Application startup file: `apps/api/dist/main.js`
   - Node version: la confirmada en paso 1
3. **Configurar variables de entorno** desde el panel de la app Node:
   - `TMDB_API_KEY=<key real>`
   - `TMDB_BASE_URL=https://api.themoviedb.org/3`
   - `PORT=<puerto que asigna Passenger, normalmente vía process.env.PORT>`
   - `WEB_DIST_PATH=<path absoluto en el servidor a apps/web/dist>`
4. **Subir código (confirmado: sin SSH, solo File Manager/panel web — este es el camino único, no un fallback):**
   - Buildear TODO en local primero: `npm run build` (genera `apps/api/dist` y `apps/web/dist`)
   - Correr `npm install --production` en `apps/api` LOCALMENTE, comprimir `apps/api/node_modules` resultante
   - Subir vía File Manager de hPanel (o FTP si el plan lo da): `apps/api/dist`, `apps/api/node_modules`, `apps/web/dist`, `apps/api/package.json`
   - Verificar si hPanel tiene botón "Run npm install" en el panel de Node.js App — si existe, probarlo como alternativa a subir `node_modules` manualmente (más liviano de transferir), pero no depender de que soporte workspaces correctamente (probar primero, tener node_modules pre-comprimido como respaldo)
5. **Ajustar `main.ts` de NestJS** para escuchar en `process.env.PORT` (Passenger inyecta el puerto, no usar hardcoded 3000 en producción)
6. **Verificar `.htaccess`** quedó en la raíz pública correcta (si Apache está delante de Passenger, puede requerir ajuste de path)
7. **Activar SSL** (Let's Encrypt gratis vía hPanel → SSL)
8. **Restart de la app Node** desde el panel tras cualquier cambio de env vars o código
9. **Prueba end-to-end en el dominio real:**
   - Home carga y muestra trending
   - Búsqueda funciona
   - Detalle de película carga
   - Refrescar en `/movie/123` no da 404
   - HTTPS activo sin warnings

## Todo List
- [ ] Versión Node confirmada y alineada con `.nvmrc`
- [ ] App Node creada en hPanel con startup file correcto
- [ ] Variables de entorno configuradas (sin secrets en código)
- [ ] Deploy de `main` branch únicamente (nunca develop directo a producción)
- [ ] `main.ts` usa `process.env.PORT`
- [ ] SSL activo
- [ ] Prueba end-to-end en dominio real pasa los 5 checks de arriba

## Success Criteria
- Cliente puede abrir la URL pública y usar catálogo/búsqueda/detalle sin errores
- No hay secrets expuestos (verificar Network tab del navegador — TMDB key no debe aparecer en ninguna response)

## Risk Assessment
- **Riesgo alto:** Passenger puede requerir estructura específica de archivo de entrada (a veces `app.js` en la raíz en vez de un path anidado) — validar contra documentación real de Hostinger al momento de implementar, este plan asume comportamiento estándar de Passenger pero Hostinger puede tener particularidades
- **Riesgo medio:** `npm install` de un monorepo con workspaces puede no funcionar igual vía el instalador del panel — tener plan B de subir `node_modules` ya instalado si el panel no soporta workspaces correctamente
- **Riesgo medio:** límite de memoria/CPU del plan shared puede causar restarts frecuentes de la app bajo carga — aceptable para demo de cliente con tráfico bajo, documentar como limitante conocida

## Security Considerations
- `TMDB_API_KEY` solo en env vars del panel, nunca en git
- CORS restringido al dominio real en producción (no `*`)
- `.env` real nunca subido — solo `.env.example`

## Unresolved Questions (resueltas en `/ck:plan validate`)
- ~~Acceso SSH~~ → Confirmado: solo File Manager/panel web, sin SSH. Deploy es 100% manual (subir dist + node_modules pre-instalado), no hay push-to-deploy automático por ahora — mejora futura si el plan de hosting cambia
- ~~Versión de Node~~ → Confirmado: Node 20.x LTS, ya fijado en Fase 2

## Next Steps
- Demo lista para cliente
- Documentar en `README.md` del repo el proceso de deploy para repetirlo en updates futuros
- Fase 2 futura (fuera de este plan): auth, watchlist, MySQL, posible migración a VPS si el tráfico crece
