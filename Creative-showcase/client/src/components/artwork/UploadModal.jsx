import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { XMarkIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'

export default function UploadModal({ isOpen, onClose, artwork = null }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: artwork || {
      title: '',
      description: '',
      tags: '',
      category: 'digital'
    }
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setUploadedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  })

  const onSubmit = async (data) => {
    setIsUploading(true)
    // Upload logic here
    console.log('Upload data:', data, uploadedImage)
    setTimeout(() => {
      setIsUploading(false)
      onClose()
      reset()
      setUploadedImage(null)
      setImagePreview('')
    }, 2000)
  }

  const categories = [
    'Digital Art',
    'Traditional Art',
    'Photography',
    '3D Art',
    'Illustration',
    'Concept Art',
    'Other'
  ]

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900">
                        {artwork ? 'Edit Artwork' : 'Upload Artwork'}
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 mt-1">
                        Share your creativity with the community
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Image Upload */}
                    <div>
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
                          <p className="text-sm text-gray-600">
                            or click to browse (Max: 10MB)
                          </p>
                        </div>
                      )}
                      {!imagePreview && (
                        <p className="mt-2 text-xs text-gray-500">
                          Supported formats: JPG, PNG, GIF, WebP
                        </p>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        {...register('title', { required: 'Title is required' })}
                        className="input-field"
                        placeholder="Give your artwork a descriptive title"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        {...register('description')}
                        className="input-field"
                        placeholder="Tell the story behind your artwork..."
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        id="tags"
                        type="text"
                        {...register('tags')}
                        className="input-field"
                        placeholder="digital, fantasy, character (comma separated)"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        {...register('category')}
                        className="input-field"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center p-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!uploadedImage || isUploading}
                      className="inline-flex items-center px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <ArrowUpTrayIcon className="h-5 w-5 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <PhotoIcon className="h-5 w-5 mr-2" />
                          {artwork ? 'Update Artwork' : 'Upload Artwork'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}