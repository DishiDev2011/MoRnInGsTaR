import React, { useState } from 'react'
import api from '../services/api'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [err, setErr] = useState(null)

  async function submit(e) {
    e.preventDefault()
    try {
      if (isRegister) {
        const r = await api.auth.register({ name, email, password })
        onLogin(r.data.token, 'student')
      } else {
        const r = await api.auth.login({ email, password })
        onLogin(r.data.token, r.data.role)
      }
    } catch (e) {
      setErr(e.response?.data?.error || 'Request failed')
    }
  }

  return (
    <div className="login">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={submit}>
        {isRegister && <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />}
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <div style={{ color: 'red' }}>{err}</div>
      <div>
        <button onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Have an account? Login' : 'New? Register'}</button>
      </div>
    </div>
  )
}
