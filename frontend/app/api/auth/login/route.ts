import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getPool, sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const pool = await getPool()
    
    // Đã bỏ sql.VarChar(255) ở dòng input
    const result = await pool
      .request()
      .input('email', email)
      .query(`
        SELECT TOP 1
          user_id,
          username,
          email,
          first_name,
          last_name,
          password_hash
        FROM users
        WHERE email = @email
      `)

    const user = result.recordset[0]

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, user.password_hash || '')
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Đã bỏ sql.Char(36) ở dòng input
    await pool
      .request()
      .input('userId', user.user_id)
      .query(`
        UPDATE users
        SET last_login = GETDATE()
        WHERE user_id = @userId
      `)

    return NextResponse.json({
      id: user.user_id,
      email: user.email,
      name:
        [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
        user.username,
      username: user.username,
    })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}