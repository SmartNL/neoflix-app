import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { applySpaFallback } from '../src/spa-fallback.middleware';

describe('SPA fallback (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    applySpaFallback(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /movie/123 (ruta SPA no-API) devuelve 200 con HTML', async () => {
    const res = await request(app.getHttpServer()).get('/movie/123');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('GET /api/movies/trending sigue devolviendo JSON (no interceptado por catch-all)', async () => {
    const res = await request(app.getHttpServer()).get('/api/movies/trending');
    expect(res.headers['content-type']).toContain('application/json');
  });

  it('GET / devuelve HTML (home de la SPA)', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });
});
