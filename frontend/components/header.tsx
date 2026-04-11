'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut, LayoutDashboard, Coffee } from 'lucide-react' 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()

  // Logic kiểm tra tài khoản Admin chuẩn xác
  const isAdmin = user?.role === 'admin' || user?.email === 'admin.demo@trungnguyen.com'

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 overflow-visible animate-fade-in-down">
      <div className="container mx-auto px-4 py-4 overflow-visible">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <div className="relative w-20 h-20">
              <Image
                src="/trung-nguyen-logo.png"
                alt="Trung Nguyen Legend Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {!isAdmin && (
              <>
                <Link href="/products" className="text-sm font-medium hover:text-muted-foreground transition-smooth">
                  Shop Coffee
                </Link>
                <Link href="/subscriptions/plans" className="text-sm font-medium hover:text-muted-foreground transition-smooth flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  Monthly Box
                </Link>
                <Link href="/about" className="text-sm font-medium hover:text-muted-foreground transition-smooth">
                  About Us
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 animate-fade-in-right">
            
            {/* Nút Admin Dashboard chỉ hiện cho tài khoản có quyền */}
            {isAdmin && (
              <Link href="/admin">
                <Button variant="default" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}

            {/* Giỏ hàng ẩn đi nếu là Admin */}
            {!isAdmin && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {!isAdmin && (
              <Link href="/products">
                <Button className="rounded-full px-6 hidden md:inline-flex">
                  BUY GIFT VOUCHERS
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }
export default Header