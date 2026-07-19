import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { verifyToken } from '../src/utils/verify'

export default function Scan() {
  const scannerRef = useRef(null)
  const [message, setMessage] = useState('')

  useEffect(()=>{
    const regionId = 'qr-reader'
    const html5QrCode = new Html5Qrcode(regionId)
    scannerRef.current = html5QrCode

    html5QrCode.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 },
      (decodedText)=>{
        try {
          const data = JSON.parse(decodedText)
          const ok = verifyToken(process.env.NEXT_PUBLIC_LOKI_SECRET || process.env.REACT_APP_LOKI_SECRET || '', data)
          setMessage(ok ? `Verified: ${data.payload}` : 'Invalid or expired token')
          // stop after successful scan
          html5QrCode.stop().catch(()=>{})
        } catch (e) {
          setMessage('Invalid QR format')
        }
      },
      (error)=>{
        // ignore decode errors
      }
    ).catch(err=>setMessage('Camera access denied or unavailable'))

    return ()=>{
      if (scannerRef.current) {
        scannerRef.current.stop().catch(()=>{})
        scannerRef.current.clear().catch(()=>{})
      }
    }
  },[])

  return (
    <main style={{padding:20}}>
      <h1>Scan QR</h1>
      <div id="qr-reader" style={{width:300,height:300}} />
      <p>{message}</p>
    </main>
  )
}
