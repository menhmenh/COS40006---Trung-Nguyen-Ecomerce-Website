import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { getPool, sql } from '@/lib/db'
import { signAuthToken } from '@/lib/auth-token'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const pool = await getPool()

    const existing = await pool
      .request()
      .input('email', sql.VarChar(255), email)
      .query('SELECT TOP 1 user_id FROM users WHERE email = @email')

    if (existing.recordset.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const baseUsername = email.split('@')[0]
    const usernameCheck = await pool
      .request()
      .input('username', sql.VarChar(100), baseUsername)
      .query('SELECT COUNT(*) AS total FROM users WHERE username = @username')

    const username =
      Number(usernameCheck.recordset[0]?.total || 0) > 0
        ? `${baseUsername}_${Date.now().toString().slice(-4)}`
        : baseUsername

    const [firstName, ...rest] = String(name).trim().split(' ')
    const lastName = rest.join(' ')
    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool
      .request()
      .input('username', sql.VarChar(100), username)
      .input('email', sql.VarChar(255), email)
      .input('first_name', sql.VarChar(100), firstName || null)
      .input('last_name', sql.VarChar(100), lastName || null)
      .input('password_hash', sql.VarChar(255), passwordHash)
      .query(`
        INSERT INTO users (
          user_id, username, email, first_name, last_name,
          status, created_at, last_login, password_hash
        )
        OUTPUT INSERTED.user_id, INSERTED.username, INSERTED.email, INSERTED.first_name, INSERTED.last_name
        VALUES (
          CONVERT(CHAR(36), NEWID()),
          @username,
          @email,
          @first_name,
          @last_name,
          'Active',
          GETDATE(),
          NULL,
          @password_hash
        )
      `)

    const createdUser = result.recordset[0]

    const authUser = {
      id: createdUser.user_id,
      email: createdUser.email,
      name: [createdUser.first_name, createdUser.last_name]
        .filter(Boolean)
        .join(' ')
        .trim(),
      username: createdUser.username,
      role: 'user' as const,
    }

    return NextResponse.json(
      {
        ...authUser,
        token: signAuthToken(authUser),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
