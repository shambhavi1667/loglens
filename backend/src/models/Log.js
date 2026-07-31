const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // index for fast filtering by user
  },
  service: {
    type: String,
    required: true,
    default: 'default'
  },
  level: {
    type: String,
    enum: ['info', 'warn', 'error'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

// TTL index — auto delete logs older than 30 days
LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 })

// Compound index for fast queries — user's logs sorted by time
LogSchema.index({ userId: 1, timestamp: -1 })

module.exports = mongoose.model('Log', LogSchema)