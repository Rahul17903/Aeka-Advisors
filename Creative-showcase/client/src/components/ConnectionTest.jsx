import { useState, useEffect } from 'react'
import api from '../utils/api'

export default function ConnectionTest() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState({})
  const [artworks, setArtworks] = useState([])

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test 1: Basic connection
      setStatus('Testing basic connection...')
      const testResponse = await api.get('/test')
      console.log('Test response:', testResponse.data)
      setDetails(prev => ({ ...prev, basic: '✅ Connected' }))

      // Test 2: Featured artworks
      setStatus('Testing artwork endpoint...')
      const artworksResponse = await api.get('/artwork/featured')
      console.log('Artworks response:', artworksResponse.data)
      setArtworks(artworksResponse.data || [])
      setDetails(prev => ({ ...prev, artworks: `✅ ${artworksResponse.data?.length || 0} artworks` }))

      // Test 3: Check response structure
      if (Array.isArray(artworksResponse.data)) {
        setDetails(prev => ({ ...prev, structure: '✅ Valid array structure' }))
      } else {
        setDetails(prev => ({ ...prev, structure: '❌ Invalid response format' }))
      }

      setStatus('✅ All tests passed!')

    } catch (error) {
      console.error('Connection test failed:', error)
      setStatus('❌ Connection failed')
      
      if (error.response) {
        setDetails({
          status: `Status: ${error.response.status}`,
          data: `Data: ${JSON.stringify(error.response.data)}`,
          url: `URL: ${error.config?.baseURL}${error.config?.url}`
        })
      } else if (error.request) {
        setDetails({ error: 'No response received from server' })
      } else {
        setDetails({ error: error.message })
      }
    }
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="mb-4">
        <div className="font-semibold">Status: {status}</div>
        <div className="text-sm text-gray-600">
          Environment: {import.meta.env.VITE_API_URL}
        </div>
      </div>

      {Object.keys(details).length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Details:</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      )}

      {artworks.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Sample Artworks ({artworks.length}):</h3>
          <div className="space-y-2">
            {artworks.slice(0, 3).map(artwork => (
              <div key={artwork._id} className="bg-white p-3 rounded border">
                <div className="font-medium">{artwork.title}</div>
                <div className="text-sm text-gray-600">
                  ID: {artwork._id} | Views: {artwork.views}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={testConnection}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Run Tests Again
      </button>
    </div>
  )
}