import React from "react"
import type { Metadata } from 'next'
import { Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import { Toaster } from '@/components/ui/toaster'


const jost = Jost({ 
  subsets: ["latin"],
  variable: "--font-jost", 
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Trung Nguyen E-Commerce', 
  description: 'Authentic Vietnamese Coffee - Taste the difference.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jost.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster />

          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}