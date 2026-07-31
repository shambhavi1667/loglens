import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { io } from 'socket.io-client'

const API = 'http://localhost:5000'

const levelColor = { info: '#10b981', warn: '#f59e0b', error: '#ef4444' }
const levelBg = { info: 'rgba(16,185,129,0.08)', warn: 'rgba(245,158,11,0.08)', error: 'rgba(239,68,68,0.08)' }
const levelBorder = { info: 'rgba(16,185,129,0.25)', warn: 'rgba(245,158,11,0.25)', error: 'rgba(239,68,68,0.25)' }

export default function Dashboard({ user }) {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [connected, setConnected] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const [insight, setInsight] = useState(null)

useEffect(() => {
  axios.get(`${API}/api/insights`, { withCredentials: true })
    .then(res => setInsight(res.data.insight))
    .catch(err => console.error('Failed to fetch insight:', err))
}, [])

  useEffect(() => {
    axios.get(`${API}/api/logs`, { withCredentials: true })
      .then(res => setLogs(res.data.logs))
      .catch(err => console.error('Failed to fetch logs:', err))
  }, [])

  useEffect(() => {
    const socket = io(API, { withCredentials: true, transports: ['websocket', 'polling'] })
    socket.on('connect', () => { setConnected(true); socket.emit('join', user._id) })
    socket.on('disconnect', () => setConnected(false))
    socket.on('new-log', (log) => setLogs(prev => [log, ...prev]))
    return () => socket.disconnect()
  }, [user._id])

  const handleLogout = () => { window.location.href = `${API}/auth/logout` }

  const handleCopy = () => {
    navigator.clipboard.writeText(user.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.level === filter)
  const errorCount = logs.filter(l => l.level === 'error').length
  const warnCount = logs.filter(l => l.level === 'warn').length

  return (
    <div style={{
      minHeight: '100vh', background: '#0b0d14',
      display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif"
    }}>

      {/* SIDEBAR */}
      <aside style={{
        width: '240px', minHeight: '100vh',
        background: '#0f1117',
        borderRight: '1px solid rgba(108,99,255,0.1)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50
      }}>

        {/* Logo */}
        <div style={{
          padding: '22px 20px',
          borderBottom: '1px solid rgba(108,99,255,0.08)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, #6C63FF, #3B82F6)',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 900, color: 'white', fontFamily: 'monospace'
          }}>LL</div>
          <span style={{ fontWeight: 800, fontSize: '17px', color: '#fff', letterSpacing: '-0.01em' }}>
            LogLens
          </span>
        </div>

        {/* Settings */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(108,99,255,0.08)' }}>
          <button
            onClick={() => setSettingsOpen(o => !o)}
            style={{
              width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 14px', borderRadius: '8px',
              background: settingsOpen ? 'rgba(108,99,255,0.12)' : 'rgba(108,99,255,0.05)',
              border: `1px solid ${settingsOpen ? 'rgba(108,99,255,0.25)' : 'rgba(108,99,255,0.1)'}`,
              color: settingsOpen ? '#6C63FF' : '#8892a4',
              fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s'
            }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'monospace' }}>◎</span> Settings
            </span>
            <span style={{
              fontSize: '10px', color: settingsOpen ? '#6C63FF' : '#3a4055',
              display: 'inline-block', transition: 'transform 0.2s',
              transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>▼</span>
          </button>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  marginTop: '10px', background: '#0b0d14',
                  border: '1px solid rgba(108,99,255,0.1)',
                  borderRadius: '8px', padding: '14px'
                }}>
                  <div style={{
                    fontSize: '10px', color: '#3a4055', fontWeight: 700,
                    letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'monospace'
                  }}>API KEY</div>
                  <code style={{
                    fontSize: '11px', color: '#6C63FF', fontFamily: 'monospace',
                    wordBreak: 'break-all', lineHeight: 1.6, display: 'block', marginBottom: '10px'
                  }}>{user.apiKey}</code>
                  <button onClick={handleCopy} style={{
                    width: '100%',
                    background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(108,99,255,0.1)',
                    border: `1px solid ${copied ? 'rgba(16,185,129,0.25)' : 'rgba(108,99,255,0.2)'}`,
                    borderRadius: '6px', padding: '7px',
                    color: copied ? '#10b981' : '#6C63FF',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.2s'
                  }}>{copied ? '✓ Copied' : 'Copy API Key'}</button>

                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(108,99,255,0.08)' }}>
                    <div style={{
                      fontSize: '10px', color: '#3a4055', fontWeight: 700,
                      letterSpacing: '0.1em', marginBottom: '10px', fontFamily: 'monospace'
                    }}>ACCOUNT</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <img src={user.avatar} alt={user.name}
                        style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(108,99,255,0.3)' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#c8d0e0' }}>{user.name}</div>
                        <div style={{ fontSize: '10px', color: '#3a4055' }}>{user.email}</div>
                      </div>
                    </div>
                    <button onClick={handleLogout} style={{
                      width: '100%', background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px', padding: '7px',
                      color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600
                    }}>Sign out</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div style={{ padding: '16px 14px', flex: 1 }}>
          <div style={{
            fontSize: '10px', color: '#3a4055', fontWeight: 700,
            letterSpacing: '0.1em', marginBottom: '12px',
            fontFamily: 'monospace', paddingLeft: '4px'
          }}>OVERVIEW</div>

          {[
            { label: 'Total Logs', value: logs.length, color: '#6C63FF', bg: 'rgba(108,99,255,0.06)', border: 'rgba(108,99,255,0.12)' },
            { label: 'Errors', value: errorCount, color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.12)' },
            { label: 'Warnings', value: warnCount, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.12)' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: stat.bg, border: `1px solid ${stat.border}`,
              borderRadius: '8px', padding: '14px 16px', marginBottom: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '13px', color: '#5a6480', fontWeight: 500 }}>{stat.label}</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: stat.color, letterSpacing: '-0.02em' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Live status */}
        <div style={{ padding: '14px', borderTop: '1px solid rgba(108,99,255,0.08)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px',
            background: connected ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
            border: `1px solid ${connected ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
            borderRadius: '8px'
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: connected ? '#10b981' : '#ef4444',
              boxShadow: connected ? '0 0 6px #10b981' : 'none', flexShrink: 0
            }} />
            <span style={{
              fontSize: '12px', fontWeight: 600,
              color: connected ? '#10b981' : '#ef4444',
              letterSpacing: '0.04em', fontFamily: 'monospace'
            }}>{connected ? 'LIVE' : 'OFFLINE'}</span>
            {connected && (
              <span style={{ fontSize: '11px', color: '#2d5a47', marginLeft: 'auto' }}>streaming</span>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Top navbar */}
        <header style={{
          height: '62px', borderBottom: '1px solid rgba(108,99,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', background: '#0b0d14',
          position: 'sticky', top: 0, zIndex: 40, flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
              Live Log Feed
            </span>
            <span style={{ fontSize: '12px', color: '#3a4055', fontFamily: 'monospace' }}>
              {filteredLogs.length} events
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'info', label: 'Info' },
                { key: 'warn', label: 'Warn' },
                { key: 'error', label: 'Error' },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  background: filter === f.key ? 'rgba(108,99,255,0.15)' : 'transparent',
                  border: `1px solid ${filter === f.key ? 'rgba(108,99,255,0.4)' : 'rgba(108,99,255,0.1)'}`,
                  borderRadius: '6px', padding: '6px 16px',
                  color: filter === f.key ? '#6C63FF' : '#4a5568',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  transition: 'all 0.15s', letterSpacing: '0.02em'
                }}>{f.label}</button>
              ))}
            </div>

            <div style={{ width: 1, height: 24, background: 'rgba(108,99,255,0.1)' }} />

            {/* User + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={user.avatar} alt={user.name}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(108,99,255,0.3)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#c8d0e0' }}>{user.name}</span>
              <button onClick={handleLogout} style={{
                background: 'transparent',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '6px', padding: '6px 14px',
                color: '#ef4444', cursor: 'pointer',
                fontSize: '12px', fontWeight: 600,
                transition: 'all 0.15s'
              }}>Logout</button>
            </div>
          </div>
        </header>

        {/* AI Insights Panel */}
{insight && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      margin: '24px 32px',
      background: 'rgba(108,99,255,0.06)',
      border: '1px solid rgba(108,99,255,0.2)',
      borderRadius: '10px', overflow: 'hidden'
    }}>

    {/* Panel header */}
    <div style={{
      padding: '12px 20px',
      borderBottom: '1px solid rgba(108,99,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '13px', fontFamily: 'monospace', color: '#6C63FF' }}>◈</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>AI Insights</span>
        <span style={{
          fontSize: '11px', color: '#6C63FF',
          background: 'rgba(108,99,255,0.1)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '4px', padding: '2px 8px',
          fontFamily: 'monospace'
        }}>
          {insight.errorCount} errors analysed
        </span>
      </div>
      <span style={{ fontSize: '11px', color: '#3a4055', fontFamily: 'monospace' }}>
        {new Date(insight.generatedAt).toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', hour12: false
        })}
      </span>
    </div>

    {/* Summary */}
    <div style={{ padding: '16px 20px' }}>
      <p style={{
        fontSize: '14px', color: '#8892a4',
        lineHeight: 1.7, marginBottom: insight.topIssues.length > 0 ? '16px' : 0
      }}>
        {insight.summary}
      </p>

      {/* Top issues */}
      {insight.topIssues.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {insight.topIssues.map((issue, i) => (
            <div key={i} style={{
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.12)',
              borderRadius: '8px', padding: '12px 16px',
              display: 'flex', gap: '16px', alignItems: 'flex-start'
            }}>
              <div style={{
                fontSize: '10px', fontWeight: 800,
                color: 'rgba(239,68,68,0.5)',
                fontFamily: 'monospace', paddingTop: '2px', minWidth: '20px'
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>
                  {issue.cause}
                </div>
                <div style={{ fontSize: '12px', color: '#5a6480', lineHeight: 1.5 }}>
                  → {issue.suggestion}
                </div>
              </div>
              <div style={{
                fontSize: '12px', color: '#ef4444',
                fontFamily: 'monospace', fontWeight: 700,
                minWidth: '40px', textAlign: 'right'
              }}>
                ×{issue.count}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
)}

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '80px 1fr 160px 110px',
          padding: '12px 32px', borderBottom: '1px solid rgba(108,99,255,0.08)',
          background: 'rgba(108,99,255,0.02)', flexShrink: 0
        }}>
          {['LEVEL', 'MESSAGE', 'SERVICE', 'TIME'].map(col => (
            <span key={col} style={{
              fontSize: '11px', fontWeight: 700, color: '#3a4055',
              letterSpacing: '0.1em', fontFamily: 'monospace'
            }}>{col}</span>
          ))}
        </div>

        {/* Table header */}


        {/* Log rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredLogs.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', minHeight: '400px',
              color: '#3a4055', textAlign: 'center'
            }}>
              <div style={{ fontFamily: 'monospace', fontSize: '36px', marginBottom: '16px', opacity: 0.3 }}>[ ]</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#4a5568', marginBottom: '8px' }}>No events yet</div>
              <div style={{ fontSize: '13px', color: '#3a4055', marginBottom: '16px' }}>Install the SDK and start logging</div>
              <code style={{
                fontSize: '13px', color: '#6C63FF',
                background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)',
                borderRadius: '6px', padding: '8px 16px'
              }}>npm install loglens-sdk</code>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredLogs.map((log, i) => (
                <motion.div
                  key={log._id || i}
                  initial={{ opacity: 0, backgroundColor: 'rgba(108,99,255,0.08)' }}
                  animate={{ opacity: 1, backgroundColor: 'transparent' }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr 160px 110px',
                    padding: '15px 32px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                    alignItems: 'center', cursor: 'default'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Level */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: levelBg[log.level], color: levelColor[log.level],
                    border: `1px solid ${levelBorder[log.level]}`,
                    borderRadius: '5px', padding: '4px 0',
                    fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                    fontFamily: 'monospace', letterSpacing: '0.05em', width: '52px'
                  }}>{log.level}</span>

                  {/* Message */}
                  <span style={{
                    fontSize: '15px', color: '#c8d0e0', fontWeight: 400, lineHeight: 1.4,
                    paddingRight: '24px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{log.message}</span>

                  {/* Service */}
                  <span style={{ fontSize: '13px', color: '#5a6480', fontFamily: 'monospace', fontWeight: 500 }}>
                    {log.service}
                  </span>

                  {/* Time */}
                  <span style={{ fontSize: '13px', color: '#3a4055', fontFamily: 'monospace' }}>
                    {new Date(log.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                    })}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  )
}