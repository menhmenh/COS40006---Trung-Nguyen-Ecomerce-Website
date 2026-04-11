'use client'

import React from "react"
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart()

  // Giao diện khi giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-16 text-center mt-12">
          <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn trống</h1>
          <p className="text-muted-foreground mb-8">Có vẻ như bạn chưa thêm sản phẩm nào.</p>
          <Link href="/products">
            <Button className="rounded-full px-8 py-6 text-lg">MUA CÀ PHÊ</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">Giỏ Hàng</h1>
          <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
            {items.length} {items.length === 1 ? 'sản phẩm' : 'sản phẩm'}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-muted rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-24 h-24 bg-background rounded-xl relative flex-shrink-0">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.productName}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-bold text-lg mb-1 hover:text-muted-foreground transition-colors">
                      {item.productName}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.price.toLocaleString('vi-VN')}đ / sản phẩm
                  </p>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="rounded-full h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="rounded-full h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto text-destructive hover:text-destructive sm:ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right sm:ml-auto">
                  <div className="font-bold text-xl">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-muted rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng tiền hàng</span>
                  <span className="font-medium">{total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thuế VAT (10%)</span>
                  <span className="font-medium">{(total * 0.1).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <span className="text-3xl font-bold text-primary">
                    {(total * 1.1).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full rounded-full py-6 text-lg font-medium bg-primary text-primary-foreground">
                  TIẾN HÀNH THANH TOÁN
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}