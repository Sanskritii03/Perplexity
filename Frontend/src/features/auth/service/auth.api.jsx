import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

// Add a request interceptor to attach the token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function register({ email, username, password }) {
  const response = await api.post("/api/auth/register", { email, username, password })
  return response.data
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", { email, password })
  // Save the token after login
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
  }
  return response.data
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me")
  return response.data
}