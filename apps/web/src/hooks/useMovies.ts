import { useEffect, useState } from 'react'
import { api } from '../services/api'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(path: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: !!path,
    error: null,
  })

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null })
      return
    }

    let cancelled = false
    setState({ data: null, loading: true, error: null })

    api
      .get<T>(path)
      .then((res) => {
        if (!cancelled) setState({ data: res.data, loading: false, error: null })
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: err })
      })

    return () => {
      cancelled = true
    }
  }, [path])

  return state
}
