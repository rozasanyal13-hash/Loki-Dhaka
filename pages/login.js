import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('dev@example.com')

  function handleLogin() {
    const user = { email, id: 'dev' }
    localStorage.setItem('loki_user', JSON.stringify(user))
    // persist mock visits array if absent
    if (!localStorage.getItem('loki_visits')) localStorage.setItem('loki_visits', JSON.stringify([]))
    window.location.href = '/'
  }

  return (
    <main style={{padding:20}}>
      <h1>Dev Login</h1>
      <label>Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block',width:300}} />
      <button onClick={handleLogin} style={{marginTop:8}}>Login</button>
    </main>
  )
}
