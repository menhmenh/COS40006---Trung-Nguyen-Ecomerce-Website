import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'
import { getPool } from '@/lib/db'

// Khởi tạo Resend với API Key mới
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  console.log("🔥 ĐÃ CHẠY VÀO API FORGOT PASSWORD THÀNH CÔNG!!! 🔥")
  try {
    const { email } = await req.json()
    const pool = await getPool()

    // 1. CHỈ SELECT mỗi user_id, BỎ CỘT name đi cho khỏi báo lỗi
    const userResult = await pool.request()
      .input('email', email)
      .query(`SELECT user_id FROM dbo.users WHERE email = @email`)

    if (userResult.recordset.length === 0) {
      return NextResponse.json({ message: 'Nếu email tồn tại, link khôi phục đã được gửi.' })
    }

    const user = userResult.recordset[0]

    // 2. Tạo Token ngẫu nhiên (Hết hạn sau 1 giờ)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 3600000)

    // 3. Cập nhật Token vào Database
    await pool.request()
      .input('email', email)
      .input('token', resetToken)
      .input('expiry', tokenExpiry)
      .query(`
        UPDATE dbo.users 
        SET reset_token = @token, reset_token_expiry = @expiry 
        WHERE email = @email
      `)

    // 4. Tạo đường link khôi phục
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
    
    // 5. GỬI MAIL BẰNG RESEND (Đã bỏ ${user.name} trong phần html)
    const { data, error } = await resend.emails.send({
      from: 'Trung Nguyen E-Coffee <onboarding@resend.dev>',
      to: [email],
      subject: 'Yêu cầu đặt lại mật khẩu - Trung Nguyên E-commerce',
      html: `
        <div style="font-family: Arial, sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3E2723;">Xin chào,</h2>
          <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #C5A059; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Đặt Lại Mật Khẩu
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu, xin hãy bỏ qua email này.</p>
        </div>
      `
    })

    if (error) {
      console.error('Lỗi Resend:', error)
      return NextResponse.json({ error: 'Không thể gửi email lúc này.' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Gửi email thành công!', data })
  } catch (error) {
    console.error('Lỗi server:', error)
    return NextResponse.json({ error: 'Đã có lỗi xảy ra.' }, { status: 500 })
  }
}