export interface Movie {
  id: number
  title: string
  poster_path: string | null
  overview: string
  release_date: string
  vote_average: number
}

export interface MovieListResponse {
  page: number
  results: Movie[]
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface Video {
  key: string
  site: string
  type: string
}

export interface MovieDetail extends Movie {
  runtime: number
  genres: { id: number; name: string }[]
  credits: { cast: Cast[] }
  videos: { results: Video[] }
}
