import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black to-transparent">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold text-red-600">
          MovieStreamer
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link href="#" className="hover:text-gray-300">Movies</Link></li>
            <li><Link href="#" className="hover:text-gray-300">TV Shows</Link></li>
            <li><Link href="#" className="hover:text-gray-300">My List</Link></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="default">Sign In</Button>
        </div>
      </div>
    </header>
  )
}

