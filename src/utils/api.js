import { getStoredUser } from './auth'

/**
 * - If `VITE_API_URL` is set (e.g. production API URL), use it.
 * - Otherwise in Vite dev, use same-origin `/api` so the dev server proxy forwards to Express.
 * - Otherwise fall back to localhost (e.g. non-proxied local setups).
 */
function resolveApiBase() {
  const raw = import.meta.env.VITE_API_URL
  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.trim().replace(/\/$/, '')
  }
  if (import.meta.env.DEV) {
    return ''
  }
  return typeof window !== 'undefined' ? '' : 'http://localhost:5000'
}

const API_BASE = resolveApiBase()

export function authHeaders() {
  const user = getStoredUser()
  const headers = { 'Content-Type': 'application/json' }
  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`
  }
  return headers
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    let msg = data.message || data.error || res.statusText || 'Request failed'
    if (res.status === 404 && msg === 'Not Found' && !data.message && !data.error) {
      msg =
        'API not found — ensure the backend is running (e.g. port 5000) and matches your Vite proxy / VITE_API_URL.'
    }
    throw new Error(msg)
  }
  return data
}

/** Same as apiFetch but returns { ok, data?, error? } so one failed route does not block others */
export async function apiFetchSafe(path, options = {}) {
  try {
    const data = await apiFetch(path, options)
    return { ok: true, data }
  } catch (e) {
    return { ok: false, error: e.message || 'Request failed', data: null }
  }
}
