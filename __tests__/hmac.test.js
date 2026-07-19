import { generateHmac } from '../src/utils/hmac'

describe('HMAC helper', ()=>{
  it('generates expected-length hex digest', async ()=>{
    // secret and message are deterministic — this verifies format
    const hex = await generateHmac('test-secret','hello')
    expect(hex).toMatch(/^[0-9a-f]+$/)
    expect(hex.length).toBe(64)
  })
})
