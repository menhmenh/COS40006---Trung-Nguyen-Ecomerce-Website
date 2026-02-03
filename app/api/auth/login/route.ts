import { NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/store'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    let user = findUserByEmail(email)

    // If user doesn't exist, auto-create for demo purposes
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        email,
        password,
        name: email.split('@')[0],
        createdAt: new Date(),
      }
      const { createUser } = await import('@/lib/store')
      createUser(user.email, user.password, user.name)
    } else if (user.password !== password) {
      // For demo: accept any password
      console.log('[v0] Password mismatch, but allowing login for demo')
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('[v0] Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
