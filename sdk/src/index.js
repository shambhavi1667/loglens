const axios = require('axios')

class Logger {

  constructor(config) {
    // config is what the developer passes in:
    // const log = new Logger({ apiKey: 'lk_...', service: 'auth-service' })

    if (!config.apiKey) {
      throw new Error('LogLens: apiKey is required')
    }

    this.apiKey = config.apiKey
    this.service = config.service || 'default'
    this.baseURL = config.baseURL || 'http://localhost:5000'

    // The batch — logs collect here before being sent
    this.queue = []

    // Send whatever is in the queue every 2 seconds
    this.flushInterval = setInterval(() => this.flush(), 2000)
  }

  // Internal method — adds a log to the queue
  _log(level, message, metadata = {}) {
    this.queue.push({
      level,
      message,
      service: this.service,
      metadata,
      timestamp: new Date().toISOString()
    })
  }

  // Public methods — developer calls these
  info(message, metadata = {}) {
    this._log('info', message, metadata)
  }

  warn(message, metadata = {}) {
    this._log('warn', message, metadata)
  }

  error(message, metadata = {}) {
    this._log('error', message, metadata)
  }

  // Sends everything in the queue to your backend
  async flush() {

    // Nothing to send — skip
    if (this.queue.length === 0) return

    // Take everything out of the queue
    const logsToSend = [...this.queue]
    this.queue = []

    try {
      await axios.post(
        `${this.baseURL}/api/logs/ingest`,
        { logs: logsToSend },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (err) {
      // If sending fails, put logs back in queue
      // so they don't get lost
      console.error('LogLens: Failed to send logs:', err.message)
      this.queue = [...logsToSend, ...this.queue]
    }
  }

  // Call this when your app shuts down
  // sends any remaining logs before exit
  async shutdown() {
    clearInterval(this.flushInterval)
    await this.flush()
  }
}

module.exports = Logger