// Server-side token verification API
// Simple in-memory rate limiter (per IP) and timing-safe verification
const rateMap = new Map()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 60 // max requests per window per IP

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateMap.get(ip) || { count: 0, start: now }
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    rateMap.set(ip, { count: 1, start: now })
    return false
  }
  entry.count += 1
  rateMap.set(ip, entry)
  return entry.count > RATE_LIMIT_MAX
}

function timingSafeEqualHex(a, b) {
  try {
    const crypto = require('crypto')
    const ab = Buffer.from(a, 'hex')
    const bb = Buffer.from(b, 'hex')
    if (ab.length !== bb.length) return false
    return crypto.timingSafeEqual(ab, bb)
  } catch (e) {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { payload, token, expiresAt } = req.body || {}
  if (!payload || !token || !expiresAt) return res.status(400).json({ verified: false })

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  if (isRateLimited(ip)) return res.status(429).json({ error: 'Rate limit exceeded' })

  const secret = process.env.REACT_APP_LOKI_SECRET || process.env.NEXT_PUBLIC_LOKI_SECRET || ''
  if (!secret) return res.status(500).json({ error: 'Server secret not configured' })

  try {
    const genTs = Number(expiresAt) - 30000
    const crypto = require('crypto')
    const h = crypto.createHmac('sha256', secret)
    h.update(`${payload}|${genTs}`)
    const expected = h.digest('hex')
    const now = Date.now()
    const windowMs = 30_000
    const okTime = Math.abs(now - genTs) <= windowMs
    const okSig = timingSafeEqualHex(expected, String(token))
    const ok = okTime && okSig
    return res.status(200).json({ verified: ok })
  } catch (e) {
    return res.status(500).json({ error: 'Verification failed' })
  }
}
