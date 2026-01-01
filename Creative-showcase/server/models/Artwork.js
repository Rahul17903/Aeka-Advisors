const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000
  },
  imageUrl: {
    type: String,
    required: true
  },
  imagePublicId: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['digital', 'traditional', 'photography', '3d', 'illustration', 'concept', 'other'],
    default: 'digital'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  dimensions: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },
  colorPalette: [String]
});

// Indexes for faster queries
artworkSchema.index({ artist: 1, createdAt: -1 });
artworkSchema.index({ tags: 1 });
artworkSchema.index({ createdAt: -1 });
artworkSchema.index({ views: -1 });
artworkSchema.index({ 'likes': -1 });

module.exports = mongoose.model('Artwork', artworkSchema);