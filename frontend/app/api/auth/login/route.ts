import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getPool } from '@/lib/db'
import { signAuthToken } from '@/lib/auth-token'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const pool = await getPool()
    
    // Đã thêm loyalty_points và loyalty_tier vào câu query
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
          password_hash,
          loyalty_points,
          loyalty_tier
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

    const adminCheck = await pool
      .request()
      .input('userId', user.user_id)
      .query(`
        SELECT TOP 1 * FROM admins 
        WHERE user_id = @userId
      `)
      
    const role: 'admin' | 'user' = adminCheck.recordset.length > 0 ? 'admin' : 'user'

    await pool
      .request()
      .input('userId', user.user_id)
      .query(`
        UPDATE users
        SET last_login = GETDATE()
        WHERE user_id = @userId
      `)

    // Trả thêm điểm và hạng về cho Frontend (nếu NULL thì mặc định là 0 và Silver)
    const authUser = {
      id: user.user_id,
      email: user.email,
      name:
        [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
        user.username,
      username: user.username,
      role: role,
      points: user.loyalty_points || 0,
      tier: user.loyalty_tier || 'Silver'
    }

    return NextResponse.json({
      ...authUser,
      token: signAuthToken(authUser),
    })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
