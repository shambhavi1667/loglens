const express = require('express')
const passport = require('passport')
const router = express.Router()

// Step 1 — redirect to Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Step 2 — Google redirects back here
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Success — send to dashboard
    res.redirect(process.env.CLIENT_URL + '/dashboard')
  }
)

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