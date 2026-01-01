import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useArtwork } from '../contexts/ArtworkContext'
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  TagIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function UploadPage() {
  const navigate = useNavigate()
  const { uploadArtwork } = useArtwork()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      category: 'digital',
      isPublic: true,
      allowComments: true
    }
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setUploadedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  })

  const onSubmit = async (data) => {
    if (!uploadedImage) {
      alert('Please select an image to upload')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    const formData = new FormData()
    formData.append('image', uploadedImage)
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('tags', data.tags)
    formData.append('category', data.category)
    formData.append('isPublic', data.isPublic)
    formData.append('allowComments', data.allowComments)

    try {
      const result = await uploadArtwork(formData)
      if (result.success) {
        setUploadProgress(100)
        setTimeout(() => {
          navigate(`/artwork/${result.artwork._id}`)
        }, 500)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)
    }
  }

  const categories = [
    { value: 'digital', label: 'Digital Art' },
    { value: 'traditional', label: 'Traditional Art' },
    { value: 'photography', label: 'Photography' },
    { value: '3d', label: '3D Art' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'concept', label: 'Concept Art' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">Upload Artwork</h1>
            <p className="text-gray-600 mt-2">Share your creativity with the community</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card p-6 mb-6">
              {/* Image Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artwork Image *
                </label>
                
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImage(null)
                        setImagePreview('')
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {isDragActive ? 'Drop the image here' : 'Drag & drop your image'}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      or click to browse (Max: 10MB)
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="title"
                    type="text"
                    {...register('title', {
                      required: 'Title is required',
                      maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                    })}
                    className="input-field pl-10"
                    placeholder="Give your artwork a descriptive title"
                  />
                </div>
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description', {
                    maxLength: { value: 1000, message: 'Description must be less than 1000 characters' }
                  })}
                  className="input-field"
                  placeholder="Tell the story behind your artwork, your inspiration, techniques used, etc."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="tags"
                    type="text"
                    {...register('tags')}
                    className="input-field pl-10"
                    placeholder="digital, fantasy, character, landscape (comma separated)"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Add relevant tags to help others discover your artwork
                </p>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                
                <div className="flex items-center">
                  <input
                    id="isPublic"
                    type="checkbox"
                    {...register('isPublic')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                    Make artwork public
                  </label>
                  <div className="ml-2">
                    {watch('isPublic') ? (
                      <EyeIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="allowComments"
                    type="checkbox"
                    {...register('allowComments')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowComments" className="ml-2 block text-sm text-gray-700">
                    Allow comments
                  </label>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="card p-6 mb-6">
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="font-medium">Uploading...</span>
                  <span className="ml-auto">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !uploadedImage}
                className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-secondary-600 text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <ArrowUpTrayIcon className="h-5 w-5 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Publish Artwork
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tips */}
          <div className="mt-8 card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                Use high-quality images (minimum 1200px on the longest side)
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                Add detailed descriptions to help others understand your work
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                Use relevant tags to improve discoverability
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                Consider watermarking if you're concerned about unauthorized use
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}