'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import SignInForm from './Signin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload() // Refresh the page after login


  }

  const handleLoginSuccess = () => {
    setUser(JSON.parse(localStorage.getItem('user') || '{}'))
    setIsDialogOpen(false) // Close the dialog
    window.location.reload() // Refresh the page after login

  }

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black to-transparent">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold text-red-600">
          MovieStream
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-300">
                Movies
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-300">
                TV Shows
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-300">
                My List
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.Name}</span>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </div>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Sign In</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign In</DialogTitle>
                  <DialogDescription>
                    Enter your credentials to access your account.
                  </DialogDescription>
                </DialogHeader>
                <SignInForm onLoginSuccess={handleLoginSuccess} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  )
}
