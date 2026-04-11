'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AddressModal } from '@/components/address-modal'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { products } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { trackMultiplePurchases } from '@/lib/recommendations'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // STATE ĐỂ BẬT/TẮT MODAL (Từ nhánh HEAD)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const [selectedPayment, setSelectedPayment] = useState<'card' | 'bank' | 'cod'>('cod')
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Nhà riêng',
      fullName: user?.name || '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: 'TP. Hồ Chí Minh',
      isDefault: true,
    },
  ])
  const [selectedAddress, setSelectedAddress] = useState(1)

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: user?.email || prev.email,
      name: user?.name || prev.name,
    }))
  }, [user])

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container flex-1 mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn trống</h1>
          <Link href="/products">
            <Button className="rounded-full px-8">MUA CÀ PHÊ</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần có tài khoản trước khi đặt hàng.',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    // TÌM LẤY ĐỊA CHỈ ĐANG ĐƯỢC CHỌN (TICK RADIO)
    const activeAddress = addresses.find((addr) => addr.id === selectedAddress)
    
    if (!activeAddress || !activeAddress.address || !activeAddress.city) {
      toast({
        title: 'Thiếu địa chỉ',
        description: 'Vui lòng bấm + Thêm địa chỉ và điền đầy đủ thông tin giao hàng.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: activeAddress.fullName || formData.name,
            phone: activeAddress.phone || formData.phone,
            addressLine: `${activeAddress.address}, ${activeAddress.ward}, ${activeAddress.district}`,
            city: activeAddress.city,
          },
          paymentMethod: selectedPayment,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      // --- LOGIC CỦA CHANH: Lưu lịch sử mua hàng để gợi ý sản phẩm ---
      await trackMultiplePurchases(
        user.id,
        items.map((item) => {
          const product = products.find((p) => p.id === item.productId)
          return {
            productId: item.productId,
            categoryId: product?.category || '',
          }
        })
      )
      // -------------------------------------------------------------

      clearCart()

      toast({
        title: 'Đặt hàng thành công!',
        description: 'Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.',
      })

      router.push('/account')
    } catch (error) {
      console.error('Checkout failed:', error)
      toast({
        title: 'Lỗi đặt hàng',
        description: 'Không thể xử lý đơn hàng lúc này. Vui lòng thử lại.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Thanh Toán</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            
            <div className="bg-muted rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Địa chỉ giao hàng</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress === addr.id
                        ? 'border-primary bg-background'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">{addr.name}</p>
                        <p className="text-sm text-muted-foreground">{addr.fullName}</p>
                        <p className="text-sm text-muted-foreground">{addr.phone}</p>
                        <p className="text-sm text-muted-foreground">
                          {addr.address && `${addr.address}, `}{addr.ward && `${addr.ward}, `}{addr.district && `${addr.district}, `}{addr.city}
                        </p>
                        {addr.isDefault && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded mt-2 inline-block">
                            Địa chỉ mặc định
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-4 rounded-full"
                onClick={() => setIsAddressModalOpen(true)}
              >
                + THÊM ĐỊA CHỈ
              </Button>
            </div>

            <div className="bg-muted rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại (dự phòng)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <div
                  onClick={() => setSelectedPayment('cod')}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPayment === 'cod'
                      ? 'border-primary bg-background'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === 'cod'}
                      onChange={() => setSelectedPayment('cod')}
                    />
                    <div>
                      <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-muted-foreground">Thanh toán tiền khi nhận sản phẩm</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedPayment('card')}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPayment === 'card'
                      ? 'border-primary bg-background'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === 'card'}
                      onChange={() => setSelectedPayment('card')}
                    />
                    <div>
                      <p className="font-medium">Thẻ tín dụng / Thẻ ghi nợ</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                </div>

                {/* Giữ lại option Chuyển khoản của Chanh */}
                <div
                  onClick={() => setSelectedPayment('bank')}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPayment === 'bank'
                      ? 'border-primary bg-background'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === 'bank'}
                      onChange={() => setSelectedPayment('bank')}
                    />
                    <div>
                      <p className="font-medium">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-muted-foreground">Chuyển tiền trước khi giao hàng</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedPayment === 'card' && (
              <div className="bg-muted rounded-lg p-6 border border-border">
                <h2 className="text-xl font-bold mb-6">Thông tin thẻ</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Số thẻ</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Hạn sử dụng</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        required
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded-full py-6 text-lg font-medium"
            >
              {isProcessing ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
            </Button>
          </form>

          <div>
            <div className="bg-muted rounded-lg p-6 border border-border sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Chi tiết giỏ hàng</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.productId)
                  if (!product) return null
                  return (
                    <div key={item.productId} className="flex items-start justify-between text-sm">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="font-medium">
                        {(product.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng tiền hàng</span>
                  <span className="font-medium">{total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-medium">Miễn phí</span>
                </div>
                {/* Giữ lại VAT của Chanh */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thuế VAT (10%)</span>
                  <span className="font-medium">{(total * 0.1).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <span className="text-3xl font-bold text-primary">
                    {(total * 1.1).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AddressModal
        open={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        addresses={addresses}
        onAddressesChange={setAddresses}
      />

      <Footer />
    </div>
  )
}