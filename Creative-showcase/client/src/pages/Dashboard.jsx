import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useArtwork } from '../contexts/ArtworkContext'
import ArtworkCard from '../components/artwork/ArtworkCard'
import UploadModal from '../components/artwork/UploadModal'
import { 
  PlusIcon,
  PhotoIcon,
  EyeIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user } = useAuth()
  const { userArtworks, fetchUserArtworks, deleteArtwork } = useArtwork()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalViews: 0,
    totalLikes: 0,
    engagementRate: 0
  })
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'oldest', 'popular'

  useEffect(() => {
    fetchUserArtworks()
  }, [])

  useEffect(() => {
    if (userArtworks.length > 0) {
      const totalViews = userArtworks.reduce((sum, artwork) => sum + (artwork.views || 0), 0)
      const totalLikes = userArtworks.reduce((sum, artwork) => sum + (artwork.likes?.length || 0), 0)
      const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : 0
      
      setStats({
        totalUploads: userArtworks.length,
        totalViews,
        totalLikes,
        engagementRate
      })
    }
  }, [userArtworks])

  const handleDelete = async (artworkId) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      await deleteArtwork(artworkId)
    }
  }

  const getSortedArtworks = () => {
    const sorted = [...userArtworks]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      case 'popular':
        return sorted.sort((a, b) => {
          const aScore = (a.views || 0) + ((a.likes?.length || 0) * 10)
          const bScore = (b.views || 0) + ((b.likes?.length || 0) * 10)
          return bScore - aScore
        })
      default:
        return sorted
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Welcome back, <span className="text-primary-600">{user?.username}</span>
              </h1>
              <p className="text-gray-600 mt-1">Manage your artwork and track your performance</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload New Artwork
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Artworks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUploads}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <PhotoIcon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>{stats.totalUploads > 0 ? 'Active' : 'Start uploading!'}</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              <span>Across all artworks</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLikes.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-pink-600">
              <HeartIcon className="h-4 w-4 mr-1" />
              <span>Community engagement</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.engagementRate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              <span>Likes per view</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to={`/profile/${user?.username}`}
              className="card p-4 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <EyeIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">View Public Profile</p>
                  <p className="text-sm text-gray-600">See how others see you</p>
                </div>
              </div>
            </Link>

            <Link
              to="/settings"
              className="card p-4 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Account Settings</p>
                  <p className="text-sm text-gray-600">Update profile & preferences</p>
                </div>
              </div>
            </Link>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="card p-4 hover:shadow-lg transition-shadow group text-left"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <ArrowUpTrayIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Upload Artwork</p>
                  <p className="text-sm text-gray-600">Share new creation</p>
                </div>
              </div>
            </button>

            <Link
              to="/browse"
              className="card p-4 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <PhotoIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Browse Art</p>
                  <p className="text-sm text-gray-600">Discover new inspiration</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Artworks Section */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Artworks</h2>
              <p className="text-gray-600 mt-1">Manage and organize your uploaded creations</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {userArtworks.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks yet</h3>
              <p className="text-gray-600 mb-6">
                Start sharing your creativity with the world
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Upload Your First Artwork
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getSortedArtworks().map((artwork) => (
                <div key={artwork._id} className="group relative">
                  <ArtworkCard artwork={artwork} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      onClick={() => setSelectedArtwork(artwork)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(artwork._id)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {getSortedArtworks().map((artwork) => (
                <div key={artwork._id} className="flex items-center p-4 card hover:shadow-lg transition-shadow group">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <div className="ml-4 grow">
                    <h3 className="font-medium text-gray-900">{artwork.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(artwork.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {artwork.views || 0} views
                      </span>
                      <span className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {artwork.likes?.length || 0} likes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedArtwork(artwork)}
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(artwork._id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {userArtworks.slice(0, 3).map((artwork) => (
              <div key={artwork._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded-lg mr-3">
                  <PhotoIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="grow">
                  <p className="font-medium text-gray-900">
                    You uploaded "<span className="text-primary-600">{artwork.title}</span>"
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(artwork.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {artwork.views || 0} views
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false)
          setSelectedArtwork(null)
        }}
        artwork={selectedArtwork}
      />
    </div>
  )
}