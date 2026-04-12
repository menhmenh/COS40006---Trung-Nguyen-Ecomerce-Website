import jwt from 'jsonwebtoken'

type TokenUser = {
  id: string
  email: string
  name: string
  username?: string
  role?: 'admin' | 'user'
}

export function signAuthToken(user: TokenUser) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is required for frontend auth routes')
  }

  return jwt.sign(user, secret, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  })
}
