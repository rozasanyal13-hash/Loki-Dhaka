// Server-side token verification API
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { payload, token, expiresAt } = req.body || {}
  if (!payload || !token || !expiresAt) return res.status(400).json({ verified: false })

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
    const ok = expected === token && Math.abs(now - genTs) <= windowMs
    return res.status(200).json({ verified: ok })
  } catch (e) {
    return res.status(500).json({ error: 'Verification failed' })
  }
}
