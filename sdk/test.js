const Logger = require('./src/index')

const log = new Logger({
  apiKey: 'lk_9a5d1194acfcf0cfab5134818b52ff33', // your actual key
  service: 'test-service',
  baseURL: 'http://localhost:5000'
})

// Log some things
log.info('Server started successfully', { port: 3000 })
log.warn('Memory usage high', { usage: '87%' })
log.error('Database connection failed', { retries: 3, host: 'localhost' })

console.log('Logs queued. Waiting for flush...')

// Wait 3 seconds then check if they were sent
setTimeout(async () => {
  await log.shutdown()
  console.log('Done. Check your MongoDB Atlas logs collection.')
}, 3000)