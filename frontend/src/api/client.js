import axios from 'axios'

// Always use /api — Vite proxies it in dev, Vercel rewrites it in prod
const client = axios.create({
  baseURL: '/api',
  withCredentials: true,  // sends session cookie on every request
  headers: {
    'Content-Type': 'application/json',
  },
})

export default client
