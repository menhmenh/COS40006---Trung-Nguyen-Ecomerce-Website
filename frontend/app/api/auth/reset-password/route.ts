import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getPool } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()
    const pool = await getPool()

    // 1. Tìm user có token khớp và token chưa hết hạn
    // Đã thêm dbo. vào trước users
    const userResult = await pool.request()
      .input('token', token)
      .query(`
        SELECT user_id 
        FROM dbo.users 
        WHERE reset_token = @token AND reset_token_expiry > GETDATE()
      `)

    if (userResult.recordset.length === 0) {
      return NextResponse.json({ error: 'Token không hợp lệ hoặc đã hết hạn!' }, { status: 400 })
    }

    const userId = userResult.recordset[0].user_id

    // 2. Băm (Hash) mật khẩu mới bằng Bcrypt
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // 3. Cập nhật mật khẩu mới vào DB và xóa token đi (để không dùng lại được)
    // Đã thêm dbo. vào trước users
    await pool.request()
      .input('userId', userId)
      .input('password', hashedPassword)
      .query(`
        UPDATE dbo.users 
        SET 
          password_hash = @password, 
          reset_token = NULL, 
          reset_token_expiry = NULL 
        WHERE user_id = @userId
      `)

    return NextResponse.json({ message: 'Đặt lại mật khẩu thành công!' })
  } catch (error) {
    console.error('Lỗi reset password:', error)
    return NextResponse.json({ error: 'Đã có lỗi xảy ra.' }, { status: 500 })
  }
}