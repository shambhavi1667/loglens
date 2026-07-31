import { motion } from 'framer-motion'

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google'
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
          borderRadius: '24px', padding: '56px 48px',
          width: '100%', maxWidth: '440px',
          textAlign: 'center', zIndex: 1,
          boxShadow: '0 0 80px rgba(108,99,255,0.1)'
        }}>

        {/* Logo */}
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#6C63FF', marginBottom: '8px' }}>
          LogLens
        </div>
        <div style={{ color: '#8892a4', fontSize: '14px', marginBottom: '40px' }}>
          AI-Powered Log Monitoring
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '12px' }}>
          Welcome back
        </h1>
        <p style={{ color: '#8892a4', marginBottom: '40px', lineHeight: 1.6 }}>
          Sign in to access your real-time log dashboard
        </p>

        {/* Google login button */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(108,99,255,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #6C63FF, #3B82F6)',
            border: 'none', borderRadius: '12px',
            padding: '16px', color: 'white',
            fontWeight: 700, cursor: 'pointer', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </motion.button>

        <p style={{ color: '#4a5568', fontSize: '13px', marginTop: '32px', lineHeight: 1.6 }}>
          By signing in you agree to our terms of service.
          <br />No password required.
        </p>
      </motion.div>
    </div>
  )
}