import { useState, useEffect } from 'react'

interface BillingEntry {
  UserID: number
  SubscriptionID: number
  AmountPaid: number
  PaymentStatus: string
}

// Define the User interface based on your expected user structure
interface User {
  UserID: number
  Name: string
  Email: string
  SubscriptionID: number
}

export default function Billing() {
  const [billingData, setBillingData] = useState<BillingEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null) // Replace `any` with the User type

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser)) // Set user from localStorage
    }
  }, []) // Run only once when the component mounts

  useEffect(() => {
    if (!user) return; // Skip fetching data if no user is found

    const fetchBillingData = async () => {
      try {
        const res = await fetch('/api/mysql/billing')
        if (!res.ok) {
          throw new Error('Failed to fetch billing data')
        }
        const data = await res.json()
        const userBillingData = data.filter((entry: BillingEntry) => entry.UserID === user.UserID)
        setBillingData(userBillingData) // Set only the logged-in user's data
      } catch (err) {
        setError((err as Error).message)
      }
    }

    fetchBillingData() // Fetch billing data for the logged-in user
  }, [user]) // Run the effect only when `user` is set (i.e., after login)

  return (
    <section className="container mx-auto py-16">
      <h2 className="text-3xl font-semibold text-center mb-8">Billing Information</h2>
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {billingData.length > 0 ? (
            billingData.map((entry) => (
              <div key={entry.UserID} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <p className="text-lg text-gray-700">Amount Paid: ${entry.AmountPaid}</p>
                <p className={`text-lg mt-4 ${entry.PaymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                  Payment Status: {entry.PaymentStatus}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No billing information available</p>
          )}
        </div>
      )}
    </section>
  )
}
