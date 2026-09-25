import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TmdbService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private get baseUrl(): string {
    return this.config.get<string>('TMDB_BASE_URL')!;
  }

  private get authHeaders() {
    return {
      headers: { Authorization: `Bearer ${this.config.get<string>('TMDB_BEARER_TOKEN')}` },
    };
  }

  private async request<T>(path: string): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.http.get<T>(`${this.baseUrl}${path}`, this.authHeaders),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        `TMDB request failed: ${axiosError.message}`,
        502,
      );
    }
  }

  getTrending() {
    return this.request<{ results: unknown[] }>('/trending/movie/week');
  }

  search(query: string) {
    return this.request<{ results: unknown[] }>(
      `/search/movie?query=${encodeURIComponent(query)}`,
    );
  }

  getMovieDetail(id: number) {
    return this.request<Record<string, unknown>>(
      `/movie/${id}?append_to_response=credits,videos`,
    );
  }
}
