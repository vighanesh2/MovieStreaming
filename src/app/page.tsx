import Header from '@/components/Header'
import Hero from '@/components/Hero'
import MovieCategories from '@/components/MovieCategories'
import SubscriptionPlans from '@/components/SubscriptionPlans'
import Footer from '@/components/Footer'
import ViewingHistory from '@/components/ViewingHistory'
import UserRecommendations from '@/components/Recommendations'
import Billing from '@/components/Billing'
import { User } from 'lucide-react'
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <ViewingHistory/>
<UserRecommendations />
        <MovieCategories />
        <Billing />
        <SubscriptionPlans />
      </main>
      <Footer />
    </div>
  )
}

