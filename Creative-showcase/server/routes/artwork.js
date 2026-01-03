const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');
const Artwork = require('../models/Artwork');
const User = require('../models/User');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'creative-showcase',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST /api/artwork/upload
// @desc    Upload artwork
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    
    const artwork = new Artwork({
      title,
      description,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      artist: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category
    });

    await artwork.save();
    
    // Populate artist info
    const populatedArtwork = await Artwork.findById(artwork._id)
      .populate('artist', 'username profilePicture')
      .lean();

    res.json(populatedArtwork);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/artwork/featured
// @desc    Get featured artworks for landing page
router.get('/featured', async (req, res) => {
  try {
    const artworks = await Artwork.aggregate([
      { $match: { isPublic: true } },
      { $sample: { size: 8 } },
      {
        $lookup: {
          from: 'users',
          localField: 'artist',
          foreignField: '_id',
          as: 'artistInfo'
        }
      },
      { $unwind: '$artistInfo' },
      {
        $project: {
          title: 1,
          imageUrl: 1,
          views: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
          'artistInfo.username': 1,
          'artistInfo.profilePicture': 1
        }
      }
    ]);

    res.json(artworks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/artwork/dashboard
// @desc    Get user's artworks for dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.user.id })
      .sort('-createdAt')
      .select('title imageUrl views likes comments createdAt')
      .lean();
    
    res.json(artworks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/artwork/search
// @desc    Search artworks
router.get('/search', async (req, res) => {
  try {
    const { q, category, sortBy = 'newest' } = req.query;
    
    let query = { isPublic: true };
    
    // Search query
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category && category !== 'All') {
      query.category = category.toLowerCase();
    }
    
    // Sort
    let sort = { createdAt: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };
    if (sortBy === 'popular') sort = { views: -1 };
    if (sortBy === 'most-liked') sort = { likes: -1 };
    
    const artworks = await Artwork.find(query)
      .populate('artist', 'username profilePicture')
      .sort(sort)
      .limit(12)
      .lean();
    
    res.json(artworks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/artwork/:id
// @desc    Get artwork by ID
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artist', 'username profilePicture displayName bio location website')
      .populate('comments.user', 'username profilePicture')
      .lean();
    
    if (!artwork) {
      return res.status(404).json({ msg: 'Artwork not found' });
    }
    
    // Increment view count
    await Artwork.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    res.json(artwork);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Artwork not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/artwork/:id
// @desc    Delete artwork
router.delete('/:id', auth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ msg: 'Artwork not found' });
    }
    
    // Check if user owns the artwork
    if (artwork.artist.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(artwork.imagePublicId);
    
    await artwork.deleteOne();
    
    res.json({ msg: 'Artwork removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/artwork/:id/like
// @desc    Like/unlike artwork
router.post('/:id/like', auth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ msg: 'Artwork not found' });
    }
    
    // Check if already liked
    const isLiked = artwork.likes.includes(req.user.id);
    
    if (isLiked) {
      // Unlike
      artwork.likes = artwork.likes.filter(
        like => like.toString() !== req.user.id
      );
    } else {
      // Like
      artwork.likes.push(req.user.id);
    }
    
    await artwork.save();
    
    res.json({ likes: artwork.likes, liked: !isLiked });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;