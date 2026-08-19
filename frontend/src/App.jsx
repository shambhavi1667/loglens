import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Landing from './pages/landinganding'
import Login from './pages/loginogin'
import Dashboard from './pages/dashboard'

const API = 'http://localhost:5000'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on app load
  useEffect(() => {
    axios.get(`${API}/auth/me`, { withCredentials: true })
      .then(res => {
        console.log('User data from /auth/me:', res.data)
        setUser(res.data)
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f1117'
      }}>
        <div style={{ color: '#6C63FF', fontSize: '18px' }}>Loading...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <Login />
        } />
        <Route path="/dashboard" element={
          user ? <Dashboard user={user} /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
