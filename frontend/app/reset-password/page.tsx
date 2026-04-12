'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()
  const { toast } = useToast()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Nếu người dùng mò vào trang này mà không có token trong URL
  if (!token) {
    return (
      <div className="text-center bg-red-50 p-6 rounded-sm border border-red-200">
        <h3 className="text-xl font-bold text-red-800 mb-2">Liên kết không hợp lệ</h3>
        <p className="text-red-700 mb-6">
          Liên kết đặt lại mật khẩu đã hết hạn hoặc không tồn tại.
        </p>
        <Link href="/forgot-password">
          <Button className="bg-red-700 hover:bg-red-800 text-white uppercase font-bold">
            Yêu cầu liên kết mới
          </Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Validate nhanh ở Frontend
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp!')
      return
    }

    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }

    setIsLoading(true)

    try {
      console.log("🚀 Gọi API Đổi mật khẩu...")
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Thành công",
          description: "Mật khẩu của bạn đã được cập nhật.",
        })
        
        // Tự động chuyển về trang Đăng nhập sau 3 giây
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setErrorMessage(data.error || 'Đã có lỗi xảy ra.')
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: data.error || 'Đã có lỗi xảy ra.',
        })
      }
    } catch (error) {
      console.error("Lỗi:", error)
      setErrorMessage('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  // Giao diện khi đổi pass thành công
  if (isSuccess) {
    return (
      <div className="bg-green-50 p-6 rounded-sm border border-green-200 text-center">
        <h3 className="text-xl font-bold text-green-800 mb-2">Đổi mật khẩu thành công!</h3>
        <p className="text-green-700 mb-6">
          Hệ thống sẽ tự động chuyển hướng bạn về trang Đăng nhập trong giây lát...
        </p>
        <Link href="/login">
          <Button className="bg-green-700 hover:bg-green-800 text-white uppercase font-bold">
            Đăng nhập ngay
          </Button>
        </Link>
      </div>
    )
  }

  // Form nhập pass mới
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">Mật khẩu mới <span className="text-red-500">*</span></Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="h-12 border-gray-300 rounded-sm focus:ring-black w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-12 border-gray-300 rounded-sm focus:ring-black w-full"
          required
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          className="bg-black hover:bg-gray-800 text-white font-bold uppercase py-6 px-8 rounded-sm text-sm tracking-wider w-full"
        >
          {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
        </Button>
      </div>
    </form>
  )
}

// Bọc Component bằng Suspense để Next.js không bị lỗi khi dùng useSearchParams
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 font-sans flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tạo mật khẩu mới</h2>
        <Suspense fallback={<div className="text-center text-gray-500">Đang tải biểu mẫu...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}