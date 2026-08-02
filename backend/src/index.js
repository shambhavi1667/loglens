const MongoStore = require("connect-mongo");
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const { createServer } = require('http')
const { Server } = require('socket.io')
const path = require('path')
const cron = require('node-cron')
const { generateInsights } = require('./services/aiService')
require('dotenv').config();

// import passport config
require('./config/passport')

const app = express();

import { createClient } from 'redis'
import RedisStore from 'connect-redis'

const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
await redisClient.connect()


// Create HTTP server from express app
// Socket.io needs a raw HTTP server, not just express
const httpServer = createServer(app)

// Attach Socket.io to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
})

// Make io accessible anywhere in your app
// You'll need it in the log controller to emit events
app.set('io', io)

//security middleware
app.use(helmet({
  contentSecurityPolicy: false
}))

//cors
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}))

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')))

//session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

//redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }
}))

// Passport initialize
app.use(passport.initialize())
app.use(passport.session())

// Routes (we'll add these soon)
app.use('/auth', require('./routes/auth'))
app.use('/api', require('./routes/api'))

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'LogLens backend running' })
})

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // When dashboard loads, frontend sends their userId
  // Backend puts them in their private room
  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })

  // When dashboard closes or user leaves
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('MongoDB connected')
    httpServer.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch(err => console.error('MongoDB connection error:', err))

  // Run AI insight generation every 5 minutes
cron.schedule('*/5 * * * *', () => {
  generateInsights()
})

// Also run once on startup after 10 seconds
setTimeout(() => generateInsights(), 10000)