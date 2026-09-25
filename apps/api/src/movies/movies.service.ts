import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { TmdbService } from '../tmdb/tmdb.service';

const TTL_TRENDING_MS = 60 * 60 * 1000; // 1h
const TTL_SEARCH_MS = 10 * 60 * 1000; // 10min
const TTL_DETAIL_MS = 60 * 60 * 1000; // 1h

@Injectable()
export class MoviesService {
  constructor(
    private readonly tmdb: TmdbService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private async withCache<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.cache.get<T>(key);
    if (cached !== undefined && cached !== null) {
      return cached;
    }
    const fresh = await fetcher();
    await this.cache.set(key, fresh, ttl);
    return fresh;
  }

  getTrending() {
    return this.withCache('movies:trending', TTL_TRENDING_MS, () =>
      this.tmdb.getTrending(),
    );
  }

  search(query: string) {
    return this.withCache(`movies:search:${query}`, TTL_SEARCH_MS, () =>
      this.tmdb.search(query),
    );
  }

  getMovieDetail(id: number) {
    return this.withCache(`movies:detail:${id}`, TTL_DETAIL_MS, () =>
      this.tmdb.getMovieDetail(id),
    );
  }
}
