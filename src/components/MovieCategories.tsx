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

async function getMovies(): Promise<Movie[]> {
    const res = await fetch('/api/mysql/movies', { cache: 'no-store' })
    if (!res.ok) {
    throw new Error('Failed to fetch movies')
  }
  return res.json()
}

export default function MovieCategories() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [user, setUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    async function fetchMovies() {
      const moviesData = await getMovies()
      setMovies(moviesData)
    }
    fetchMovies()
  }, [])

  const handleMovieClick = (movie: Movie) => {
    if (!user) {
      setIsDialogOpen(true)  // Show sign-in dialog if not signed in
    } else {
      setSelectedMovie(movie)  // Show movie details if signed in
    }
  }

  const handleLoginSuccess = () => {
    setUser(JSON.parse(localStorage.getItem('user') || '{}'))
    setIsDialogOpen(false)  // Close the dialog
  }

  const categories = movies.reduce((acc, movie) => {
    if (!acc[movie.Genre]) {
      acc[movie.Genre] = []
    }
    acc[movie.Genre].push(movie)
    return acc
  }, {} as Record<string, Movie[]>)

  return (
    <section className="container mx-auto py-16">
      {Object.entries(categories).map(([genre, movies]) => (
        <div key={genre} className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{genre}</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {movies.map((movie) => (
              <div
                key={movie.MovieID}
                className="flex-shrink-0"
                onClick={() => handleMovieClick(movie)}
              >
                <Image
                  src="/placeholder.svg?height=400&width=300"
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
              You need to sign in to view the movie details.
            </DialogDescription>
          </DialogHeader>
          <SignInForm onLoginSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>

      {/* Movie Details Popup */}
      {selectedMovie && user && (
        <Dialog open={Boolean(selectedMovie)} onOpenChange={() => setSelectedMovie(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedMovie.Title}</DialogTitle>
              <DialogDescription>
                <p>{selectedMovie.Description}</p>
                <p>Duration: {selectedMovie.Duration} min</p>
                <p>Rating: {selectedMovie.Rating}/10</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
