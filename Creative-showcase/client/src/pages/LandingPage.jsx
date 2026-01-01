import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useArtwork } from '../contexts/ArtworkContext'
import { 
  ArrowRightIcon,
  FireIcon,
  UserGroupIcon,
  PhotoIcon,
  EyeIcon,
  HeartIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import ArtworkCard from '../components/artwork/ArtworkCard'

export default function LandingPage() {
  const { featuredArtworks, fetchFeaturedArtworks, loading } = useArtwork()
  const [stats, setStats] = useState({
    artworks: 12543,
    artists: 2846,
    views: 2567890
  })

  useEffect(() => {
    fetchFeaturedArtworks()
  },[] )

  const features = [
    {
      icon: PhotoIcon,
      title: 'Upload & Showcase',
      description: 'Upload your digital artwork in high quality and showcase it to the world'
    },
    {
      icon: UserGroupIcon,
      title: 'Connect with Artists',
      description: 'Follow your favorite artists and join creative communities'
    },
    {
      icon: FireIcon,
      title: 'Get Discovered',
      description: 'Get featured on our platform and reach a wider audience'
    },
    {
      icon: SparklesIcon,
      title: 'Build Portfolio',
      description: 'Create a professional portfolio that grows with your career'
    }
  ]

  const trendingCategories = [
    { name: 'Digital Art', count: '2.4k', color: 'bg-blue-500' },
    { name: 'Photography', count: '1.8k', color: 'bg-purple-500' },
    { name: '3D Modeling', count: '1.2k', color: 'bg-green-500' },
    { name: 'Illustration', count: '3.1k', color: 'bg-pink-500' },
    { name: 'Traditional', count: '890', color: 'bg-yellow-500' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-50 to-secondary-50">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-size-[20px_20px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-gray-900">
              Showcase Your{' '}
              <span className="bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Creativity
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              A platform where artists share digital artwork, connect with the community, 
              and build their online presence. Join thousands of creatives today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-linear-to-r from-primary-600 to-secondary-600 rounded-lg hover:opacity-90 transition-opacity"
              >
                Start Creating Free
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="mr-2 h-5 w-5" />
                Browse Artwork
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <PhotoIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {stats.artworks.toLocaleString()}+
              </div>
              <div className="text-lg text-gray-600 mt-2">Artworks</div>
            </div>
            
            <div className="text-center p-8 card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-secondary-100 rounded-full mb-4">
                <UserGroupIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {stats.artists.toLocaleString()}+
              </div>
              <div className="text-lg text-gray-600 mt-2">Artists</div>
            </div>
            
            <div className="text-center p-8 card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                <EyeIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {stats.views.toLocaleString()}+
              </div>
              <div className="text-lg text-gray-600 mt-2">Views</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything You Need to Shine</h2>
            <p className="section-subtitle">
              Powerful features designed for modern artists
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 card hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="section-title">Featured Artworks</h2>
              <p className="section-subtitle">
                Discover trending creations from our community
              </p>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mt-4 sm:mt-0"
            >
              View all
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <ArrowPathIcon className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading artworks...</p>
            </div>
          ) : featuredArtworks && featuredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredArtworks.slice(0, 8).map((artwork) => (
                <ArtworkCard 
                  key={artwork._id} 
                  artwork={artwork} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No artworks available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Trending Categories</h2>
            <p className="section-subtitle">
              Explore popular art styles and mediums
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingCategories.map((category) => (
              <Link
                key={category.name}
                to={`/browse?category=${category.name.toLowerCase()}`}
                className="group p-6 card hover:shadow-lg transition-shadow text-center"
              >
                <div className={`${category.color} h-12 w-12 rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                  <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{category.count} artworks</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-primary-600 to-secondary-600">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            Ready to Showcase Your Art?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of artists who are already sharing their work with the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary-600 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Free Account
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}