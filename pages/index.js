import { useState } from 'react'
import QRCode from 'qrcode.react'
import { generateHmacToken } from '../src/utils/hmac'

export default function Home() {
  const [payload, setPayload] = useState('user:123')
  const [token, setToken] = useState('')
  const [expiresAt, setExpiresAt] = useState(null)

  async function handleGenerate() {
    const secret = process.env.NEXT_PUBLIC_LOKI_SECRET || ''
    const { token: t, expiresAt: e } = await generateHmacToken(secret, payload)
    setToken(t)
    setExpiresAt(e)
  }

  return (
    <main style={{padding:20}}>
      <h1>Loki Secure QR (demo)</h1>
      <label>Payload</label>
      <input value={payload} onChange={e=>setPayload(e.target.value)} style={{display:'block',width:400}} />
      <button onClick={handleGenerate} style={{marginTop:8}}>Generate token & QR</button>

      {token && (
        <div style={{marginTop:16}}>
          <p>Token (HMAC-SHA256): {token}</p>
          <p>Expires at: {new Date(expiresAt).toLocaleString()}</p>
          <QRCode value={JSON.stringify({payload, token, expiresAt})} size={256} />
        </div>
      )}
    </main>
  )
}
