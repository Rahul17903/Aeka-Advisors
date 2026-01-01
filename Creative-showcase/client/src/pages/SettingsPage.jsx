import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  GlobeAltIcon,
  PhotoIcon,
  BellIcon,
  ShieldCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ArrowUpTrayIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState('')

  // Initialize forms with user data
  const profileForm = useForm({
    defaultValues: {
      displayName: user?.displayName || user?.username || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      occupation: user?.occupation || '',
      education: user?.education || '',
      skills: user?.skills?.join(', ') || ''
    }
  })

  const accountForm = useForm({
    defaultValues: {
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const notificationForm = useForm({
    defaultValues: {
      emailNotifications: true,
      newFollowers: true,
      artworkLikes: true,
      comments: true,
      mentions: true,
      newsletter: false
    }
  })

  const privacyForm = useForm({
    defaultValues: {
      profileVisibility: 'public',
      artworkVisibility: 'public',
      allowComments: true,
      showOnlineStatus: true,
      allowMessages: 'followers'
    }
  })

  // Set profile image preview on component mount
  useEffect(() => {
    if (user?.profilePicture) {
      setProfileImagePreview(user.profilePicture)
    }
    if (user?.coverImage) {
      setCoverImagePreview(user.coverImage)
    }
  }, [user])

  // Profile image dropzone
  const {
    getRootProps: getProfileRootProps,
    getInputProps: getProfileInputProps,
    isDragActive: isProfileDragActive
  } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  })

  // Cover image dropzone
  const {
    getRootProps: getCoverRootProps,
    getInputProps: getCoverInputProps,
    isDragActive: isCoverDragActive
  } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setCoverImage(file)
      setCoverImagePreview(URL.createObjectURL(file))
    }
  })

  const handleProfileSubmit = async (data) => {
    try {
      setIsUpdating(true)
      
      const formData = new FormData()
      
      // Add profile image if changed
      if (profileImage) {
        formData.append('profilePicture', profileImage)
      }
      
      // Add cover image if changed
      if (coverImage) {
        formData.append('coverImage', coverImage)
      }
      
      // Add other profile data
      formData.append('displayName', data.displayName)
      formData.append('bio', data.bio)
      formData.append('location', data.location)
      formData.append('website', data.website)
      formData.append('occupation', data.occupation)
      formData.append('education', data.education)
      formData.append('skills', data.skills)
      
      // Call update profile API
      const result = await updateProfile(formData)
      
      if (result.success) {
        toast.success('Profile updated successfully!')
        // Reset file states
        setProfileImage(null)
        setCoverImage(null)
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAccountSubmit = async (data) => {
    try {
      setIsUpdating(true)
      
      // Validate passwords match
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      
      // Prepare update data
      const updateData = {
        email: data.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }
      
      // Call update account API
      // await api.put('/users/account', updateData)
      
      toast.success('Account updated successfully!')
      accountForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Account update error:', error)
      toast.error('Failed to update account')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleNotificationSubmit = (data) => {
    console.log('Notification preferences:', data)
    // Save notification preferences API call
    toast.success('Notification preferences saved!')
  }

  const handlePrivacySubmit = (data) => {
    console.log('Privacy settings:', data)
    // Save privacy settings API call
    toast.success('Privacy settings saved!')
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Call delete account API
        // await api.delete('/users/account')
        
        toast.success('Account deleted successfully')
        logout()
      } catch (error) {
        console.error('Delete account error:', error)
        toast.error('Failed to delete account')
      }
    }
  }

  const handleExportData = async () => {
    try {
      toast.loading('Preparing your data export...')
      
      // Call export data API
      // const response = await api.get('/users/export-data')
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.dismiss()
      toast.success('Data export prepared! Check your email for download link.')
    } catch (error) {
      console.error('Export data error:', error)
      toast.error('Failed to export data')
    }
  }

  const handleLogoutEverywhere = async () => {
    try {
      // Call logout everywhere API
      // await api.post('/auth/logout-everywhere')
      
      toast.success('Logged out from all devices')
      logout()
    } catch (error) {
      console.error('Logout everywhere error:', error)
      toast.error('Failed to logout from all devices')
    }
  }

  const removeProfileImage = () => {
    setProfileImage(null)
    setProfileImagePreview(user?.profilePicture || '')
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    setCoverImagePreview(user?.coverImage || '')
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'account', name: 'Account', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'danger', name: 'Danger Zone', icon: ExclamationTriangleIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 mr-3 ${
                    activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="mt-8 lg:mt-0 lg:col-span-9">
            {activeTab === 'profile' && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                
                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative">
                          <img
                            src={profileImagePreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                            alt="Profile"
                            className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                          />
                          {profileImagePreview && (
                            <button
                              type="button"
                              onClick={removeProfileImage}
                              className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div
                            {...getProfileRootProps()}
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                              isProfileDragActive
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                            }`}
                          >
                            <input {...getProfileInputProps()} />
                            <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {isProfileDragActive ? 'Drop the image here' : 'Drag & drop your profile picture'}
                            </p>
                            <p className="text-xs text-gray-500">
                              or click to browse (Max: 2MB)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG, GIF, WebP
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image
                      </label>
                      <div className="space-y-3">
                        {coverImagePreview ? (
                          <div className="relative">
                            <img
                              src={coverImagePreview}
                              alt="Cover"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeCoverImage}
                              className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            {...getCoverRootProps()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                              isCoverDragActive
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                            }`}
                          >
                            <input {...getCoverInputProps()} />
                            <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {isCoverDragActive ? 'Drop the image here' : 'Drag & drop your cover image'}
                            </p>
                            <p className="text-xs text-gray-500">
                              or click to browse (Max: 5MB)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Recommended: 1920×640px
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="displayName"
                          type="text"
                          {...profileForm.register('displayName', {
                            required: 'Display name is required',
                            minLength: {
                              value: 2,
                              message: 'Display name must be at least 2 characters'
                            }
                          })}
                          className="input-field pl-10"
                          placeholder="Your display name"
                        />
                      </div>
                      {profileForm.formState.errors.displayName && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        {...profileForm.register('bio', {
                          maxLength: {
                            value: 500,
                            message: 'Bio must be less than 500 characters'
                          }
                        })}
                        className="input-field"
                        placeholder="Tell the community about yourself..."
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-500">
                          Brief description for your profile.
                        </p>
                        <p className="text-sm text-gray-500">
                          {profileForm.watch('bio')?.length || 0}/500
                        </p>
                      </div>
                      {profileForm.formState.errors.bio && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.bio.message}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="location"
                          type="text"
                          {...profileForm.register('location')}
                          className="input-field pl-10"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="website"
                          type="url"
                          {...profileForm.register('website', {
                            pattern: {
                              value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                              message: 'Please enter a valid URL'
                            }
                          })}
                          className="input-field pl-10"
                          placeholder="https://example.com"
                        />
                      </div>
                      {profileForm.formState.errors.website && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.website.message}
                        </p>
                      )}
                    </div>

                    {/* Occupation */}
                    <div>
                      <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="occupation"
                          type="text"
                          {...profileForm.register('occupation')}
                          className="input-field pl-10"
                          placeholder="Your occupation"
                        />
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                        Education
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="education"
                          type="text"
                          {...profileForm.register('education')}
                          className="input-field pl-10"
                          placeholder="Your education"
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <input
                        id="skills"
                        type="text"
                        {...profileForm.register('skills')}
                        className="input-field"
                        placeholder="Digital painting, Illustration, 3D Modeling (comma separated)"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Add your skills separated by commas
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="btn-primary flex items-center justify-center"
                      >
                        {isUpdating ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                
                <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)}>
                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          {...accountForm.register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className="input-field pl-10"
                        />
                      </div>
                      {accountForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {accountForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Current Password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="currentPassword"
                          type="password"
                          {...accountForm.register('currentPassword')}
                          className="input-field pl-10"
                          placeholder="Enter current password to make changes"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Required to change email or password
                      </p>
                    </div>

                    {/* New Password */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="newPassword"
                          type="password"
                          {...accountForm.register('newPassword', {
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            }
                          })}
                          className="input-field pl-10"
                          placeholder="Leave empty to keep current password"
                        />
                      </div>
                      {accountForm.formState.errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {accountForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          type="password"
                          {...accountForm.register('confirmPassword', {
                            validate: value =>
                              value === accountForm.watch('newPassword') || 'Passwords do not match'
                          })}
                          className="input-field pl-10"
                          placeholder="Confirm new password"
                        />
                      </div>
                      {accountForm.formState.errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {accountForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => accountForm.reset()}
                          className="btn-secondary"
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="btn-primary flex items-center"
                        >
                          {isUpdating ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            'Update Account'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                
                <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)}>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">All Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive all email notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          {...notificationForm.register('emailNotifications')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">New Followers</p>
                          <p className="text-sm text-gray-600">When someone follows you</p>
                        </div>
                        <input
                          type="checkbox"
                          {...notificationForm.register('newFollowers')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Artwork Likes</p>
                          <p className="text-sm text-gray-600">When someone likes your artwork</p>
                        </div>
                        <input
                          type="checkbox"
                          {...notificationForm.register('artworkLikes')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Comments</p>
                          <p className="text-sm text-gray-600">When someone comments on your artwork</p>
                        </div>
                        <input
                          type="checkbox"
                          {...notificationForm.register('comments')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Mentions</p>
                          <p className="text-sm text-gray-600">When someone mentions you</p>
                        </div>
                        <input
                          type="checkbox"
                          {...notificationForm.register('mentions')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Newsletter</p>
                          <p className="text-sm text-gray-600">Receive platform updates and tips</p>
                        </div>
                        <input
                          type="checkbox"
                          {...notificationForm.register('newsletter')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button type="submit" className="btn-primary">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                
                <form onSubmit={privacyForm.handleSubmit(handlePrivacySubmit)}>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Visibility
                        </label>
                        <select
                          {...privacyForm.register('profileVisibility')}
                          className="input-field"
                        >
                          <option value="public">Public (Anyone can view your profile)</option>
                          <option value="private">Private (Only you can view your profile)</option>
                          <option value="followers">Followers Only (Only followers can view)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Artwork Visibility
                        </label>
                        <select
                          {...privacyForm.register('artworkVisibility')}
                          className="input-field"
                        >
                          <option value="public">Public (Anyone can view your artworks)</option>
                          <option value="private">Private (Only you can view your artworks)</option>
                          <option value="followers">Followers Only (Only followers can view)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Allow Comments</p>
                          <p className="text-sm text-gray-600">Allow users to comment on your artworks</p>
                        </div>
                        <input
                          type="checkbox"
                          {...privacyForm.register('allowComments')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Show Online Status</p>
                          <p className="text-sm text-gray-600">Display when you're online</p>
                        </div>
                        <input
                          type="checkbox"
                          {...privacyForm.register('showOnlineStatus')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allow Messages From
                        </label>
                        <select
                          {...privacyForm.register('allowMessages')}
                          className="input-field"
                        >
                          <option value="everyone">Everyone</option>
                          <option value="followers">Followers Only</option>
                          <option value="none">No One</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button type="submit" className="btn-primary">
                        Save Privacy Settings
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="card p-6 border-red-200 bg-red-50">
                <h2 className="text-xl font-semibold text-red-900 mb-6">Danger Zone</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-white border border-red-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="font-medium text-red-900">Delete Account</h3>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete your account and all associated data.
                          This action cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsDeleting(true)}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-yellow-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="font-medium text-yellow-900">Export Data</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Download all your data, including artworks, comments, and settings.
                        </p>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors w-full sm:w-auto"
                      >
                        Export Data
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="font-medium text-gray-900">Log Out Everywhere</h3>
                        <p className="text-sm text-gray-700 mt-1">
                          Log out from all devices and sessions.
                        </p>
                      </div>
                      <button
                        onClick={handleLogoutEverywhere}
                        className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
                      >
                        Log Out Everywhere
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {isDeleting && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center mb-4">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                          Are you absolutely sure you want to delete your account? 
                          This will permanently delete:
                        </p>
                        
                        <ul className="list-disc pl-5 text-gray-600 mb-6 space-y-1">
                          <li>All your uploaded artworks</li>
                          <li>Comments and likes</li>
                          <li>Profile information</li>
                          <li>Account settings</li>
                        </ul>

                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                          <button
                            onClick={() => setIsDeleting(false)}
                            className="btn-secondary order-2 sm:order-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2"
                          >
                            Yes, Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}