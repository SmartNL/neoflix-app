import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { applySpaFallback } from './spa-fallback.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  applySpaFallback(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
