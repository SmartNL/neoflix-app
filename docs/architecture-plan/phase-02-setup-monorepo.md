# Fase 2: Setup Monorepo (NestJS + React)

## Contexto
[plan.md](./plan.md) | Depende de: Fase 1

## Overview
- Prioridad: Alta
- Estado: Pending
- Crear estructura npm workspaces con `apps/api` (NestJS) y `apps/web` (React+Vite)

## Key Insights
- Un solo `package.json` raíz con workspaces evita duplicar `node_modules` y simplifica el build para Passenger (1 solo `npm install` en el servidor)
- NestJS CLI genera estructura estándar — no reinventar
- Vite + React + TypeScript template oficial, sin CRA (deprecado)

## Requirements
- Node version fijada en `engines` de package.json: **Node 20.x LTS** (confirmado por el usuario en hPanel → Advanced → Node.js, validado en fase de `/ck:plan validate`)
- TypeScript strict mode en ambas apps
- Scripts raíz: `npm run dev` (concurrently corre api+web), `npm run build` (build ambos), `npm run build:web`, `npm run build:api`

## Architecture
```
neoflix-app/
├── package.json          # workspaces: ["apps/*"]
├── apps/
│   ├── api/               # NestJS
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                # React + Vite
│       ├── src/
│       │   ├── main.tsx
│       │   └── App.tsx
│       ├── package.json
│       └── vite.config.ts
```

## Related Code Files
**Crear:**
- `package.json` (raíz, workspaces config)
- `apps/api/*` (vía `nest new api` dentro de `apps/`)
- `apps/web/*` (vía `npm create vite@latest web -- --template react-ts`)
- `.nvmrc` (fija versión Node exacta — pendiente confirmar con hPanel)

## Implementation Steps
1. En raíz del repo: `npm init -y`, editar `package.json` → agregar `"workspaces": ["apps/*"]`, `"private": true`
2. Instalar NestJS CLI global o usar `npx`: `npx @nestjs/cli new apps/api --package-manager npm --skip-git`
3. Crear frontend: `npm create vite@latest apps/web -- --template react-ts`
4. Ajustar `apps/api/package.json` name → `@neoflix/api`, `apps/web/package.json` name → `@neoflix/web`
5. Desde raíz: `npm install` (hidrata ambos workspaces)
6. Agregar scripts raíz en `package.json`:
   ```json
   "scripts": {
     "dev": "concurrently \"npm run start:dev -w @neoflix/api\" \"npm run dev -w @neoflix/web\"",
     "build": "npm run build -w @neoflix/web && npm run build -w @neoflix/api",
     "build:web": "npm run build -w @neoflix/web",
     "build:api": "npm run build -w @neoflix/api"
   }
   ```
7. Instalar `concurrently` como devDependency raíz
8. Verificar `npm run dev` levanta ambos (api puerto 3000, web puerto 5173) sin conflicto
9. Crear `.nvmrc` con contenido `20` y `"engines": { "node": ">=20 <21" }` en `package.json` raíz

## Todo List
- [ ] `package.json` raíz con workspaces configurado
- [ ] `apps/api` generado con NestJS CLI, corre con `npm run start:dev`
- [ ] `apps/web` generado con Vite+React+TS, corre con `npm run dev`
- [ ] Scripts raíz (`dev`, `build`) funcionan
- [ ] `.nvmrc` creado (versión pendiente de confirmar en Fase 6)

## Success Criteria
- `npm run dev` desde raíz levanta ambas apps sin error
- `npm run build` desde raíz genera `apps/api/dist` y `apps/web/dist` sin error

## Risk Assessment
- Riesgo: versión de Node local del developer difiere de hPanel → `.nvmrc` mitiga, pero validar en Fase 6 antes de asumir compatibilidad
- Riesgo: nombres de workspace con `@neoflix/` scope pueden confundir si luego se publica a npm por error → no es público, aceptable

## Next Steps
→ Fase 3 (backend) y Fase 4 (frontend) en paralelo
