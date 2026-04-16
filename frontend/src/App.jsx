import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Issues from './components/Issues'
import Announcements from './components/Announcements'
import AdminPanel from './components/AdminPanel'
import api from './services/api'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))

  useEffect(() => {
    if (token) {
      api.setToken(token)
    }
  }, [token])

  if (!token) return <Login onLogin={(t, r) => { setToken(t); setRole(r); localStorage.setItem('token', t); localStorage.setItem('role', r); }} />

  return (
    <div className="container">
      <header>
        <h1>Campus Ops</h1>
        <div>
          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); setToken(null); setRole(null); }}>Logout</button>
        </div>
      </header>

      <main>
        <Announcements />
        <Issues role={role} />
        {role === 'admin' && <AdminPanel />}
      </main>
    </div>
  )
}
