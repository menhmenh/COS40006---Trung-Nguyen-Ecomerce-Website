'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation' // 1. Import router
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryMenu } from "@/components/category-menu"

function Header() {
  const router = useRouter() // 2. Khai báo router
  const { user, logout } = useAuth()
  const { itemCount } = useCart()

  // 3. Hàm xử lý Logout: Về trang chủ trước -> Xóa user sau
  const handleLogout = () => {
    router.push('/') // Chuyển hướng ngay lập tức
    
    // Delay nhẹ 100ms để đảm bảo UI chuyển xong mới xóa data user
    // (Giúp tránh lỗi redirect vòng lặp hoặc giật màn hình)
    setTimeout(() => {
      logout()
    }, 100)
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 overflow-visible">
      <div className="container mx-auto px-4 py-4 overflow-visible">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <CategoryMenu />
            
            <nav className="hidden md:flex items-center gap-8">
              {/* Các link menu hiện tại của bạn */}
            </nav>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 ">
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
                  
                  {/* Chỉ hiện Admin Dashboard nếu cần thiết, có thể thêm điều kiện user.role ở đây */}
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                  
                  {/* 4. Gọi hàm handleLogout thay vì logout trực tiếp */}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
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