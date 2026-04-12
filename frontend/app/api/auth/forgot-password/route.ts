import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'
import { getPool } from '@/lib/db'

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured.' },
        { status: 500 },
      )
    }

    const { email } = await req.json()
    const pool = await getPool()

    const userResult = await pool.request()
      .input('email', email)
      .query(`SELECT user_id FROM dbo.users WHERE email = @email`)

    if (userResult.recordset.length === 0) {
      return NextResponse.json({
        message: 'If the email exists, a reset link has been sent.',
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 3600000)

    await pool.request()
      .input('email', email)
      .input('token', resetToken)
      .input('expiry', tokenExpiry)
      .query(`
        UPDATE dbo.users
        SET reset_token = @token, reset_token_expiry = @expiry
        WHERE email = @email
      `)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: 'Trung Nguyen E-Coffee <onboarding@resend.dev>',
      to: [email],
      subject: 'Password reset request - Trung Nguyen E-commerce',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3E2723;">Hello,</h2>
          <p>You requested a password reset. Click the button below to create a new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #C5A059; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Unable to send email right now.' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Reset email sent successfully.', data })
  } catch (error) {
    console.error('Forgot password route error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
