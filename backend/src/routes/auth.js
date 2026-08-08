const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const router = express.Router()
const User = require('../models/User')
const { sendVerificationEmail } = require('../config/email')

// ─── Google OAuth ───────────────────────────────────────────

// Step 1 — redirect to Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Step 2 — Google redirects back here
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL + '/dashboard')
  }
)

// ─── Local Auth ──────────────────────────────────────────────

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    res.status(201).json({ message: 'Account created. Please check your email to verify.' })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token })

    if (!user) {
      return res.status(400).send('Invalid or expired verification link.')
    }

    user.isVerified = true
    user.verificationToken = null
    await user.save()

    // Redirect to login with success message
    res.redirect(process.env.CLIENT_URL + '/login?verified=true')
  } catch (err) {
    console.error('Verify email error:', err)
    res.status(500).send('Something went wrong')
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Check verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' })
    }

    // Create session
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login failed' })
      res.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        apiKey: user.apiKey
      })
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ─── Common ──────────────────────────────────────────────────

// Get current logged in user
router.get('/me', (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      apiKey: req.user.apiKey
    })
  } else {
    res.status(401).json({ message: 'Not logged in' })
  }
})

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL)
  })
})

module.exports = router