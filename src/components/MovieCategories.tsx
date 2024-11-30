import Image from 'next/image'

interface Movie {
  MovieID: number;
  Title: string;
  Genre: string;
  ReleaseDate: string;
  Rating: number;
  Description: string;
  Duration: number;
}

async function getMovies(): Promise<Movie[]> {
  const res = await fetch('http://localhost:3000/api/mysql/movies', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }
  return res.json();
}

export default async function MovieCategories() {
  const movies = await getMovies();

  const categories = movies.reduce((acc, movie) => {
    if (!acc[movie.Genre]) {
      acc[movie.Genre] = [];
    }
    acc[movie.Genre].push(movie);
    return acc;
  }, {} as Record<string, Movie[]>);

  return (
    <section className="container mx-auto py-16">
      {Object.entries(categories).map(([genre, movies]) => (
        <div key={genre} className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">{genre}</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {movies.map((movie) => (
              <div key={movie.MovieID} className="flex-shrink-0">
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
    </section>
  )
}

