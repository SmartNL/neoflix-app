import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MoviesService } from './movies.service';

@Controller('api/movies')
@Throttle({ default: { limit: 20, ttl: 60000 } })
export class MoviesController {
  constructor(private readonly movies: MoviesService) {}

  @Get('trending')
  getTrending() {
    return this.movies.getTrending();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.movies.search(query ?? '');
  }

  @Get(':id')
  getMovieDetail(@Param('id', ParseIntPipe) id: number) {
    return this.movies.getMovieDetail(id);
  }
}
