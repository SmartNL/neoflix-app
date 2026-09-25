import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { applySpaFallback } from '../src/spa-fallback.middleware';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    applySpaFallback(app);
    await app.init();
  });

  it('/ (GET) devuelve la SPA de React', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
