const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Artwork = require('../models/Artwork');
const bcrypt = require('bcryptjs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary - Profile Pictures
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'creative-showcase/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
  }
});

// Configure multer storage for Cloudinary - Cover Images
const coverStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'creative-showcase/covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1920, height: 640, crop: 'fill' }]
  }
});

// Create multer instances
const uploadProfile = multer({ 
  storage: profileStorage, 
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

const uploadCover = multer({ 
  storage: coverStorage, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   GET /api/users/profile/:username
// @desc    Get user profile by username
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email -profilePicturePublicId -coverImagePublicId')
      .lean();

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get user's public artworks
    const artworks = await Artwork.find({ 
      artist: user._id,
      isPublic: true 
    })
    .select('title imageUrl description views likes tags category createdAt')
    .sort('-createdAt')
    .lean();

    // Calculate user stats
    const stats = {
      artworks: await Artwork.countDocuments({ artist: user._id, isPublic: true }),
      followers: 0, // TODO: Implement followers system
      following: 0, // TODO: Implement following system
      totalViews: await Artwork.aggregate([
        { $match: { artist: user._id, isPublic: true } },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]).then(result => result[0]?.total || 0),
      totalLikes: await Artwork.aggregate([
        { $match: { artist: user._id, isPublic: true } },
        { $group: { _id: null, total: { $sum: { $size: '$likes' } } } }
      ]).then(result => result[0]?.total || 0)
    };

    res.json({
      user: {
        ...user,
        // Ensure displayName exists
        displayName: user.displayName || user.username
      },
      artworks,
      stats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile with image uploads
router.put('/profile', auth, async (req, res) => {
  try {
    const { 
      displayName, 
      bio, 
      location, 
      website, 
      occupation, 
      education, 
      skills 
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields
    const updateData = {};
    
    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (education !== undefined) updateData.education = education;
    
    if (skills !== undefined) {
      // Convert comma-separated string to array
      const skillsArray = skills.split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      updateData.skills = skillsArray;
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    // Return updated user without sensitive data
    const updatedUser = await User.findById(req.user.id)
      .select('-password -profilePicturePublicId -coverImagePublicId');

    res.json({
      user: updatedUser
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/users/profile/picture
// @desc    Upload profile picture
router.put('/profile/picture', auth, uploadProfile.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No image uploaded' });
    }

    // Delete old profile picture from Cloudinary if exists
    if (user.profilePicturePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      } catch (cloudinaryErr) {
        console.error('Error deleting old profile picture:', cloudinaryErr.message);
      }
    }

    // Update user with new profile picture
    user.profilePicture = req.file.path;
    user.profilePicturePublicId = req.file.filename;
    
    await user.save();

    // Return updated user without sensitive data
    const updatedUser = await User.findById(req.user.id)
      .select('-password -profilePicturePublicId -coverImagePublicId');

    res.json({
      user: updatedUser
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/users/profile/cover
// @desc    Upload cover image
router.put('/profile/cover', auth, uploadCover.single('coverImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No image uploaded' });
    }

    // Delete old cover image from Cloudinary if exists
    if (user.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(user.coverImagePublicId);
      } catch (cloudinaryErr) {
        console.error('Error deleting old cover image:', cloudinaryErr.message);
      }
    }

    // Update user with new cover image
    user.coverImage = req.file.path;
    user.coverImagePublicId = req.file.filename;
    
    await user.save();

    // Return updated user without sensitive data
    const updatedUser = await User.findById(req.user.id)
      .select('-password -profilePicturePublicId -coverImagePublicId');

    res.json({
      user: updatedUser
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/users/profile/picture
// @desc    Remove profile picture
router.delete('/profile/picture', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete profile picture from Cloudinary if exists
    if (user.profilePicturePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      } catch (cloudinaryErr) {
        console.error('Error deleting profile picture:', cloudinaryErr.message);
      }
    }

    // Remove profile picture from user
    user.profilePicture = '';
    user.profilePicturePublicId = '';
    
    await user.save();

    // Return updated user without sensitive data
    const updatedUser = await User.findById(req.user.id)
      .select('-password -profilePicturePublicId -coverImagePublicId');

    res.json({
      user: updatedUser
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/users/profile/cover
// @desc    Remove cover image
router.delete('/profile/cover', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete cover image from Cloudinary if exists
    if (user.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(user.coverImagePublicId);
      } catch (cloudinaryErr) {
        console.error('Error deleting cover image:', cloudinaryErr.message);
      }
    }

    // Remove cover image from user
    user.coverImage = '';
    user.coverImagePublicId = '';
    
    await user.save();

    // Return updated user without sensitive data
    const updatedUser = await User.findById(req.user.id)
      .select('-password -profilePicturePublicId -coverImagePublicId');

    res.json({
      user: updatedUser
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/users/account
// @desc    Update account settings (email/password)
router.put('/account', auth, async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const updateData = {};

    // Check if email is being updated
    if (email && email !== user.email) {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
      updateData.email = email;
    }

    // Check if password is being updated
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ msg: 'Current password is required to change password' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(req.user.id)
      .select('-password -profilePicturePublicId -coverImagePublicId');

    res.json({
      user: updatedUser
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already exists' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/me
// @desc    Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -profilePicturePublicId -coverImagePublicId');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/search
// @desc    Search users by username or display name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ msg: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ]
    })
    .select('username displayName profilePicture bio createdAt')
    .limit(10)
    .lean();

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete profile picture from Cloudinary if exists
    if (user.profilePicturePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      } catch (cloudinaryErr) {
        console.error('Error deleting profile picture:', cloudinaryErr.message);
      }
    }

    // Delete cover image from Cloudinary if exists
    if (user.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(user.coverImagePublicId);
      } catch (cloudinaryErr) {
        console.error('Error deleting cover image:', cloudinaryErr.message);
      }
    }

    // Delete all user's artworks
    await Artwork.deleteMany({ artist: req.user.id });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/:id/artworks
// @desc    Get user's artworks with pagination
router.get('/:id/artworks', async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const artworks = await Artwork.find({ 
      artist: user._id,
      isPublic: true 
    })
    .select('title imageUrl description views likes tags category createdAt')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

    const total = await Artwork.countDocuments({ 
      artist: user._id,
      isPublic: true 
    });

    res.json({
      artworks,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;