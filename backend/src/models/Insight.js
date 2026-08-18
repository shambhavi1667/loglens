const mongoose = require('mongoose')

const InsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  summary: {
    type: String,
    required: true
  },
  errorCount: {
    type: Number,
    default: 0
  },
  topIssues: [{
    cause: String,
    count: Number,
    suggestion: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
})

// TTL — auto delete insights older than 24 hours
InsightSchema.index({ generatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 })

module.exports = mongoose.model('Insight', InsightSchema)