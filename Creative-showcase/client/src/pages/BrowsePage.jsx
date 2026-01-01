import { useState, useEffect } from 'react'
import { useArtwork } from '../contexts/ArtworkContext'
import ArtworkCard from '../components/artwork/ArtworkCard'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PhotoIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function BrowsePage() {
  const { searchArtworks, artworks=[], loading } = useArtwork()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'newest',
    minLikes: 0,
    dateRange: 'all'
  })

  const categories = [
    'All',
    'Digital Art',
    'Traditional Art',
    'Photography',
    '3D Art',
    'Illustration',
    'Concept Art',
    'Other'
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'most-liked', label: 'Most Liked' },
    { value: 'most-viewed', label: 'Most Viewed' }
  ]

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ]

  const handleSearch = () => {
    searchArtworks(searchQuery, filters)
  }
  
  useEffect(() => {
    handleSearch()
  }, [filters])


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      sortBy: 'newest',
      minLikes: 0,
      dateRange: 'all'
    })
    setSearchQuery('')
  }

  const trendingTags = [
    'digital', 'fantasy', 'landscape', 'portrait', 'abstract',
    'character', 'concept', 'minimal', 'colorful', 'surreal'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search */}
      <div className="bg-linear-to-r from-primary-600 to-secondary-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-white">
              Discover Amazing Artwork
            </h1>
            <p className="text-primary-100 mt-4">
              Explore thousands of creative works from artists worldwide
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search artwork, artists, or tags..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    onClick={handleSearch}
                    className="p-2 text-gray-400 hover:text-primary-600"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Trending Tags */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : 'Featured Artworks'}
            </h2>
            <p className="text-gray-600">
              {artworks.length} artworks found
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field py-2"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="card p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  {categories.map((category) => (
                    <option key={category} value={category === 'All' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="input-field"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Likes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Likes
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.minLikes}
                  onChange={(e) => handleFilterChange('minLikes', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0</span>
                  <span>{filters.minLikes}+</span>
                  <span>1000</span>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm">
                    {filters.category}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-2"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.minLikes > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                    {filters.minLikes}+ likes
                    <button
                      onClick={() => handleFilterChange('minLikes', 0)}
                      className="ml-2"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.dateRange !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                    {dateRanges.find(r => r.value === filters.dateRange)?.label}
                    <button
                      onClick={() => handleFilterChange('dateRange', 'all')}
                      className="ml-2"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-2 space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange('category', category === 'All' ? '' : category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filters.category === (category === 'All' ? '' : category)
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading artworks...</p>
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More */}
        {Array.isArray(artworks) && artworks.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Load More
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <FireIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trending Daily</h3>
              <p className="text-gray-600 mt-2">
                Discover the most popular artworks uploaded today
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <StarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Editor's Picks</h3>
              <p className="text-gray-600 mt-2">
                Curated selection of exceptional artwork
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Recent Uploads</h3>
              <p className="text-gray-600 mt-2">
                Fresh artwork from our creative community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}