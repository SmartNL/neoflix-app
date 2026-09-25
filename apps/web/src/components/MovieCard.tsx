import { Link } from 'react-router-dom'
import type { Movie } from '../types/movie'

const IMG_BASE = 'https://image.tmdb.org/t/p/w342'
const PLACEHOLDER = '/placeholder-poster.svg'

export function MovieCard({ movie }: { movie: Movie }) {
  const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : PLACEHOLDER

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img src={poster} alt={movie.title} loading="lazy" />
      <div className="movie-card__info">
        <h3>{movie.title}</h3>
        <span className="movie-card__rating">★ {movie.vote_average.toFixed(1)}</span>
      </div>
    </Link>
  )
}
