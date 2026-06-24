import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_PROXY_URL as string,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Token': import.meta.env.VITE_APP_TOKEN as string,
  },
})

export default api
