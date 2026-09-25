import { ErrorMessage, Loader } from '../components/Loader'
import { MovieGrid } from '../components/MovieGrid'
import { useFetch } from '../hooks/useMovies'
import type { MovieListResponse } from '../types/movie'

export function HomePage() {
  const { data, loading, error } = useFetch<MovieListResponse>('/movies/trending')

  if (loading) return <Loader />
  if (error) return <ErrorMessage message="No se pudieron cargar las peliculas." />

  return (
    <section>
      <h1>Tendencias</h1>
      <MovieGrid movies={data?.results ?? []} />
    </section>
  )
}
