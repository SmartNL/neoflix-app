import { useState } from 'react'
import { ErrorMessage, Loader } from '../components/Loader'
import { MovieGrid } from '../components/MovieGrid'
import { SearchBar } from '../components/SearchBar'
import { useFetch } from '../hooks/useMovies'
import type { MovieListResponse } from '../types/movie'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const path = query.trim() ? `/movies/search?q=${encodeURIComponent(query)}` : null
  const { data, loading, error } = useFetch<MovieListResponse>(path)

  return (
    <section>
      <h1>Buscar</h1>
      <SearchBar onSearch={setQuery} />
      {loading && <Loader />}
      {error && <ErrorMessage message="Error al buscar." />}
      {!loading && !error && path && <MovieGrid movies={data?.results ?? []} />}
    </section>
  )
}
