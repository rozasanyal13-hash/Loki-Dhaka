// Client-side HMAC helper using Web Crypto API
export async function generateHmac(secret, message) {
  const enc = new TextEncoder()
  const keyData = enc.encode(secret)
  const msgData = enc.encode(message)
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, msgData)
  const arr = Array.from(new Uint8Array(sig))
  return arr.map(b => b.toString(16).padStart(2,'0')).join('')
}

export async function generateHmacToken(secret, payload) {
  const ts = Date.now()
  const message = `${payload}|${ts}`
  const token = await generateHmac(secret, message)
  // token validity: 30 seconds
  return { token, expiresAt: ts + 30_000 }
}
