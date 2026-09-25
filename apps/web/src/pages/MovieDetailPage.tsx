import { useParams } from 'react-router-dom'
import { ErrorMessage, Loader } from '../components/Loader'
import { useFetch } from '../hooks/useMovies'
import type { MovieDetail } from '../types/movie'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: movie, loading, error } = useFetch<MovieDetail>(id ? `/movies/${id}` : null)

  if (loading) return <Loader />
  if (error) return <ErrorMessage message="No se pudo cargar la pelicula." />
  if (!movie) return null

  const trailer = movie.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer')

  return (
    <article className="movie-detail">
      <div className="movie-detail__header">
        {movie.poster_path && (
          <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} />
        )}
        <div>
          <h1>{movie.title}</h1>
          <p>{movie.genres?.map((g) => g.name).join(', ')}</p>
          <p>★ {movie.vote_average.toFixed(1)} · {movie.runtime} min</p>
          <p>{movie.overview}</p>
        </div>
      </div>

      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <section>
          <h2>Reparto</h2>
          <ul className="cast-list">
            {movie.credits.cast.slice(0, 8).map((actor) => (
              <li key={actor.id}>{actor.name} como {actor.character}</li>
            ))}
          </ul>
        </section>
      )}

      {trailer && (
        <section>
          <h2>Trailer</h2>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title="Trailer"
            allowFullScreen
          />
        </section>
      )}
    </article>
  )
}
