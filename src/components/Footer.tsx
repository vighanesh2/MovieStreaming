import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-gray-300">About Us</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Careers</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-gray-300">Help Center</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-gray-300">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-gray-300">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Cookie Preferences</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-gray-300">Facebook</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Twitter</Link></li>
              <li><Link href="#" className="hover:text-gray-300">Instagram</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p>&copy; 2023 MovieStream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

