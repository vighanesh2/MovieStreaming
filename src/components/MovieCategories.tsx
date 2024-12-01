'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import SignInForm from './Signin'
import { Button } from '@/components/ui/button'

interface Movie {
  MovieID: number
  Title: string
  Genre: string
  ReleaseDate: string
  Rating: number
  Description: string
  Duration: number
}

interface TMDBMovie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  videos: {
    type: string
    key: string
  }[]
}

interface User {
  UserID: number
  Name: string
  Email: string
  SubscriptionID: number
}

interface MovieWithTMDB extends Movie {
  tmdbData: TMDBMovie | null
}

async function getMovies(): Promise<Movie[]> {
  const res = await fetch('/api/mysql/movies', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch movies')
  }
  return res.json()
}

async function getTMDBData(title: string): Promise<TMDBMovie> {
  const res = await fetch(`/api/tmdb?title=${encodeURIComponent(title)}`)
  if (!res.ok) {
    throw new Error('Failed to fetch TMDB data')
  }
  return res.json()
}

export default function MovieCategories() {
  const [movies, setMovies] = useState<MovieWithTMDB[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<MovieWithTMDB | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    async function fetchMoviesAndTMDBData() {
      const moviesData = await getMovies()
      const moviesWithTMDB = await Promise.all(
        moviesData.map(async (movie) => {
          try {
            const tmdbData = await getTMDBData(movie.Title)
            return { ...movie, tmdbData }
          } catch (error) {
            console.error(`Error fetching TMDB data for ${movie.Title}:`, error)
            return { ...movie, tmdbData: null }
          }
        })
      )
      setMovies(moviesWithTMDB)
    }
    fetchMoviesAndTMDBData()
  }, [])

  const handleMovieClick = (movie: MovieWithTMDB) => {
    setSelectedMovie(movie)
  }

  const handleLoginSuccess = () => {
    setUser(JSON.parse(localStorage.getItem('user') || '{}'))
    setIsDialogOpen(false)
  }

  const categories = movies.reduce((acc, movie) => {
    if (!acc[movie.Genre]) {
      acc[movie.Genre] = []
    }
    acc[movie.Genre].push(movie)
    return acc
  }, {} as Record<string, MovieWithTMDB[]>)

  return (
    <section className="container mx-auto py-16">
      {Object.entries(categories).map(([genre, movies]) => (
        <div key={genre} className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{genre}</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {movies.map((movie) => (
              <div
                key={movie.MovieID}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => handleMovieClick(movie)}
              >
                <Image
                  src={movie.tmdbData?.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${movie.tmdbData.poster_path}`
                    : "/placeholder.svg?height=300&width=200"}
                  alt={movie.Title}
                  width={200}
                  height={300}
                  className="rounded-md transition-transform duration-300 hover:scale-105"
                />
                <p className="mt-2 text-center text-sm">{movie.Title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Sign In Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Sign In</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in to access additional features.
            </DialogDescription>
          </DialogHeader>
          <SignInForm onLoginSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>

      {/* Movie Details Popup */}
      {selectedMovie && (
        <Dialog open={Boolean(selectedMovie)} onOpenChange={() => setSelectedMovie(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedMovie.Title}</DialogTitle>
              <DialogDescription>
                <div className="mt-4">
                  <Image
                    src={selectedMovie.tmdbData?.backdrop_path
                      ? `https://image.tmdb.org/t/p/w500${selectedMovie.tmdbData.backdrop_path}`
                      : "/placeholder.svg?height=281&width=500"}
                    alt={selectedMovie.Title}
                    width={500}
                    height={281}
                    className="rounded-md"
                  />
                </div>
                <p className="mt-4">{selectedMovie.Description}</p>
                <p>Duration: {selectedMovie.Duration} min</p>
                <p>Rating: {selectedMovie.Rating}/10</p>
                {selectedMovie.tmdbData?.videos && selectedMovie.tmdbData.videos.length > 0 && (                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${selectedMovie.tmdbData.videos[0].key}`}
                      title={`${selectedMovie.Title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                {!user && (
                  <div className="mt-4">
                    <p>Sign in to access more features!</p>
                    <Button onClick={() => setIsDialogOpen(true)} className="mt-2">
                      Sign In
                    </Button>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}

