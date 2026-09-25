import { useEffect, useRef, useState } from 'react'

const DEBOUNCE_MS = 300

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [value, setValue] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => onSearch(value), DEBOUNCE_MS)
    return () => clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <input
      type="text"
      role="textbox"
      placeholder="Buscar peliculas..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="search-bar"
    />
  )
}
