import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Movie } from '../types/movie'
import { MovieCard } from './MovieCard'

const baseMovie: Movie = {
  id: 1,
  title: 'The Matrix',
  poster_path: '/poster.jpg',
  overview: '',
  release_date: '1999-03-31',
  vote_average: 8.2,
}

function renderCard(movie: Movie) {
  return render(
    <MemoryRouter>
      <MovieCard movie={movie} />
    </MemoryRouter>,
  )
}

describe('MovieCard', () => {
  it('renderiza título y poster cuando recibe movie prop', () => {
    renderCard(baseMovie)
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.src).toContain('/poster.jpg')
  })

  it('renderiza placeholder cuando poster_path es null', () => {
    renderCard({ ...baseMovie, poster_path: null })
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.src).toContain('placeholder')
  })
})
