'use client'

export const AUTH_STORAGE_KEY = 'auth-session'
export const USER_STORAGE_KEY = 'user'

export type AuthSession = {
  token: string
  user: {
    id: string
    email: string
    name: string
    username?: string
    role?: 'admin' | 'user'
    points?: number
    tier?: string
  }
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null

  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthSession
  } catch (error) {
    console.error('[auth] Failed to parse stored session:', error)
    clearStoredSession()
    return null
  }
}

export function persistSession(session: AuthSession) {
  if (typeof window === 'undefined') return

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user))
}

export function clearStoredSession() {
  if (typeof window === 'undefined') return

  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function getStoredToken() {
  return getStoredSession()?.token ?? null
}
