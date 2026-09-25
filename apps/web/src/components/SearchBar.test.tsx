import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('no dispara onSearch hasta pasar el debounce (300ms)', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'matrix' },
    })

    expect(onSearch).not.toHaveBeenCalledWith('matrix')

    vi.advanceTimersByTime(300)

    expect(onSearch).toHaveBeenCalledWith('matrix')
  })
})
