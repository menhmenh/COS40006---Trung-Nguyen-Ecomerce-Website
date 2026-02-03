import { NextResponse } from 'next/server'
import { findUserByEmail, createUser } from '@/lib/store'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    const existingUser = findUserByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const user = createUser(email, password, name)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('[v0] Register API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
