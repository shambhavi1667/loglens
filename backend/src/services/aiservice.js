const groq = require('../config/groq')
const Log = require('../models/Log')
const Insight = require('../models/Insight')
const User = require('../models/User')

const generateInsights = async () => {
  try {
    console.log('AI: Running insight generation...')

    // Get all unique userIds that have error logs in last hour
    const recentErrors = await Log.distinct('userId', {
      level: 'error',
      timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
    })

    if (recentErrors.length === 0) {
      console.log('AI: No recent errors found, skipping')
      return
    }

    // Process each user
    for (const userId of recentErrors) {

      // Fetch last 50 error logs for this user
      const errorLogs = await Log.find({
        userId,
        level: 'error',
        timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
      })
      .sort({ timestamp: -1 })
      .limit(50)

      if (errorLogs.length === 0) continue

      // Format logs for the prompt
      const logText = errorLogs.map(l =>
        `[${new Date(l.timestamp).toISOString()}] ${l.service}: ${l.message}`
      ).join('\n')

      // Call Groq
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are an expert software engineer analyzing server error logs.
Your job is to identify patterns, root causes, and provide actionable suggestions.
Always respond with valid JSON only. No markdown, no backticks, no extra text.`
          },
          {
            role: 'user',
            content: `Analyze these error logs and identify the top issues:

${logText}

Respond with this exact JSON structure:
{
  "summary": "one paragraph plain English summary of what is breaking and why",
  "topIssues": [
    {
      "cause": "root cause in plain English",
      "count": number of related errors,
      "suggestion": "specific actionable fix"
    }
  ]
}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })

      // Parse the response
      const responseText = completion.choices[0].message.content.trim()

      let parsed
      try {
        parsed = JSON.parse(responseText)
      } catch (e) {
        console.error('AI: Failed to parse Groq response:', responseText)
        continue
      }

      // Save insight to MongoDB
      await Insight.findOneAndUpdate(
        { userId },
        {
          userId,
          summary: parsed.summary,
          errorCount: errorLogs.length,
          topIssues: parsed.topIssues || [],
          generatedAt: new Date()
        },
        { upsert: true, new: true }
      )

      console.log(`AI: Generated insight for user ${userId}`)
    }

  } catch (err) {
    console.error('AI insight generation error:', err.message)
  }
}

module.exports = { generateInsights }