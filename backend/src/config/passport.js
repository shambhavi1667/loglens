const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id })

    if (user) {
      // Existing user — just return them
      return done(null, user)
    }

    // New user — create account
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value
      // apiKey auto-generates from the model default
    })

    return done(null, user)
  } catch (err) {
    return done(err, null)
  }
}))

// Store user ID in session
passport.serializeUser((user, done) => {
  done(null, user._id)
})

// Retrieve user from session using ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})