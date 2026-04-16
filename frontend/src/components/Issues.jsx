import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function Issues({ role }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [issues, setIssues] = useState([])
  const [error, setError] = useState(null)

  async function load() {
    try {
      const r = await api.issues.list();
      setIssues(r.data.issues);
    } catch (e) { setError('Failed to load issues') }
  }

  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault();
    try {
      await api.issues.create({ title, description });
      setTitle(''); setDescription('');
      load();
    } catch (e) { setError('Failed to create issue') }
  }

  async function markInProgress(id) {
    await api.issues.update(id, { status: 'IN_PROGRESS' });
    load();
  }
  async function markResolved(id) {
    await api.issues.update(id, { status: 'RESOLVED' });
    load();
  }

  return (
    <section className="panel">
      <h3>Report an Issue</h3>
      <form onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <h4>My / All Issues</h4>
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul>
        {issues.map(i => (
          <li key={i.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 6 }}>
            <strong>{i.title}</strong> <em>({i.status})</em>
            <div>{i.description}</div>
            {role === 'admin' && (
              <div>
                <button onClick={() => markInProgress(i.id)}>Mark IN_PROGRESS</button>
                <button onClick={() => markResolved(i.id)}>Mark RESOLVED</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
