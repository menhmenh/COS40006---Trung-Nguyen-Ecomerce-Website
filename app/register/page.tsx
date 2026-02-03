'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    const success = await register(formData.email, formData.password, formData.name)

    setIsLoading(false)

    if (success) {
      toast({
        title: 'Account created!',
        description: 'Welcome to Alowishus. Your account has been created successfully.',
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
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join Alowishus and enjoy delicious coffee
            </p>
          </div>

          <div className="bg-muted rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-1"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full py-6 text-lg"
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-foreground hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
