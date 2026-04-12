import { getStoredToken } from '@/lib/auth-session'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getBackendBaseUrl() {
  const value = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!value) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured')
  }

  return trimTrailingSlash(value)
}

export async function fetchBackend(
  path: string,
  init: RequestInit = {},
  options: { token?: string | null } = {},
) {
  const headers = new Headers(init.headers)
  const token = options.token ?? getStoredToken()

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(`${getBackendBaseUrl()}${path}`, {
    ...init,
    headers,
  })
}

export async function parseBackendResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      (payload as { error?: string; message?: string }).error ||
      (payload as { error?: string; message?: string }).message ||
      response.statusText
    throw new Error(message || 'Backend request failed')
  }

  return payload as T
}
