'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  clearStoredSession,
  getStoredSession,
  persistSession,
  type AuthSession,
} from '@/lib/auth-session'

interface User {
  id: string
  email: string
  name: string
  role?: 'admin' | 'user'
  username?: string
  points?: number
  tier?: string
}

type AuthResult = {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<AuthResult>
  register: (email: string, password: string, name: string) => Promise<AuthResult>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function withUserRole(user: User): User {
  return {
    ...user,
    role: user.email === 'admin@alowishus.com' ? 'admin' : 'user',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedSession = getStoredSession()

    if (storedSession) {
      setUser(withUserRole(storedSession.user))
      setToken(storedSession.token)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        const sessionData = data as AuthSession
        const userData = withUserRole(sessionData.user || (sessionData as unknown as User))
        setUser(userData)
        setToken(sessionData.token)
        persistSession({
          token: sessionData.token,
          user: userData,
        })
        return { success: true }
      }

      return {
        success: false,
        error: data?.error || 'Login failed',
      }
    } catch (error) {
      console.error('[v0] Login error:', error)
      return {
        success: false,
        error: 'Cannot connect to server',
      }
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        const sessionData = data as AuthSession
        const userData = withUserRole(sessionData.user || (sessionData as unknown as User))
        setUser(userData)
        setToken(sessionData.token)
        persistSession({
          token: sessionData.token,
          user: userData,
        })
        return { success: true }
      }

      return {
        success: false,
        error: data?.error || 'Registration failed',
      }
    } catch (error) {
      console.error('[v0] Register error:', error)
      return {
        success: false,
        error: 'Cannot connect to server',
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    clearStoredSession()
    localStorage.removeItem('cart')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
