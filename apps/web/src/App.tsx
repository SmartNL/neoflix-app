import { Suspense, lazy } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Loader } from './components/Loader'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const SearchPage = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })))
const MovieDetailPage = lazy(() =>
  import('./pages/MovieDetailPage').then((m) => ({ default: m.MovieDetailPage })),
)

function App() {
  return (
    <>
      <nav className="app-nav">
        <Link to="/">neoflix</Link>
        <Link to="/search">Buscar</Link>
      </nav>
      <main>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  )
}

export default App
