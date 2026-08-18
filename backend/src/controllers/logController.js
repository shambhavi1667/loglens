const Log = require('../models/Log')
const User = require('../models/User')

const ingestLog = async (req, res) => {
  try {

    // Step 1 — Read and validate API key
    const apiKey = req.headers['x-api-key']
    if (!apiKey) {
      return res.status(401).json({ message: 'API key missing' })
    }

    // Step 2 — Find the user
    const user = await User.findOne({ apiKey })
    if (!user) {
      return res.status(401).json({ message: 'Invalid API key' })
    }

    // Step 3 — Read the batch of logs
    const { logs } = req.body

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ message: 'logs array is required' })
    }

    // Step 4 — Attach userId to every log in the batch
    const logsToInsert = logs.map(log => ({
      userId: user._id,
      level: log.level || 'info',
      message: log.message,
      service: log.service || 'default',
      metadata: log.metadata || {}
    }))

    // Step 5 — Insert all logs in one database operation
    const savedLogs = await Log.insertMany(logsToInsert)

    // Get the Socket.io instance
    const io = req.app.get('io')

    // Emit each new log to that user's room only
    // user._id.toString() converts MongoDB ObjectId to string
    // because room names must be strings
    savedLogs.forEach(log => {
      io.to(user._id.toString()).emit('new-log', log)
    })

    res.status(201).json({ success: true, count: savedLogs.length })

  } catch (err) {
    console.error('Log ingestion error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
const getLogs = async (req, res) => {
  try {

    // Step 1 — Who is asking?
    // req.user is set by passport from the session
    // so we already know exactly who this is
    const userId = req.user._id

    // Step 2 — Read optional filters from query params
    // example: /api/logs?level=error&service=auth-service&limit=50
    const { level, service, limit = 50 } = req.query

    // Step 3 — Build the query
    // Always filter by userId first — this is non negotiable
    const query = { userId }

    // If they want only errors, add that filter
    if (level) query.level = level

    // If they want only one specific service, add that filter
    if (service) query.service = service

    // Step 4 — Fetch from MongoDB
    // newest first (-1 = descending) as you said
    // limit controls how many logs come back at once
    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))

    res.status(200).json({
      count: logs.length,
      logs
    })

  } catch (err) {
    console.error('Get logs error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Export both functions
module.exports = { ingestLog, getLogs }

