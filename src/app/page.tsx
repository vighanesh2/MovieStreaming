import Header from '@/components/Header'
import Hero from '@/components/Hero'
import MovieCategories from '@/components/MovieCategories'
import SubscriptionPlans from '@/components/SubscriptionPlans'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <MovieCategories />
        <SubscriptionPlans />
      </main>
      <Footer />
    </div>
  )
}

