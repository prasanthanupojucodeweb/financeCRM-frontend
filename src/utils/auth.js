const STORAGE_KEY = 'fintrackr_user'

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || !data.token) return null
    return data
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return getStoredUser() !== null
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}
