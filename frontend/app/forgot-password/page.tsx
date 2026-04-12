'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // Thêm state để hiển thị lỗi nếu API tạch
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('') // Reset lỗi mỗi lần bấm

    try {
      console.log("🚀 ĐÃ BẤM NÚT SUBMIT - GỌI API THẬT!")
      
      // GỌI API XUỐNG SERVER THẬT SỰ Ở ĐÂY
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        // Nếu Server báo gửi mail thành công
        setIsSubmitted(true)
        toast({
          title: "Email sent",
          description: "Check your inbox for the password reset link.",
        })
      } else {
        // Nếu có lỗi (email ko tồn tại, lỗi Resend...)
        setErrorMessage(data.error || 'Đã có lỗi xảy ra.')
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: data.error || 'Đã có lỗi xảy ra.',
        })
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối:", error)
      setErrorMessage('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 font-sans flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        
        {isSubmitted ? (
          // Giao diện sau khi đã gửi thành công
          <div className="bg-green-50 p-6 rounded-sm border border-green-200 text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">Check your email</h3>
            <p className="text-green-700 mb-6">
              We have sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link href="/login">
              <Button className="bg-green-700 hover:bg-green-800 text-white uppercase font-bold">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          // Form nhập email
          <>
            <div className="space-y-4 text-gray-600">
              <p>
                Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-base font-medium text-gray-700">
                  Username or email <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="reset-email" 
                  type="email" // Chuyển type thành email để check format cho chuẩn
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-300 rounded-sm focus:ring-black w-full"
                  required
                />
              </div>

              {/* Bảng báo lỗi nếu nhập bậy bạ */}
              {errorMessage && (
                <div className="text-red-500 text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading || !email}
                  className="bg-black hover:bg-gray-800 text-white font-bold uppercase py-6 px-8 rounded-sm text-sm tracking-wider"
                >
                  {isLoading ? 'Sending...' : 'Reset password'}
                </Button>
              </div>
            </form>
             
             {/* Link quay lại đăng nhập */}
            <div className="mt-4">
                 <Link href="/login" className="text-sm text-gray-500 hover:text-black hover:underline">
                    &larr; Back to Login
                 </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}