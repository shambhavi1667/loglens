const mongoose = require('mongoose')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
  // Google OAuth (optional now)
  googleId: {
    type: String,
    unique: true,
    sparse: true  // allows multiple null values
  },

  // Local auth
  password: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  },

  // Common fields
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  },
  apiKey: {
    type: String,
    unique: true,
    default: () => 'lk_' + crypto.randomBytes(16).toString('hex')
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)