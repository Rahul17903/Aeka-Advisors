import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useArtwork } from '../contexts/ArtworkContext'
import ArtworkCard from '../components/artwork/ArtworkCard'
import toast from 'react-hot-toast'
import { 
  UserIcon,
  CalendarIcon,
  PhotoIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  LinkIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PencilIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

export default function UserProfile() {
  const { username } = useParams()
  const { user: currentUser, isAuthenticated } = useAuth()
  const { getUserProfile, searchArtworks } = useArtwork()
  
  const [profile, setProfile] = useState(null)
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('artworks')
  const [sortBy, setSortBy] = useState('newest')
  const [stats, setStats] = useState({
    artworks: 0,
    followers: 0,
    following: 0,
    totalViews: 0,
    totalLikes: 0
  })

  useEffect(() => {
    if (username) {
      fetchUserProfile()
    }
  }, [username])

  useEffect(() => {
    if (profile) {
      fetchUserArtworks()
    }
  }, [profile, sortBy])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      
      // Fetch user profile from API
      const profileData = await getUserProfile(username)
      
      if (!profileData || !profileData.user) {
        throw new Error('User not found')
      }
      
      setProfile(profileData.user)
      
      // Set stats from API response
      if (profileData.stats) {
        setStats(profileData.stats)
      }
      
      // Set artworks if provided
      if (profileData.artworks && Array.isArray(profileData.artworks)) {
        setArtworks(profileData.artworks)
      }
      
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserArtworks = async () => {
    try {
      // Search for artworks by this user
      const artworksData = await searchArtworks('', {
        artist: username,
        sortBy: sortBy
      })
      
      setArtworks(artworksData || [])
      
      // Calculate stats from artworks if not provided by API
      if (artworksData && artworksData.length > 0 && stats.artworks === 0) {
        const totalViews = artworksData.reduce((sum, artwork) => sum + (artwork.views || 0), 0)
        const totalLikes = artworksData.reduce((sum, artwork) => sum + (artwork.likes?.length || 0), 0)
        
        setStats(prev => ({
          ...prev,
          artworks: artworksData.length,
          totalViews,
          totalLikes
        }))
      }
      
    } catch (error) {
      console.error('Failed to fetch user artworks:', error)
    }
  }

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users')
      return
    }

    try {
      // TODO: Implement follow API call
      setIsFollowing(!isFollowing)
      toast.success(isFollowing ? 'Unfollowed user' : 'Following user')
      
      // Update follower count
      setStats(prev => ({
        ...prev,
        followers: isFollowing ? prev.followers - 1 : prev.followers + 1
      }))
      
    } catch (error) {
      console.error('Follow action failed:', error)
      toast.error('Failed to follow user')
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/profile/${username}`
    
    if (navigator.share) {
      navigator.share({
        title: `${profile?.displayName || username}'s Profile`,
        text: `Check out ${profile?.displayName || username}'s artwork collection`,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Profile link copied to clipboard!')
    }
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isOwnProfile = currentUser?.username === username

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-60 md:h-80 bg-linear-to-r from-primary-500 to-secondary-500">
        {profile.coverImage ? (
          <img
            src={profile.coverImage || 'https://media.licdn.com/dms/image/v2/D4D16AQFV3k_8FdZ51A/profile-displaybackgroundimage-shrink_350_1400/B4DZbae6SXGwAc-/0/1747422260048?e=1769040000&v=beta&t=nzxGhD6sbVKykx6Q55vnj-7lNt6IGraZraPaJbkT6o0'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative">
        {/* Profile Header */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            {/* Avatar */}
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img
                src={profile.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                alt={profile.username}
                className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
                }}
              />
              {isOwnProfile && (
                <Link
                  to="/settings"
                  className="absolute bottom-2 right-2 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                  title="Edit Profile"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Profile Info */}
            <div className="grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.displayName || profile.username}
                    </h1>
                    {profile.isVerified && (
                      <CheckBadgeIcon className="h-6 w-6 text-blue-500 ml-2" />
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">@{profile.username}</p>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    title="Share Profile"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                  
                  {!isOwnProfile && isAuthenticated && (
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                        isFollowing
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                  
                  {isOwnProfile && (
                    <Link
                      to="/settings"
                      className="btn-primary"
                    >
                      Edit Profile
                    </Link>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-4 text-gray-700">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.artworks)}</div>
                  <div className="text-sm text-gray-600">Artworks</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.followers)}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.following)}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalLikes)}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-600">
                {profile.location && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                )}
                
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Joined {formatDate(profile.createdAt || profile.joinDate)}
                </div>
                
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Website
                  </a>
                )}
                
                {profile.email && isOwnProfile && (
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    <span className="truncate max-w-37.5">{profile.email}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(profile.socialLinks?.twitter || profile.socialLinks?.instagram || profile.socialLinks?.artstation) && (
                <div className="flex items-center space-x-3 mt-4">
                  {profile.socialLinks.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                      title="Twitter"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                  
                  {profile.socialLinks.instagram && (
                    <a
                      href={profile.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                      title="Instagram"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  
                  {profile.socialLinks.artstation && (
                    <a
                      href={profile.socialLinks.artstation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
                      title="ArtStation"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('artworks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'artworks'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PhotoIcon className="h-5 w-5 inline mr-2" />
              Artworks ({artworks.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserIcon className="h-5 w-5 inline mr-2" />
              About
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'artworks' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Artworks</h2>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 w-full sm:w-auto"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="most-liked">Most Liked</option>
              </select>
            </div>
            
            {artworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artworks.map((artwork) => (
                  <ArtworkCard key={artwork._id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 card">
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks yet</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? 'Start sharing your creativity with the world'
                    : 'This user hasn\'t uploaded any artworks yet'
                  }
                </p>
                {isOwnProfile && (
                  <Link to="/upload" className="btn-primary mt-4">
                    Upload Your First Artwork
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About {profile.displayName || profile.username}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
                <p className="text-gray-700 mb-6">
                  {profile.bio || 'No biography provided.'}
                </p>
                
                {profile.skills && profile.skills.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                <div className="space-y-4">
                  {profile.location && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Location
                      </p>
                      <p className="font-medium mt-1">{profile.location}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Joined
                    </p>
                    <p className="font-medium mt-1">
                      {formatDate(profile.createdAt || profile.joinDate)}
                    </p>
                  </div>
                  
                  {profile.email && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        Email
                      </p>
                      <a href={`mailto:${profile.email}`} className="font-medium text-primary-600 hover:text-primary-700 mt-1 block">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  
                  {profile.website && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Website
                      </p>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-700 mt-1 block truncate">
                        {profile.website}
                      </a>
                    </div>
                  )}
                  
                  {profile.occupation && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        Occupation
                      </p>
                      <p className="font-medium mt-1">{profile.occupation}</p>
                    </div>
                  )}
                  
                  {profile.education && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        Education
                      </p>
                      <p className="font-medium mt-1">{profile.education}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}