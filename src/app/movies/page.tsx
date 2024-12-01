'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Play, Info } from 'lucide-react'
import Header from '@/components/Header'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

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
  overview: string
  videos: {
    results: {
      type: string
      key: string
    }[]
  }
}

interface MovieWithTMDB extends Movie {
  tmdbData: TMDBMovie | null
}

async function getTMDBData(title: string): Promise<TMDBMovie> {
  const res = await fetch(`/api/tmdb?title=${encodeURIComponent(title)}`)
  if (!res.ok) {
    throw new Error('Failed to fetch TMDB data')
  }
  return res.json()
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieWithTMDB[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<MovieWithTMDB | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/mysql/movies')
        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }
        const data: Movie[] = await response.json()
        
        const moviesWithTMDB = await Promise.all(
          data.map(async (movie) => {
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
      } catch (err) {
        setError('An error occurred while fetching movies')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const handleMoreInfo = (movie: MovieWithTMDB) => {
    setSelectedMovie(movie)
  }

  const getTrailerKey = (movie: MovieWithTMDB) => {
    if (movie.tmdbData?.videos?.results) {
      const trailer = movie.tmdbData.videos.results.find(
        (video) => video.type === 'Trailer'
      )
      return trailer ? trailer.key : null
    }
    return null
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading movies...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-white">{error}</div>
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <Header />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Movies</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <div key={movie.MovieID} className="relative h-[50vh] rounded-lg overflow-hidden group">
              <Image
                src={movie.tmdbData?.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${movie.tmdbData.backdrop_path}`
                  : "/placeholder.svg?height=720&width=1280"}
                alt={movie.Title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h2 className="text-2xl font-bold mb-2 text-white">{movie.Title}</h2>
                <p className="text-sm mb-2 text-white">{movie.Genre} | {new Date(movie.ReleaseDate).getFullYear()} | {movie.Duration} min</p>
                <p className="text-sm mb-4 line-clamp-3 text-white">{movie.tmdbData?.overview || movie.Description}</p>
                <div className="flex space-x-2">
                  <Button size="sm" className="text-white">
                    <Play className="mr-2 h-4 w-4" /> Play
                  </Button>
                  <Button variant="outline" size="sm" className="text-black" onClick={() => handleMoreInfo(movie)}>
                    <Info className="mr-2 h-4 w-4" /> More Info
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Movie Details Dialog */}
      {selectedMovie && (
        <Dialog open={Boolean(selectedMovie)} onOpenChange={() => setSelectedMovie(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedMovie.Title}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="mt-4">
                <Image
                  src={selectedMovie.tmdbData?.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${selectedMovie.tmdbData.backdrop_path}`
                    : "/placeholder.svg?height=720&width=1280"}
                  alt={selectedMovie.Title}
                  width={1280}
                  height={720}
                  className="rounded-md w-full"
                />
              </div>
              <div className="mt-4 space-y-2">
                <p>{selectedMovie.tmdbData?.overview || selectedMovie.Description}</p>
                <p>Genre: {selectedMovie.Genre}</p>
                <p>Release Date: {new Date(selectedMovie.ReleaseDate).toLocaleDateString()}</p>
                <p>Duration: {selectedMovie.Duration} minutes</p>
                <p>Rating: {selectedMovie.Rating}/10</p>
              </div>
              {getTrailerKey(selectedMovie) && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getTrailerKey(selectedMovie)}`}
                      title={`${selectedMovie.Title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

