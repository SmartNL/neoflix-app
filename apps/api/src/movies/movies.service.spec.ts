import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MoviesService } from './movies.service';
import { TmdbService } from '../tmdb/tmdb.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let tmdbService: { getTrending: jest.Mock };
  let cacheStore: Map<string, unknown>;

  beforeEach(async () => {
    cacheStore = new Map();
    tmdbService = {
      getTrending: jest.fn().mockResolvedValue({ results: ['movie1'] }),
    };

    const cacheManagerMock = {
      get: jest.fn((key: string) => Promise.resolve(cacheStore.get(key))),
      set: jest.fn((key: string, value: unknown) => {
        cacheStore.set(key, value);
        return Promise.resolve();
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: TmdbService, useValue: tmdbService },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('getTrending() usa cache en la segunda llamada (no vuelve a golpear TMDB)', async () => {
    await service.getTrending();
    await service.getTrending();

    expect(tmdbService.getTrending).toHaveBeenCalledTimes(1);
  });

  it('getTrending() devuelve el mismo shape de datos que TmdbService', async () => {
    const result = await service.getTrending();
    expect(result).toEqual({ results: ['movie1'] });
  });
});
