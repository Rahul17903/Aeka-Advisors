import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useArtwork } from '../contexts/ArtworkContext'
import toast from 'react-hot-toast'
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  EyeIcon,
  BookmarkIcon,
  FlagIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon,
  CalendarIcon,
  TagIcon,
  PhotoIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid'

export default function ArtworkDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { getArtworkById, likeArtwork, deleteArtwork } = useArtwork()
  const navigate = useNavigate()
  
  const [artwork, setArtwork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [relatedArtworks, setRelatedArtworks] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (id) {
      fetchArtwork()
    }
  }, [id])

  const fetchArtwork = async () => {
    try {
      setLoading(true)
      
      // Fetch artwork data from API
      const artworkData = await getArtworkById(id)
      
      if (!artworkData) {
        throw new Error('Artwork not found')
      }
      
      setArtwork(artworkData)
      
      // Set comments from artwork data
      if (artworkData.comments && Array.isArray(artworkData.comments)) {
        setComments(artworkData.comments)
      }
      
      // Check if current user has liked this artwork
      if (user && artworkData.likes && Array.isArray(artworkData.likes)) {
        const userLiked = artworkData.likes.some(like => 
          like._id === user.id || like.toString() === user.id
        )
        setIsLiked(userLiked)
      }
      
      // Fetch related artworks (for now, we'll use mock - you can implement API later)
      fetchRelatedArtworks(artworkData)
      
    } catch (error) {
      console.error('Failed to fetch artwork:', error)
      toast.error('Failed to load artwork')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedArtworks = (currentArtwork) => {
    // Mock related artworks - Replace with API call if available
    const mockRelated = Array.from({ length: 4 }, (_, i) => ({
      _id: `related${i}`,
      title: `Related Artwork ${i + 1}`,
      imageUrl: `https://picsum.photos/seed/related${i}/400/300`,
      artist: { 
        username: 'artist' + i,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=artist${i}`
      },
      likes: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 500)
    }))
    
    setRelatedArtworks(mockRelated)
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like artwork')
      return
    }

    try {
      setIsLiking(true)
      const result = await likeArtwork(id)
      
      if (result.success) {
        setIsLiked(!isLiked)
        
        // Update local artwork likes count
        setArtwork(prev => ({
          ...prev,
          likes: isLiked ? prev.likes - 1 : prev.likes + 1
        }))
        
        toast.success(isLiked ? 'Unliked artwork' : 'Liked artwork')
      }
    } catch (error) {
      console.error('Like failed:', error)
      toast.error('Failed to like artwork')
    } finally {
      setIsLiking(false)
    }
  }

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please login to bookmark artwork')
      return
    }
    
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to comment')
      return
    }
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      // Here you would call your API to post comment
      const newComment = {
        _id: Date.now().toString(),
        user: {
          _id: user.id,
          username: user.username,
          profilePicture: user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
        },
        text: comment,
        createdAt: new Date().toISOString(),
        likes: 0
      }

      setComments([newComment, ...comments])
      setComment('')
      
      toast.success('Comment added successfully')
      
      // In a real app, you would make an API call:
      // await api.post(`/artwork/${id}/comment`, { text: comment })
      
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast.error('Failed to add comment')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      const result = await deleteArtwork(id)
      
      if (result.success) {
        toast.success('Artwork deleted successfully')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete artwork')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReport = () => {
    if (window.confirm('Report this artwork for inappropriate content?')) {
      toast.success('Report submitted. Our team will review it shortly.')
      // Handle report API call here
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/artwork/${id}`
    
    if (navigator.share) {
      navigator.share({
        title: artwork?.title || 'Artwork',
        text: `Check out this artwork: ${artwork?.title}`,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading artwork...</p>
        </div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Artwork not found</h2>
          <p className="text-gray-600 mb-6">The artwork you're looking for doesn't exist or has been removed.</p>
          <Link to="/browse" className="btn-primary">
            Browse Artworks
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === artwork.artist?._id || user?.username === artwork.artist?.username

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/browse"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Artwork Image */}
            <div className="card overflow-hidden">
              <div className="relative">
                <img
                  src={artwork.imageUrl || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262'}
                  alt={artwork.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262'
                  }}
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  {isOwner && (
                    <>
                      <Link
                        to={`/artwork/${id}/edit`}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5 text-gray-600" />
                      </Link>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        {isDeleting ? (
                          <ArrowPathIcon className="h-5 w-5 text-red-600 animate-spin" />
                        ) : (
                          <TrashIcon className="h-5 w-5 text-red-600" />
                        )}
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleReport}
                    className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
                    title="Report"
                  >
                    <FlagIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Artwork Info */}
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-gray-900">{artwork.title}</h1>
                  <div className="flex items-center flex-wrap mt-2 gap-2">
                    {artwork.artist && (
                      <>
                        <Link
                          to={`/profile/${artwork.artist.username}`}
                          className="flex items-center group"
                        >
                          <img
                            src={artwork.artist.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artwork.artist.username}`}
                            alt={artwork.artist.username}
                            className="h-8 w-8 rounded-full mr-2"
                            onError={(e) => {
                              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${artwork.artist.username}`
                            }}
                          />
                          <span className="font-medium text-gray-900 group-hover:text-primary-600">
                            {artwork.artist.displayName || artwork.artist.username}
                          </span>
                          {artwork.artist.isVerified && (
                            <CheckBadgeIcon className="h-5 w-5 text-blue-500 ml-1" />
                          )}
                        </Link>
                        <span className="text-gray-300">•</span>
                      </>
                    )}
                    <span className="text-gray-600 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDate(artwork.createdAt)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600 flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {formatNumber(artwork.views || 0)} views
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <button
                    onClick={handleShare}
                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Share
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mb-6">
                <button
                  onClick={handleLike}
                  disabled={isLiking || !user}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLiked ? (
                    <HeartIconSolid className="h-6 w-6 text-red-600 mr-2" />
                  ) : (
                    <HeartIcon className="h-6 w-6 mr-2" />
                  )}
                  <span className="font-medium">
                    {formatNumber(artwork.likes?.length || 0)}
                  </span>
                </button>

                <button
                  onClick={handleBookmark}
                  disabled={!user}
                  className="flex items-center text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBookmarked ? (
                    <BookmarkIconSolid className="h-6 w-6 text-primary-600 mr-2" />
                  ) : (
                    <BookmarkIcon className="h-6 w-6 mr-2" />
                  )}
                  <span>Save</span>
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {artwork.description || 'No description provided.'}
                </p>
              </div>

              {/* Tags */}
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <TagIcon className="h-5 w-5 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/browse?search=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium capitalize">{artwork.category || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Uploaded</p>
                    <p className="font-medium">{formatDate(artwork.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Comments</p>
                    <p className="font-medium">{formatNumber(comments.length)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Visibility</p>
                    <p className="font-medium">{artwork.isPublic ? 'Public' : 'Private'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {(artwork.allowComments === undefined || artwork.allowComments) && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                  Comments ({comments.length})
                </h3>

                {/* Comment Form */}
                {user ? (
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    <div className="flex items-start space-x-4">
                      <img
                        src={user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={user.username}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-grow">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a comment..."
                          rows={3}
                          className="input-field w-full"
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            type="submit"
                            disabled={!comment.trim()}
                            className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">
                      Please{' '}
                      <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                        login
                      </Link>{' '}
                      to leave a comment
                    </p>
                  </div>
                )}

                {/* Comments List */}
                {comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment._id || comment.id} className="border-t border-gray-200 pt-6 first:border-0 first:pt-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={comment.user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username}`}
                            alt={comment.user?.username}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <Link
                                  to={`/profile/${comment.user?.username}`}
                                  className="font-medium text-gray-900 hover:text-primary-600"
                                >
                                  {comment.user?.username}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDate(comment.createdAt)}
                                </p>
                              </div>
                              <button className="text-gray-400 hover:text-red-600">
                                <HeartIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <p className="text-gray-700 mt-2">{comment.text}</p>
                            <div className="flex items-center space-x-4 mt-3">
                              <button className="text-sm text-gray-500 hover:text-gray-700">
                                Like ({comment.likes || 0})
                              </button>
                              <button className="text-sm text-gray-500 hover:text-gray-700">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-8">
            {/* Artist Info */}
            {artwork.artist && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Artist</h3>
                <Link
                  to={`/profile/${artwork.artist.username}`}
                  className="flex items-center space-x-4 group"
                >
                  <img
                    src={artwork.artist.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artwork.artist.username}`}
                    alt={artwork.artist.username}
                    className="h-16 w-16 rounded-full"
                  />
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-600">
                        {artwork.artist.displayName || artwork.artist.username}
                      </h4>
                      {artwork.artist.isVerified && (
                        <CheckBadgeIcon className="h-5 w-5 text-blue-500 ml-1" />
                      )}
                    </div>
                    <p className="text-gray-600">@{artwork.artist.username}</p>
                  </div>
                </Link>
                {artwork.artist.bio && (
                  <p className="mt-4 text-gray-700 text-sm line-clamp-3">
                    {artwork.artist.bio}
                  </p>
                )}
                <div className="mt-6">
                  <Link
                    to={`/profile/${artwork.artist.username}`}
                    className="w-full btn-secondary text-center block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Related Artworks */}
            {relatedArtworks.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Artworks</h3>
                <div className="space-y-4">
                  {relatedArtworks.map((art) => (
                    <Link
                      key={art._id}
                      to={`/artwork/${art._id}`}
                      className="flex items-center space-x-3 group"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary-600 truncate">
                          {art.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          by @{art.artist.username}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <HeartIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          {formatNumber(art.likes)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Copyright Notice */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Copyright</h3>
              <p className="text-sm text-gray-600 mb-4">
                This artwork is owned by the artist. All rights reserved. 
                Unauthorized use, reproduction, or distribution is prohibited.
              </p>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Report Copyright Issue
              </button>
            </div>

            {/* Additional Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Artwork Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID</span>
                  <span className="font-medium text-gray-900">{artwork._id?.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900 capitalize">{artwork.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploaded</span>
                  <span className="font-medium text-gray-900">{formatDate(artwork.createdAt)}</span>
                </div>
                {artwork.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="font-medium text-gray-900">
                      {artwork.dimensions.width} × {artwork.dimensions.height}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}