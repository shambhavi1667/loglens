import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    // Validation
    if (mode === 'register') {
      if (!form.name || !form.email || !form.password || !form.confirm) {
        return setError('All fields are required')
      }
      if (form.password !== form.confirm) {
        return setError('Passwords do not match')
      }
      if (form.password.length < 6) {
        return setError('Password must be at least 6 characters')
      }
    } else {
      if (!form.email || !form.password) {
        return setError('All fields are required')
      }
    }

    setLoading(true)
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const body = mode === 'register'
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password }

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong')
      } else {
        if (mode === 'register') {
          setSuccess('Account created! Check your email to verify.')
          setForm({ name: '', email: '', password: '', confirm: '' })
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(108,99,255,0.2)', borderRadius: '10px',
    padding: '14px 16px', color: 'white', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    marginBottom: '12px'
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1117',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'rgba(26, 32, 53, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '24px', padding: '48px',
          width: '100%', maxWidth: '440px',
          textAlign: 'center', zIndex: 1,
          boxShadow: '0 0 80px rgba(108,99,255,0.1)'
        }}>

        {/* Logo */}
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#6C63FF', marginBottom: '4px' }}>
          LogLens
        </div>
        <div style={{ color: '#8892a4', fontSize: '13px', marginBottom: '32px' }}>
          AI-Powered Log Monitoring
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px', padding: '4px', marginBottom: '32px'
        }}>
          {['login', 'register'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontWeight: 600, fontSize: '14px',
              transition: 'all 0.2s',
              background: mode === m ? 'linear-gradient(135deg, #6C63FF, #3B82F6)' : 'transparent',
              color: mode === m ? 'white' : '#8892a4'
            }}>
              {m === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'register' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'register' ? -20 : 20 }}
            transition={{ duration: 0.2 }}
          >
            {mode === 'register' && (
              <input
                name="name" placeholder="Full name"
                value={form.name} onChange={handleChange}
                style={inputStyle}
              />
            )}
            <input
              name="email" placeholder="Email address" type="email"
              value={form.email} onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="password" placeholder="Password" type="password"
              value={form.password} onChange={handleChange}
              style={inputStyle}
            />
            {mode === 'register' && (
              <input
                name="confirm" placeholder="Confirm password" type="password"
                value={form.confirm} onChange={handleChange}
                style={{ ...inputStyle, marginBottom: '0' }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error / Success */}
        {error && (
          <div style={{ color: '#fc8181', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ color: '#68d391', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
            {success}
          </div>
        )}

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', marginTop: '16px',
            background: 'linear-gradient(135deg, #6C63FF, #3B82F6)',
            border: 'none', borderRadius: '12px',
            padding: '14px', color: 'white',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '15px', opacity: loading ? 0.7 : 1
          }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </motion.button>

        {/* OR divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          margin: '24px 0', color: '#4a5568', fontSize: '13px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          OR
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Google button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(108,99,255,0.2)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '12px', padding: '14px',
            color: 'white', fontWeight: 600,
            cursor: 'pointer', fontSize: '15px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '12px'
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </motion.button>

        <p style={{ color: '#4a5568', fontSize: '12px', marginTop: '24px', lineHeight: 1.6 }}>
          By continuing you agree to our terms of service.
        </p>
      </motion.div>
    </div>
  )
}