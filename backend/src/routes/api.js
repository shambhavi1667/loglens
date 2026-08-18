const express = require('express')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth')
const { ingestLog, getLogs } = require('../controllers/logController')
const Insight = require('../models/Insight')

// Add this line — protected, session auth
router.get('/logs', isAuthenticated, getLogs)

// Public route — SDK calls this, no session needed, just API key
router.post('/logs/ingest', ingestLog)

// Protected route — only logged in users
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to your dashboard', user: req.user.name })
})

// Get latest AI insight for logged in user
router.get('/insights', isAuthenticated, async (req, res) => {
  try {
    const insight = await Insight.findOne({ userId: req.user._id })
      .sort({ generatedAt: -1 })

    if (!insight) {
      return res.json({ insight: null })
    }

    res.json({ insight })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Manually trigger AI analysis (for testing)
router.post('/insights/generate', isAuthenticated, async (req, res) => {
  try {
    const { generateInsights } = require('../services/ai-service')
    await generateInsights()
    const insight = await Insight.findOne({ userId: req.user._id })
    res.json({ success: true, insight })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router