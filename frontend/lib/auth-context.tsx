'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role?: 'admin' | 'user'
}

type AuthResult = {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        setUser(withUserRole(JSON.parse(storedUser) as User))
      } catch (error) {
        console.error('[v0] Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
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
        const userData = withUserRole(data as User)
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
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
        const userData = withUserRole(data as User)
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
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
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
