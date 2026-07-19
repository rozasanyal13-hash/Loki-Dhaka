import { generateHmacToken } from '../src/utils/hmac'
import { verifyToken } from '../src/utils/verify'

test('verifyToken returns true for valid token', async ()=>{
  const secret = 'test-secret'
  const { token, expiresAt } = await generateHmacToken(secret, 'payload-1')
  const ok = await verifyToken(secret, { payload: 'payload-1', token, expiresAt })
  expect(ok).toBe(true)
})

test('verifyToken rejects tampered token', async ()=>{
  const secret = 'test-secret'
  const { token, expiresAt } = await generateHmacToken(secret, 'payload-1')
  const ok = await verifyToken(secret, { payload: 'payload-1', token: token.replace(/.$/,'0'), expiresAt })
  expect(ok).toBe(false)
})
