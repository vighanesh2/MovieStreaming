'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface Recommendation {
  UserID: number
  MovieID: number
  Reason: string
  Title: string
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

interface RecommendationWithTMDB extends Recommendation {
  tmdbData: TMDBMovie | null
}

async function getTMDBData(title: string): Promise<TMDBMovie> {
  const res = await fetch(`/api/tmdb?title=${encodeURIComponent(title)}`)
  if (!res.ok) {
    throw new Error('Failed to fetch TMDB data')
  }
  return res.json()
}

export default function UserRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendationWithTMDB[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<RecommendationWithTMDB | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/mysql/recommendations')
        if (!res.ok) throw new Error('Failed to fetch recommendations')
        const data = await res.json()

        const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}')
        const userId = loggedInUser.UserID

        const userRecommendations = data.filter((rec: Recommendation) => rec.UserID === userId)

        const recommendationsWithTMDB = await Promise.all(
          userRecommendations.map(async (rec: Recommendation) => {
            try {
              const tmdbData = await getTMDBData(rec.Title)
              return { ...rec, tmdbData }
            } catch (error) {
              console.error(`Error fetching TMDB data for ${rec.Title}:`, error)
              return { ...rec, tmdbData: null }
            }
          })
        )

        setRecommendations(recommendationsWithTMDB)
      } catch (err) {
        setError((err as Error).message)
      }
    }

    fetchRecommendations()
  }, [])

  const handleMovieClick = (movie: RecommendationWithTMDB) => {
    setSelectedMovie(movie)
  }

  const getTrailerKey = (movie: RecommendationWithTMDB) => {
    if (movie.tmdbData?.videos?.results) {
      const trailer = movie.tmdbData.videos.results.find(
        (video) => video.type === 'Trailer'
      )
      return trailer ? trailer.key : null
    }
    return null
  }

  return (
    <section className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-4">Your Recommendations</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        recommendations.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.MovieID} 
                className="flex-shrink-0 mb-4 cursor-pointer"
                onClick={() => handleMovieClick(rec)}
              >
                <Image
                  src={rec.tmdbData?.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${rec.tmdbData.poster_path}`
                    : "/placeholder.svg?height=300&width=200"}
                  alt={rec.Title}
                  width={200}
                  height={300}
                  className="rounded-md transition-transform duration-300 hover:scale-105"
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-bold">{rec.Title}</p>
                  <p className="text-sm italic text-gray-600">{rec.Reason}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recommendations available for you.</p>
        )
      )}

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
                <div className="mt-4">
                  <p>{selectedMovie.tmdbData?.overview}</p>
                </div>
                <div className="mt-2">
                  <p className="font-semibold">Recommendation Reason:</p>
                  <p className="italic">{selectedMovie.Reason}</p>
                </div>
                {getTrailerKey(selectedMovie) && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${getTrailerKey(selectedMovie)}`}
                      title={`${selectedMovie.Title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
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

