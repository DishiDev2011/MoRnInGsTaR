import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const client = axios.create({ baseURL: API_BASE })

export default {
  setToken: (t) => { client.defaults.headers.common['Authorization'] = `Bearer ${t}` },
  auth: {
    register: (data) => client.post('/auth/register', data),
    login: (data) => client.post('/auth/login', data)
  },
  issues: {
    create: (data) => client.post('/issues', data),
    list: () => client.get('/issues'),
    update: (id, data) => client.put(`/issues/${id}`, data)
  },
  announcements: {
    list: () => client.get('/announcements'),
    create: (data) => client.post('/announcements', data)
  },
  bookings: {
    create: (data) => client.post('/bookings', data),
    list: () => client.get('/bookings')
  }
}
