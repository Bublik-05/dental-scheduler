import axios from 'axios'

const client = axios.create({
  baseURL: 'https://dental-scheduler-bvay.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default client