'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Play, Info, Volume2, VolumeX, Pause } from 'lucide-react'

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

async function getRandomMovie(): Promise<Movie> {
  const res = await fetch('/api/mysql/random-movies', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch random movie')
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

export default function Hero() {
  const [movie, setMovie] = useState<MovieWithTMDB | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieData = await getRandomMovie()
        const tmdbData = await getTMDBData(movieData.Title)
        setMovie({ ...movieData, tmdbData })
      } catch (error) {
        console.error('Error fetching movie data:', error)
      }
    }

    fetchMovieData()
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const getTrailerKey = () => {
    if (movie?.tmdbData?.videos?.results) {
      const trailer = movie.tmdbData.videos.results.find(
        (video) => video.type === 'Trailer'
      )
      return trailer ? trailer.key : null
    }
    return null
  }

  if (!movie) {
    return <div>Loading...</div>
  }

  const trailerKey = getTrailerKey()

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {trailerKey ? (
        <div className="absolute inset-0">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=0&mute=${isMuted ? 1 : 0}&loop=1&playlist=${trailerKey}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      ) : (
        <Image
          src={movie.tmdbData?.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.tmdbData.backdrop_path}`
            : "/placeholder.svg?height=1080&width=1920"}
          alt={movie.Title}
          layout="fill"
          objectFit="cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute bottom-1/4 left-8 max-w-xl">
        <h1 className="mb-4 text-5xl font-bold text-white">{movie.Title}</h1>
        <p className="mb-6 text-lg text-white">
          {movie.tmdbData?.overview || movie.Description}
        </p>
        <div className="flex space-x-4">
          <Button size="lg">
            <Play className="mr-2 h-5 w-5" /> Play
          </Button>
          <Button variant="outline" size="lg" >
          <Info className="mr-2 h-5 w-5 text-black" /> <span className="text-black">More Information</span>
          </Button>
        </div>
      </div>
      {trailerKey && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button variant="outline" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button variant="outline" size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
        </div>
      )}
    </div>
  )
}

