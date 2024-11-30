'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Recommendation {
  UserID: number
  MovieID: number
  Reason: string
  Title: string // Assuming Movie Title is part of the recommendation data
}

export default function UserRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/mysql/recommendations')
        if (!res.ok) throw new Error('Failed to fetch recommendations')
        const data = await res.json()

        // Get the logged-in user's ID from localStorage
        const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}')
        const userId = loggedInUser.UserID

        // Filter recommendations for the logged-in user
        const userRecommendations = data.filter((rec: Recommendation) => rec.UserID === userId)
        setRecommendations(userRecommendations)
      } catch (err) {
        setError((err as Error).message)
      }
    }

    fetchRecommendations()
  }, [])

  return (
    <section className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-4">Your Recommendations</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        recommendations.length > 0 ? (
          <div className="flex flex-wrap space-x-4">
            {recommendations.map((rec) => (
              <div key={rec.MovieID} className="flex-shrink-0 mb-4">
                <Image
                  src="/placeholder.svg?height=400&width=300"
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
    </section>
  )
}
