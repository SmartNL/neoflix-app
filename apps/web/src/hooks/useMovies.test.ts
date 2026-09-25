import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { api } from '../services/api'
import { useFetch } from './useMovies'

vi.mock('../services/api', () => ({
  api: { get: vi.fn() },
}))

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve loading=true inicialmente, luego data cuando resuelve', async () => {
    ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { results: ['a'] },
    })

    const { result } = renderHook(() => useFetch('/movies/trending'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual({ results: ['a'] })
    expect(result.current.error).toBeNull()
  })

  it('devuelve error cuando la request falla', async () => {
    ;(api.get as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('network fail'),
    )

    const { result } = renderHook(() => useFetch('/movies/trending'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).not.toBeNull()
    expect(result.current.data).toBeNull()
  })
})
