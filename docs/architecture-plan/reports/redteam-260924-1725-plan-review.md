# Red Team Review: plan.md (FilmFlix NestJS+React+Hostinger)

## Veredicto: CAUTION — 3 fallos reales encontrados, 2 son fixeables ahora sin re-planificar

## Ataques y Hallazgos

### 🔴 FALLO 1 (Fase 1): Hook local `commit-msg` no sobrevive a un clone nuevo
`.git/hooks/*` NUNCA se versiona con git — es local a cada checkout. El plan dice "documentar que cada developer corre un script tras clonar" pero eso es un parche, no una solución: en la práctica se olvida y el hook deja de existir silenciosamente. Con 1-2 developers el riesgo es bajo pero real.
**Fix aplicado:** usar **Husky** (paquete npm real, se versiona en `package.json`, se instala automático vía `npm install` + hook `prepare`) en vez de hook manual. Actualizado en Fase 1.

### 🔴 FALLO 2 (Fase 1): Secuencia imposible — "nadie puede pushear a main" pero main necesita el primer commit
Si branch protection se activa ANTES de que exista el primer commit, no hay forma de inicializar `main`. El plan no especifica el orden exacto.
**Fix aplicado:** clarificado en Fase 1 — primer commit a `main` se hace ANTES de activar protection (única excepción permitida), protection se activa inmediatamente después.

### 🟡 FALLO 3 (Fase 5): El plan mismo no confía en su propia solución
La Fase 5 dice literalmente "validar comportamiento real al implementar" sobre `ServeStaticModule` — es decir, ya se sabe que puede no funcionar, pero se plantea como si fuera la solución principal. Un plan no debería apoyarse en un mecanismo cuya fiabilidad el propio autor cuestiona.
**Fix aplicado:** reemplazado el fallback ambiguo por un catch-all controller NestJS explícito (`@Get('*')` que sirve `index.html` manualmente, excluyendo `/api/*` por orden de registro de rutas) — comportamiento determinístico, no depende de opciones internas de `serve-static` que varían entre versiones.

### 🟢 Verificado, NO es fallo: diferir MySQL a Fase 2
Correcto — reduce superficie del MVP sin comprometer nada del alcance acordado.

### 🟢 Verificado, NO es fallo: orden de fases y dependencias
Fase 1→2→(3∥4)→5→6 es lógicamente correcto, sin ciclos.

### ⚠️ Riesgo aceptado sin fix (ya reconocido correctamente en el plan)
- Passenger reciclando procesos → cache inválido — deuda técnica aceptada explícitamente, no requiere fix ahora
- Compatibilidad exacta de Passenger con NestJS/workspaces — no verificable sin acceso real al panel, correctamente marcado como "unresolved question" a validar en Fase 6

## Conclusión
2 de 3 fallos son de bajo costo y se corrigen en el plan ahora mismo (no bloquean, no requieren replanificación). El tercero (Passenger real behavior) es inherentemente no verificable hasta ejecutar Fase 6 — aceptado como riesgo abierto, ya documentado.
