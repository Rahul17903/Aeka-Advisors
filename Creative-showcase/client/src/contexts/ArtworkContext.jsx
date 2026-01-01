import React, { createContext, useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import api from '../utils/api'

const ArtworkContext = createContext({})

export const useArtwork = () => useContext(ArtworkContext)

export const ArtworkProvider = ({ children }) => {
  const [artworks, setArtworks] = useState([])
  const [featuredArtworks, setFeaturedArtworks] = useState([])
  const [userArtworks, setUserArtworks] = useState([])
  const [loading, setLoading] = useState(false)

  const getAuthHeader = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchFeaturedArtworks = async () => {
    try {

      setLoading(true)
    console.log('Fetching from:', api.defaults.baseURL + '/artwork/featured')
    
    const response = await api.get('/artwork/featured')
    console.log('Response received:', response)
    
    // Check if response has data
    if (response.data && Array.isArray(response.data)) {
      console.log('Setting artworks:', response.data.length)
      setFeaturedArtworks(response.data)
    } else {
      console.warn('Unexpected response format:', response.data)
      setFeaturedArtworks([])
    }
    } catch (error) {
      toast.error('Failed to load featured artworks')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserArtworks = async () => {
    try {
      

      setLoading(true)
      const response = await api.get('/artwork/dashboard', {
        headers: getAuthHeader()
      })
      setUserArtworks(response.data)
    } catch (error) {
      toast.error('Failed to load your artworks')
    } finally {
      setLoading(false)
    }
  }

  const uploadArtwork = async (formData) => {
    try {
      const response = await api.post('/artwork/upload', formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      })
      setUserArtworks(prev => [response.data, ...prev])
      toast.success('Artwork uploaded successfully!')
      return { success: true, artwork: response.data }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
      return { success: false }
    }
  }

  const deleteArtwork = async (id) => {
  try {
    console.log('Deleting artwork:', id)
    
    await api.delete(`/artwork/${id}`)
    
    // Remove from user artworks if present
    setUserArtworks(prev => prev.filter(artwork => artwork._id !== id))
    
    toast.success('Artwork deleted successfully')
    return { success: true }
    
  } catch (error) {
    console.error('Delete failed:', error)
    
    if (error.response) {
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
    }
    
    toast.error('Failed to delete artwork')
    return { success: false }
  }
}

  const likeArtwork = async (id) => {
  try {
    console.log('Liking artwork:', id)
    
    const response = await api.post(`/artwork/${id}/like`)
    
    return { success: true, data: response.data }
    
  } catch (error) {
    console.error('Like failed:', error)
    
    if (error.response) {
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
    }
    
    throw error
  }
}

  const searchArtworks = async (query, filters = {}) => {
    try {
      setLoading(true)
      const response = await api.get('/artwork/search', {
        params: { q: query, ...filters }
      })
      setArtworks(response.data)
      return response.data
    } catch (error) {
      toast.error('Search failed')
      return []
    } finally {
      setLoading(false)
    }
  }

const getArtworkById = async (id) => {
  try {
    console.log('Fetching artwork by ID:', id)
    
    const response = await api.get(`/artwork/${id}`)
    console.log('Artwork response:', response.data)
    
    return response.data
    
  } catch (error) {
    console.error('Failed to fetch artwork:', error)
    
    if (error.response) {
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
    }
    
    throw error
  }
}

// Add this method to your ArtworkContext
const getUserProfile = async (username) => {
  try {
    console.log('Fetching user profile for:', username)
    
    const response = await api.get(`/users/profile/${username}`)
    console.log('User profile response:', response.data)
    
    return response.data
    
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    
    if (error.response) {
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
      
      if (error.response.status === 404) {
        throw new Error('User not found')
      }
    }
    
    throw error
  }
}

  
  const value = {
    artworks,
    featuredArtworks,
    userArtworks,
    loading,
    fetchFeaturedArtworks,
    fetchUserArtworks,
    uploadArtwork,
    deleteArtwork,
    likeArtwork,
    searchArtworks,
    getArtworkById,
    getUserProfile
  }

  return (
    <ArtworkContext.Provider value={value}>
      {children}
    </ArtworkContext.Provider>
  )
}