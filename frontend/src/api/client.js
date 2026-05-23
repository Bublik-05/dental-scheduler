import axios from 'axios'

const client = axios.create({
  baseURL: 'https://dental-scheduler-production-71a9.up.railway.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default client
