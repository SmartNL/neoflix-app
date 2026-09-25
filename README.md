# neoflix

FilmFlix mejorada: NestJS + React + TMDB API.

## Stack
- **Backend:** NestJS + TypeScript
- **Frontend:** React + Vite + TypeScript
- **Datos:** TMDB API
- **Deploy:** Hostinger hPanel (Node.js App, shared hosting)

## Estructura
```
apps/
├── api/   # NestJS backend
└── web/   # React frontend
```

## Documentación
Plan de arquitectura completo: [docs/architecture-plan/plan.md](./docs/architecture-plan/plan.md)

## Git Workflow

```
main (protegida, solo PR desde develop)
  └── develop (protegida, solo PR desde feature/*)
        └── feature/*, bugfix/*
```

- **`main`**: intocable, nunca push directo, ni admins. Solo merge vía Pull Request desde `develop`.
- **`develop`**: rama de integración. Todas las features mergean aquí primero.
- **`feature/ISSUE-desc`**: rama de trabajo, nace de `develop`.

### Crear una feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/descripcion-corta
# ...trabajo...
git push -u origin feature/descripcion-corta
# Crear PR: feature/* → develop
```

### Commits
Conventional Commits, sin `Co-Authored-By`. Validado automáticamente por Husky (`.husky/commit-msg`).

```
feat(api): add trending movies endpoint
fix(web): correct search debounce timing
docs: update architecture plan
```

## Desarrollo Local
```bash
npm install
npm run dev      # levanta api (puerto 3000) + web (puerto 5173)
npm run build     # build de producción de ambas apps
```

## Variables de Entorno
Ver `apps/api/.env.example`. Nunca commitear `.env` real.
