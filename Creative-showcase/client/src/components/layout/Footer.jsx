import { Link } from 'react-router-dom'
import { 
  HeartIcon,
  CameraIcon,
  PaintBrushIcon,
  BuildingLibraryIcon 
} from '@heroicons/react/24/outline'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Platform: [
      { name: 'Browse Artwork', href: '/browse' },
      { name: 'Featured Artists', href: '/browse?filter=featured' },
      { name: 'Categories', href: '/browse?filter=categories' },
      { name: 'Popular', href: '/browse?filter=popular' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    Connect: [
      { name: 'Twitter', href: 'https://twitter.com' },
      { name: 'Instagram', href: 'https://instagram.com' },
      { name: 'Discord', href: 'https://discord.com' },
      { name: 'YouTube', href: 'https://youtube.com' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-linear-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <CameraIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">CreativeShowcase</h2>
                <p className="text-gray-400 mt-1">Where creativity meets community</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md">
              A platform for artists to showcase their digital artwork, connect with other creatives, and build their online presence.
            </p>
            <div className="flex space-x-4 mt-6">
              {[CameraIcon, PaintBrushIcon, BuildingLibraryIcon].map((Icon, index) => (
                <div key={index} className="p-2 bg-gray-800 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400">
              <HeartIcon className="h-5 w-5 text-red-500" />
              <span>Made with passion for the creative community</span>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400">
                © {currentYear} CreativeShowcase. All rights reserved.
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              All artworks are property of their respective owners. 
              <Link to="/copyright" className="ml-1 hover:text-gray-400">
                Learn about copyright
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}