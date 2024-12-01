'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface ViewingHistory {
  UserID: number
  MovieID: number
  WatchedDuration: number
  Status: string
  Title: string
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

interface ViewingHistoryWithTMDB extends ViewingHistory {
  tmdbData: TMDBMovie | null
}

async function getTMDBData(title: string): Promise<TMDBMovie> {
  const res = await fetch(`/api/tmdb?title=${encodeURIComponent(title)}`)
  if (!res.ok) {
    throw new Error('Failed to fetch TMDB data')
  }
  return res.json()
}

export default function ViewingHistory() {
  const [history, setHistory] = useState<ViewingHistoryWithTMDB[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<ViewingHistoryWithTMDB | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/mysql/viewing')
        if (!res.ok) throw new Error('Failed to fetch viewing history')
        const data = await res.json()

        const loggedInUser = localStorage.getItem('user')
        if (loggedInUser) {
          const user = JSON.parse(loggedInUser)
          const filteredHistory = data.filter((entry: ViewingHistory) => entry.UserID === user.UserID)
          
          const historyWithTMDB = await Promise.all(
            filteredHistory.map(async (entry: ViewingHistory) => {
              try {
                const tmdbData = await getTMDBData(entry.Title)
                return { ...entry, tmdbData }
              } catch (error) {
                console.error(`Error fetching TMDB data for ${entry.Title}:`, error)
                return { ...entry, tmdbData: null }
              }
            })
          )
          
          setHistory(historyWithTMDB)
        }
      } catch (err) {
        setError((err as Error).message)
      }
    }

    fetchHistory()
  }, [])

  const handleMovieClick = (movie: ViewingHistoryWithTMDB) => {
    setSelectedMovie(movie)
  }

  const getTrailerKey = (movie: ViewingHistoryWithTMDB) => {
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
      <h2 className="text-2xl font-bold mb-4">Viewing History</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        history.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {history.map((entry) => (
              <div 
                key={entry.MovieID} 
                className="flex-shrink-0 cursor-pointer"
                onClick={() => handleMovieClick(entry)}
              >
                <Image
                  src={entry.tmdbData?.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${entry.tmdbData.poster_path}`
                    : "/placeholder.svg?height=300&width=200"}
                  alt={entry.Title}
                  width={200}
                  height={300}
                  className="rounded-md transition-transform duration-300 hover:scale-105"
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-bold">{entry.Title}</p>
                  <p className="text-sm">
                    Watched: {entry.WatchedDuration}/{entry.Duration} min
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      entry.Status === 'Completed' ? 'text-green-500' : 'text-yellow-500'
                    }`}
                  >
                    {entry.Status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No viewing history available for this user.</p>
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
                <p className="mt-4">{selectedMovie.tmdbData?.overview}</p>
                <p>Duration: {selectedMovie.Duration} min</p>
                <p>Watched: {selectedMovie.WatchedDuration} min</p>
                <p>Status: {selectedMovie.Status}</p>
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

