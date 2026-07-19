import { generateHmac } from './hmac'

export async function verifyToken(secret, data) {
  if (!data || !data.payload || !data.token || !data.expiresAt) return false
  const genTs = data.expiresAt - 30000
  const message = `${data.payload}|${genTs}`
  const expected = await generateHmac(secret, message)
  if (expected !== data.token) return false
  const now = Date.now()
  // allow ±1 window of 30s (i.e., 30s before to 60s after genTs?)
  const windowMs = 30_000
  if (Math.abs(now - genTs) > windowMs * 1) return false
  return true
}
