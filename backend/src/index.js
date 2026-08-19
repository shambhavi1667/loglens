require('dotenv').config();
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
const { generateInsights } = require('./services/ai-service')
const { createClient } = require('redis')
const { RedisStore } = require('connect-redis')


require('./config/passport')

const app = express();

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
})

app.set('io', io)

// Redis
const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
redisClient.connect().then(() => console.log('Redis connected')).catch(console.error)

// Middleware
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// Session (Redis only)
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', require('./routes/auth'))
app.use('/api', require('./routes/api'))

app.use(cors({ origin: 'https://loglens-dusky.vercel.app/' }));

app.get('/', (req, res) => {
  res.json({ message: 'LogLens backend running' })
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

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

cron.schedule('*/5 * * * *', () => { generateInsights() })
setTimeout(() => generateInsights(), 10000)