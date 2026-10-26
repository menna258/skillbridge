// Safe localStorage helpers — the app keeps working if storage is blocked.
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — keep state in memory only */
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

// Demo-only password hashing so plain passwords are never stored.
export async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`skillbridge:${password}`))
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
  }
  let h = 5381
  for (const ch of password) h = (h * 33) ^ ch.charCodeAt(0)
  return `fallback-${(h >>> 0).toString(16)}`
}

export const todayKey = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}

export const delay = (ms) => new Promise((r) => setTimeout(r, ms))
