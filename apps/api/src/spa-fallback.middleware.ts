import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// Fallback SPA como middleware Express directo: no depende de la sintaxis
// de rutas @Get() de Nest, que cambia entre versiones de Express (ver
// red-team review, fase 5). Debe registrarse DESPUES de app.init()/create()
// para ejecutarse solo cuando ninguna otra ruta/estatico matcheo.
export function applySpaFallback(app: NestExpressApplication) {
  const config = app.get(ConfigService);
  const webDistPath =
    config.get<string>('WEB_DIST_PATH') ??
    join(__dirname, '..', '..', 'web', 'dist');

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(join(webDistPath, 'index.html'));
  });
}
