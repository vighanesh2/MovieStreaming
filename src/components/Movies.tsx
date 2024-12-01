'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Movie {
  MovieID: number
  Title: string
  ReleaseYear: number
  Genre: string
  Director: string
  Description: string
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies')
        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }
        const data = await response.json()
        setMovies(data)
      } catch (err) {
        setError('An error occurred while fetching movies')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (isLoading) {
    return <div className="text-center mt-8">Loading movies...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto mt-20 p-4">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Card key={movie.MovieID} className="flex flex-col">
            <CardHeader>
              <CardTitle>{movie.Title}</CardTitle>
              <CardDescription>{movie.ReleaseYear} | {movie.Genre}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm">{movie.Description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Watch Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
