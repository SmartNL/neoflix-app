# Fase 1: Setup Repo + Git Workflow Avanzado

## Contexto
[plan.md](./plan.md) | Brainstorm: `../reports/brainstorm-260924-1725-filmflix-nestjs-react-hostinger.md`

## Overview
- Prioridad: CRÍTICA (bloquea todo lo demás)
- Estado: Pending
- Crear repositorio nuevo (GitHub) separado del toolkit actual, con protección de ramas y automatización de reglas de rewrite para SPA.

## Key Insights
- `main` NO debe aceptar push directo ni siquiera del owner — solo merge vía PR desde `develop`
- `develop` es la única rama que puede mergear a `main`
- `feature/*` nace de `develop`, nunca de `main`
- Rewrite rules (`.htaccess`) deben vivir versionadas en el repo, no configuradas manualmente en cada deploy — así "automático" significa: el archivo se copia con el build, no se re-escribe a mano en hPanel cada vez

## Requirements

### Funcionales
- Repo GitHub nuevo: `neoflix-app` (o nombre que el usuario prefiera)
- Rama `main` protegida: require PR, require 1+ approval, no direct push (incluso admin)
- Rama `develop` protegida: require PR, require 1+ approval
- `.gitignore` para monorepo Node (node_modules, dist, .env, build)
- Conventional Commits enforced vía **Husky** (versionado en package.json, se instala automático en `npm install`), SIN co-authored-by (hallazgo de red-team: hooks manuales en `.git/hooks/` no sobreviven a un clone nuevo)

### No Funcionales
- Setup debe ser reproducible (script, no pasos manuales sueltos)
- Reglas de rewrite documentadas y versionadas junto al código del frontend

## Architecture

```
GitHub: neoflix-app
├── main        (protected, PR-only desde develop)
└── develop     (protected, PR-only desde feature/*)
     └── feature/*  (trabajo diario)
```

## Related Code Files
**Crear:**
- `.gitignore`
- `.editorconfig`
- `.github/pull_request_template.md`
- `.husky/commit-msg` (versionado, valida Conventional Commits, rechaza si detecta "Co-Authored-By")
- `apps/web/public/.htaccess` (rewrite rules SPA — contenido definido en Fase 4/5, placeholder aquí)
- `README.md`

## Implementation Steps

1. Usuario crea repo vacío en GitHub: `neoflix-app` (público o privado según prefiera)
2. Clonar localmente, inicializar rama `main` con commit inicial (README, .gitignore, LICENSE si aplica) — **ORDEN CRÍTICO** (hallazgo red-team): este primer commit y push a `main` DEBE hacerse ANTES de activar branch protection, porque una vez activa nadie (ni admin) puede pushear directo. Es la única excepción permitida.
3. Inmediatamente después del primer commit, activar branch protection en GitHub (Settings → Branches):
   - `main`: Require PR before merging, Require approvals (1), Do not allow bypassing (include admins), Restrict who can push (nadie — solo vía PR)
   - `develop`: crear rama desde `main`, pushear, luego proteger igual con Require approvals (1)
4. Instalar Husky: `npm install -D husky`, `npx husky init` (crea `.husky/` versionado, agrega script `prepare` en `package.json` para auto-instalar en cada `npm install`)
5. Crear `.husky/commit-msg` que:
   - Valida formato `type(scope?): description` (types: feat, fix, docs, refactor, chore, test)
   - Rechaza el commit si el mensaje contiene "Co-Authored-By" o "Co-authored-by"
6. Documentar workflow en `README.md` sección "Git Workflow": diagrama de ramas, cómo crear feature branch, cómo hacer PR
7. Crear `.github/pull_request_template.md` con checklist básico (tests pasan, sin secrets, conventional commit)

## Todo List
- [ ] Repo GitHub creado
- [ ] `main` y `develop` existen y están protegidas
- [ ] `commit-msg` hook instalado y probado (rechaza mensaje sin formato, rechaza co-author)
- [ ] `.gitignore` cubre node_modules, dist, .env
- [ ] README documenta el workflow con diagrama

## Success Criteria
- Intento de `git push` directo a `main` es rechazado por GitHub
- Commit con mensaje mal formado es rechazado localmente antes de llegar a GitHub
- Commit con "Co-Authored-By" es rechazado localmente

## Risk Assessment
- Riesgo: usuario olvida que main está protegida y se frustra al no poder pushear directo → mitigar documentando claramente en README desde el día 1
- Riesgo mitigado (era Fallo #1 de red-team): Husky versiona el hook en `package.json`/`.husky/`, se auto-instala en `npm install` — ya no depende de que cada developer corra un script manualmente

## Security Considerations
- `.env` nunca commiteado (verificar `.gitignore` desde el primer commit)
- `.env.example` sí se commitea, con placeholders, para documentar variables requeridas (TMDB_API_KEY, DB_HOST, etc — definidas en Fase 3)

## Next Steps
→ Fase 2: Setup monorepo (NestJS + React) sobre esta base de repo
