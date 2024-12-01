import { NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  try {
    // Search for the movie
    const searchResponse = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`)
    const searchData = await searchResponse.json()

    if (searchData.results.length === 0) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
    }

    const movieId = searchData.results[0].id

    // Fetch movie details including videos
    const detailsResponse = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos`)
    const movieDetails = await detailsResponse.json()

    return NextResponse.json({
      id: movieDetails.id,
      title: movieDetails.title,
      poster_path: movieDetails.poster_path,
      backdrop_path: movieDetails.backdrop_path,
      videos: movieDetails.videos.results,
    })
  } catch (error) {
    console.error('Error fetching TMDB data:', error)
    return NextResponse.json({ error: 'Failed to fetch movie data' }, { status: 500 })
  }
}
