'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-foreground">
              Alowishus
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
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
