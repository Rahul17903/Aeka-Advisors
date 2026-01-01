import { Link } from 'react-router-dom'
import { HomeIcon, ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-6">
          <PhotoIcon className="h-16 w-16 text-primary-600" />
        </div>
        
        <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">404</h1>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for seems to have wandered off into the creative abyss.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-gray-600">Here are some helpful links instead:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/browse" className="text-primary-600 hover:text-primary-700 font-medium">
              Browse Artwork
            </Link>
            <Link to="/upload" className="text-primary-600 hover:text-primary-700 font-medium">
              Upload Art
            </Link>
            <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
              Dashboard
            </Link>
            <Link to="/settings" className="text-primary-600 hover:text-primary-700 font-medium">
              Settings
            </Link>
          </div>
        </div>

        {/* Fun Illustration */}
        <div className="mt-12">
          <div className="relative h-40">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 border-4 border-dashed border-gray-300 rounded-full animate-pulse" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-6 w-6 bg-primary-600 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}