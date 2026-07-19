// HMAC helper: prefer Web Crypto in browsers, fall back to Node's crypto in tests/server
export async function generateHmac(secret, message) {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    const enc = new TextEncoder()
    const keyData = enc.encode(secret)
    const msgData = enc.encode(message)
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', key, msgData)
    const arr = Array.from(new Uint8Array(sig))
    return arr.map(b => b.toString(16).padStart(2,'0')).join('')
  }

  // Node fallback
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require('crypto')
    const h = nodeCrypto.createHmac('sha256', secret)
    h.update(message)
    return h.digest('hex')
  } catch (e) {
    throw new Error('No crypto available for HMAC')
  }
}

export async function generateHmacToken(secret, payload) {
  const ts = Date.now()
  const message = `${payload}|${ts}`
  const token = await generateHmac(secret, message)
  // token validity: 30 seconds
  return { token, expiresAt: ts + 30_000 }
}
