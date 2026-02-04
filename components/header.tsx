'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,        // Phải có cái này
  DropdownMenuSubContent, // Phải có cái này
  DropdownMenuSubTrigger, // Phải có cái này
} from '@/components/ui/dropdown-menu'
import { CategoryMenu } from "@/components/category-menu"

function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 overflow-visible">
      <div className="container mx-auto px-4 py-4 overflow-visible">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <CategoryMenu /> {/* Thêm danh mục vào đây */}
            
            <nav className="hidden md:flex items-center gap-8">
              {/* Các link menu hiện tại của bạn */}
            </nav>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 ">
            <div className="relative w-20 h-20"> {/* Bạn có thể điều chỉnh w (rộng) và h (cao) cho phù hợp */}
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
            <Link href="/" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Cafe Menu
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Shop Coffee
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              About Us
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Find Us
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
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
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
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

            <Link href="/products">
              <Button className="rounded-full px-6 hidden md:inline-flex">
                BUY GIFT VOUCHERS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }
export default Header
