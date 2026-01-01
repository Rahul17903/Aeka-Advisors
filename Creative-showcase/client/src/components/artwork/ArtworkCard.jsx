import { Link } from 'react-router-dom'
import { 
  HeartIcon, 
  EyeIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

export default function ArtworkCard({ artwork }) {
   if (!artwork) return null;
  return (
    <div className="group relative card overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/artwork/${artwork._id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/artwork/${artwork._id}`}>
            <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {artwork.title}
            </h3>
          </Link>
          <button className="text-gray-400 hover:text-red-600 transition-colors">
            <HeartIcon className="h-5 w-5" />
          </button>
        </div>
        
        <Link 
          to={`/profile/${artwork.artist?.username}`}
          className="flex items-center mb-3 group"
        >
          <img
            src={artwork.artist?.profilePicture}
            alt={artwork.artist?.username}
            className="h-6 w-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600 group-hover:text-primary-600">
            {artwork.artist?.username}
          </span>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {artwork.views?.toLocaleString() || 0}
            </span>
            <span className="flex items-center">
              <HeartIcon className="h-4 w-4 mr-1" />
              {artwork.likes?.toLocaleString() || 0}
            </span>
            <span className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              {artwork.comments?.length || 0}
            </span>
          </div>
          <span className="text-xs">
            {new Date(artwork.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}