import type { Movie } from '../types/movie'
import { MovieCard } from './MovieCard'

export function MovieGrid({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return <p className="movie-grid__empty">Sin resultados</p>
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
