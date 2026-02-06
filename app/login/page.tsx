'use client'

import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from "@/components/ui/checkbox"

export default function AuthPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const { toast } = useToast()
  
  // --- STATE CHO LOGIN ---
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  // --- STATE CHO REGISTER ---
  const [isRegLoading, setIsRegLoading] = useState(false)
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // --- XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoginLoading(true)

    const success = await login(loginData.email, loginData.password)

    setIsLoginLoading(false)

    if (success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      })
      router.push('/account')
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // --- XỬ LÝ ĐĂNG KÝ ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (regData.password !== regData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      })
      return
    }

    setIsRegLoading(true)

    // Gọi hàm register với đúng 3 tham số như code cũ của bạn
    const success = await register(regData.email, regData.password, regData.name)

    setIsRegLoading(false)

    if (success) {
      toast({
        title: 'Account created!',
        description: 'Welcome! Your account has been created successfully.',
      })
      router.push('/account')
    } else {
      toast({
        title: 'Registration failed',
        description: 'This email is already registered. Please use a different email.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 font-sans">
      <div className="container mx-auto max-w-6xl">
        
        {/* Layout chia đôi: Desktop 2 cột, Mobile 1 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
          
          {/* Đường kẻ dọc phân cách (Chỉ hiện trên Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 -translate-x-1/2"></div>

          {/* ================= CỘT TRÁI: LOGIN ================= */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-black">
              Login
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-base font-medium text-gray-700">
                  Username or email address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="h-12 border-gray-300 rounded-sm focus:ring-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-pass" className="text-base font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="login-pass" 
                  type="password" 
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="h-12 border-gray-300 rounded-sm focus:ring-black"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="rounded-sm border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoginLoading}
                  className="bg-black hover:bg-gray-800 text-white font-bold uppercase py-6 px-8 rounded-sm text-sm tracking-wider w-auto min-w-[150px]"
                >
                  {isLoginLoading ? 'LOGGING IN...' : 'LOG IN'}
                </Button>
              </div>
              
              <div>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Lost your password?
                </a>
              </div>
            </form>
          </div>

          {/* ================= CỘT PHẢI: REGISTER ================= */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-black">
              Register
            </h2>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-base font-medium text-gray-700">
                  Email address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="reg-email" 
                  type="email" 
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="h-12 border-gray-300 rounded-sm focus:ring-black"
                  required
                />
              </div>

              {/* Thêm trường Full Name vì hàm register() của bạn yêu cầu */}
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="text-base font-medium text-gray-700">
                  Full Name
                </Label>
                <Input 
                  id="reg-name" 
                  type="text" 
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  className="h-12 border-gray-300 rounded-sm focus:ring-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-pass" className="text-base font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="reg-pass" 
                  type="password" 
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  className="h-12 border-gray-300 rounded-sm focus:ring-black"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirm Password để đảm bảo an toàn */}
              <div className="space-y-2">
                <Label htmlFor="reg-confirm-pass" className="text-base font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="reg-confirm-pass" 
                  type="password" 
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                  className="h-12 border-gray-300 rounded-sm focus:ring-black"
                  required
                  minLength={6}
                />
              </div>

              <div className="text-sm text-gray-600 space-y-4 leading-relaxed mt-4">
                <p>
                  Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="#" className="font-bold hover:underline">privacy policy</a>.
                </p>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit"
                  disabled={isRegLoading} 
                  className="bg-black hover:bg-gray-800 text-white font-bold uppercase py-6 px-8 rounded-sm text-sm tracking-wider w-auto min-w-[150px]"
                >
                  {isRegLoading ? 'REGISTERING...' : 'REGISTER'}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}