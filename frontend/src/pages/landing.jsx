import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: '▶',
    title: 'Real-time Log Feed',
    desc: 'Logs appear on your dashboard within milliseconds of being generated. No polling. No refresh.'
  },
  {
    icon: '◈',
    title: 'AI Error Analysis',
    desc: 'AI reads your error clusters every few minutes and surfaces root causes in plain English — not stack traces.'
  },
  {
    icon: '⬡',
    title: 'One Line Install',
    desc: 'npm install loglens-sdk — drop into any Node.js project. Your first log ships in under 60 seconds.'
  },
  {
    icon: '◎',
    title: 'Fully Isolated',
    desc: 'API key isolation at the database level. Every query is scoped to your userId. Zero cross-contamination.'
  },
  {
    icon: '◬',
    title: 'Smart Alerts',
    desc: 'Anomaly detection fires when error rate exceeds 2x your rolling baseline. Catch spikes before users do.'
  },
]

const steps = [
  { step: '01', title: 'Sign up with Google', desc: 'One click. No forms. No passwords. API key auto-generated.' },
  { step: '02', title: 'Install the SDK', desc: 'npm install loglens-sdk — one command in your existing project.' },
  { step: '03', title: 'Replace console.log', desc: 'log.info(), log.warn(), log.error() — same API, real monitoring.' },
  { step: '04', title: 'Watch logs live', desc: 'Open your dashboard. See every event as it happens, in real time.' },
]

export default function Landing({ user }) {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15, 17, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(108, 99, 255, 0.12)'
      }}>
        <div style={{
          fontSize: '18px', fontWeight: 800, color: '#6C63FF',
          letterSpacing: '0.04em', fontFamily: 'monospace'
        }}>
          LogLens
        </div>
        <button
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          style={{
            background: 'linear-gradient(135deg, #6C63FF, #3B82F6)',
            border: 'none', borderRadius: '8px',
            padding: '9px 22px', color: 'white',
            fontWeight: 600, cursor: 'pointer', fontSize: '13px',
            letterSpacing: '0.02em'
          }}>
          {user ? 'Dashboard' : 'Get Started'}
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(108,99,255,0.10) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '8%',
          width: '280px', height: '280px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', maxWidth: '820px', zIndex: 1 }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(108, 99, 255, 0.08)',
            border: '1px solid rgba(108, 99, 255, 0.25)',
            borderRadius: '4px', padding: '5px 14px',
            fontSize: '12px', color: '#6C63FF',
            marginBottom: '36px', fontWeight: 600,
            fontFamily: 'monospace', letterSpacing: '0.08em'
          }}>
            <span style={{ color: '#10b981' }}>●</span> LIVE MONITORING
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 68px)',
            fontWeight: 800, lineHeight: 1.08,
            marginBottom: '28px',
            letterSpacing: '-0.02em'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c7cde0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Your logs are talking.
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Start listening.
            </span>
          </h1>

          <p style={{
            fontSize: '17px', color: '#6b7694',
            lineHeight: 1.75, marginBottom: '44px',
            maxWidth: '520px', margin: '0 auto 44px',
            fontWeight: 400
          }}>
            One npm package. Every log your app generates flows into a real-time dashboard —
            with an AI layer that groups errors, finds patterns, and tells you
            what to fix before your users notice.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              style={{
                background: 'linear-gradient(135deg, #6C63FF, #3B82F6)',
                border: 'none', borderRadius: '8px',
                padding: '13px 30px', color: 'white',
                fontWeight: 700, cursor: 'pointer', fontSize: '15px',
                boxShadow: '0 0 28px rgba(108,99,255,0.35)',
                letterSpacing: '0.01em'
              }}>
              {user ? 'Open Dashboard →' : 'Start Monitoring Free →'}
            </motion.button>
          </div>
        </motion.div>

        {/* Code card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            marginTop: '72px', zIndex: 1,
            background: 'rgba(13, 16, 26, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(108,99,255,0.18)',
            borderRadius: '12px', padding: '24px 28px',
            maxWidth: '520px', width: '100%',
            boxShadow: '0 0 60px rgba(108,99,255,0.08)',
            fontFamily: 'monospace'
          }}>
          {/* Terminal dots */}
          <div style={{ display: 'flex', gap: '7px', marginBottom: '20px' }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
            <span style={{ marginLeft: '8px', fontSize: '11px', color: '#3a4055', alignSelf: 'center' }}>
              your-app/index.js
            </span>
          </div>
          <pre style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: 2.0, color: '#8892a4', margin: 0 }}>
            <span style={{ color: '#4a5568' }}>$</span>
            <span style={{ color: '#6b7694' }}> npm install loglens-sdk</span>{'\n\n'}
            <span style={{ color: '#6C63FF' }}>import</span>
            <span style={{ color: '#8892a4' }}> Logger </span>
            <span style={{ color: '#6C63FF' }}>from</span>
            <span style={{ color: '#10b981' }}> 'loglens-sdk'</span>{'\n'}
            <span style={{ color: '#6C63FF' }}>const</span>
            <span style={{ color: '#8892a4' }}> log </span>
            <span style={{ color: '#6C63FF' }}>=</span>
            <span style={{ color: '#8892a4' }}> new Logger({'{'} apiKey: </span>
            <span style={{ color: '#10b981' }}>'lk_...'</span>
            <span style={{ color: '#8892a4' }}> {'}'})</span>{'\n\n'}
            <span style={{ color: '#8892a4' }}>log.</span>
            <span style={{ color: '#3B82F6' }}>info</span>
            <span style={{ color: '#8892a4' }}>('Server started', {'{'} port: 3000 {'}'})</span>{'\n'}
            <span style={{ color: '#8892a4' }}>log.</span>
            <span style={{ color: '#ef4444' }}>error</span>
            <span style={{ color: '#8892a4' }}>('DB connection failed', {'{'} retries: 3 {'}'})</span>
          </pre>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{
        padding: '100px 48px',
        borderTop: '1px solid rgba(108,99,255,0.08)',
        maxWidth: '1200px', margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '56px' }}
        >
          <div style={{
            fontSize: '11px', color: '#6C63FF', fontWeight: 700,
            letterSpacing: '0.12em', marginBottom: '16px',
            fontFamily: 'monospace'
          }}>
            CAPABILITIES
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 800, letterSpacing: '-0.02em',
            color: '#ffffff', maxWidth: '520px', lineHeight: 1.15
          }}>
            Built for engineers who ship fast and break things.
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1px',
          background: 'rgba(108,99,255,0.1)',
          border: '1px solid rgba(108,99,255,0.1)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ background: 'rgba(108,99,255,0.06)' }}
              style={{
                background: 'rgba(13, 16, 26, 0.95)',
                padding: '32px 28px',
                transition: 'background 0.2s'
              }}>
              <div style={{
                fontSize: '13px', color: '#6C63FF',
                fontFamily: 'monospace', marginBottom: '16px',
                fontWeight: 700, letterSpacing: '0.06em'
              }}>
                {f.icon} {String(i + 1).padStart(2, '0')}
              </div>
              <h3 style={{
                fontSize: '16px', fontWeight: 700,
                marginBottom: '10px', color: '#e2e8f0',
                letterSpacing: '-0.01em'
              }}>
                {f.title}
              </h3>
              <p style={{
                color: '#5a6480', lineHeight: 1.65,
                fontSize: '14px', fontWeight: 400
              }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: '100px 48px',
        borderTop: '1px solid rgba(108,99,255,0.08)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '56px' }}
          >
            <div style={{
              fontSize: '11px', color: '#6C63FF', fontWeight: 700,
              letterSpacing: '0.12em', marginBottom: '16px',
              fontFamily: 'monospace'
            }}>
              SETUP
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800, letterSpacing: '-0.02em',
              color: '#ffffff', lineHeight: 1.15
            }}>
              From zero to monitoring in four steps.
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '28px',
                  background: 'rgba(13, 16, 26, 0.8)',
                  border: '1px solid rgba(108,99,255,0.1)',
                  borderRadius: '8px', padding: '24px 28px',
                  marginBottom: '2px'
                }}>
                <div style={{
                  fontSize: '13px', fontWeight: 800,
                  color: 'rgba(108,99,255,0.4)',
                  fontFamily: 'monospace', minWidth: '28px',
                  paddingTop: '2px'
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{
                    fontSize: '15px', fontWeight: 700,
                    marginBottom: '5px', color: '#e2e8f0'
                  }}>
                    {s.title}
                  </div>
                  <div style={{ color: '#5a6480', fontSize: '14px', lineHeight: 1.6 }}>
                    {s.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 48px',
        borderTop: '1px solid rgba(108,99,255,0.08)',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: '560px', margin: '0 auto',
            background: 'rgba(13, 16, 26, 0.9)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '16px', padding: '64px 48px',
            boxShadow: '0 0 80px rgba(108,99,255,0.07)'
          }}>
          <div style={{
            fontSize: '11px', color: '#6C63FF', fontWeight: 700,
            letterSpacing: '0.12em', marginBottom: '20px',
            fontFamily: 'monospace'
          }}>
            GET STARTED
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 800, marginBottom: '16px',
            letterSpacing: '-0.02em', lineHeight: 1.15,
            color: '#ffffff'
          }}>
            Your next production bug<br />deserves a proper investigation.
          </h2>
          <p style={{
            color: '#5a6480', marginBottom: '40px',
            fontSize: '15px', lineHeight: 1.7
          }}>
            Free to start. One npm install. No credit card.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            style={{
              background: 'linear-gradient(135deg, #6C63FF, #3B82F6)',
              border: 'none', borderRadius: '8px',
              padding: '14px 36px', color: 'white',
              fontWeight: 700, cursor: 'pointer', fontSize: '15px',
              boxShadow: '0 0 32px rgba(108,99,255,0.3)',
              letterSpacing: '0.01em'
            }}>
            {user ? 'Open Dashboard →' : 'Start for Free →'}
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '28px 48px',
        borderTop: '1px solid rgba(108,99,255,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#2d3347', fontSize: '13px', fontFamily: 'monospace'
      }}>
        <div style={{ fontWeight: 800, color: '#6C63FF', fontSize: '15px' }}>LogLens</div>
        <div>© 2025 LogLens</div>
      </footer>

    </div>
  )
}