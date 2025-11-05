// Utilidades simples de autenticación en el frontend
import { API_BASE, fetchJSON } from './api'

const TOKEN_KEY = 'vaulttec_token'
const USER_KEY = 'vaulttec_user'

export function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const s = localStorage.getItem(USER_KEY)
  return s ? JSON.parse(s) : null
}

export async function login(email, password) {
  const data = await fetchJSON('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  })
  if (data && data.token && data.user) {
    saveAuth(data.token, data.user)
  }
  return data
}

export async function register(name, email, password) {
  const data = await fetchJSON('/api/auth/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, email, password })
  })
  if (data && data.token && data.user) {
    saveAuth(data.token, data.user)
  }
  return data
}

// fetch wrapper que añade Authorization si hay token
export async function fetchWithAuth(path, opts = {}) {
  const token = getToken()
  const headers = opts.headers ? {...opts.headers} : {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  return fetchJSON(path, { ...opts, headers })
}