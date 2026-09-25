import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosHeaders } from 'axios';
import { TmdbService } from './tmdb.service';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpService: { get: jest.Mock };

  beforeEach(async () => {
    httpService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmdbService,
        { provide: HttpService, useValue: httpService },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              ({
                TMDB_BEARER_TOKEN: 'test-token',
                TMDB_BASE_URL: 'https://api.themoviedb.org/3',
              })[key],
          },
        },
      ],
    }).compile();

    service = module.get<TmdbService>(TmdbService);
  });

  it('getTrending() devuelve datos mapeados cuando TMDB responde 200', async () => {
    httpService.get.mockReturnValue(
      of({ data: { results: [{ id: 1, title: 'Movie' }] } }),
    );

    const result = await service.getTrending();

    expect(result).toEqual({ results: [{ id: 1, title: 'Movie' }] });
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('/trending/movie/week'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer test-token' },
      }),
    );
  });

  it('getTrending() lanza HttpException(502) cuando TMDB responde error', async () => {
    const axiosError = new AxiosError(
      'Request failed',
      '500',
      undefined,
      undefined,
      {
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: { headers: new AxiosHeaders() },
      },
    );
    httpService.get.mockReturnValue(throwError(() => axiosError));

    await expect(service.getTrending()).rejects.toThrow(HttpException);
    await expect(service.getTrending()).rejects.toMatchObject({
      status: 502,
    });
  });

  it('search(query) codifica el query en la URL', async () => {
    httpService.get.mockReturnValue(of({ data: { results: [] } }));

    await service.search('the matrix');

    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('the matrix')),
      expect.anything(),
    );
  });

  it('getMovieDetail(id) construye la URL con el id correcto', async () => {
    httpService.get.mockReturnValue(of({ data: { id: 42 } }));

    await service.getMovieDetail(42);

    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('/movie/42'),
      expect.anything(),
    );
  });
});
