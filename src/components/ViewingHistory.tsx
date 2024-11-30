'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ViewingHistory {
  UserID: number
  MovieID: number
  WatchedDuration: number
  Status: string
  Title: string
  Duration: number
}

export default function ViewingHistory() {
  const [history, setHistory] = useState<ViewingHistory[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/mysql/viewing')
        if (!res.ok) throw new Error('Failed to fetch viewing history')
        const data = await res.json()

        // Get the logged-in user's ID from localStorage (or other state management solution)
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
          const user = JSON.parse(loggedInUser);
          const filteredHistory = data.filter((entry: ViewingHistory) => entry.UserID === user.UserID);
          setHistory(filteredHistory);
        }
      } catch (err) {
        setError((err as Error).message)
      }
    }

    fetchHistory()
  }, [])

  return (
    <section className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-4">Viewing History</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        history.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {history.map((entry) => (
              <div key={entry.MovieID} className="flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=400&width=300"
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
    </section>
  )
}
