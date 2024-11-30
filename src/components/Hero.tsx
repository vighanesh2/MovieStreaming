import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Play, Info } from 'lucide-react'

interface Movie {
  MovieID: number;
  Title: string;
  Genre: string;
  ReleaseDate: string;
  Rating: number;
  Description: string;
  Duration: number;
}

async function getRandomMovie(): Promise<Movie> {
  const res = await fetch('http://localhost:3000/api/mysql/random-movies', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch random movie');
  }
  return res.json();
}

export default async function Hero() {
  const movie = await getRandomMovie();

  return (
    <div className="relative h-[80vh] w-full">
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt={movie.Title}
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute bottom-1/4 left-8 max-w-xl">
        <h1 className="mb-4 text-5xl font-bold">{movie.Title}</h1>
        <p className="mb-6 text-lg">
          {movie.Description}
        </p>
        <div className="flex space-x-4">
          <Button size="lg">
            <Play className="mr-2 h-5 w-5" /> Play
          </Button>
          <Button variant="outline" size="lg" className="text-gray-500">
  <Info className="mr-2 h-5 w-5" /> More Info
</Button>
        </div>
      </div>
    </div>
  )
}

