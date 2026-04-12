'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AddressModal } from '@/components/address-modal'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { trackMultiplePurchases } from '@/lib/recommendations'
import { products } from '@/lib/store'

type OrderResponse = {
  loyalty?: {
    earnedPoints: number
    totalPoints: number
    tier: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
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
      name: 'Nha rieng',
      fullName: user?.name || '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: 'TP. Ho Chi Minh',
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
          <h1 className="mb-4 text-3xl font-bold">Gio hang cua ban trong</h1>
          <Link href="/products">
            <Button className="rounded-full px-8">MUA CA PHE</Button>
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
        title: 'Vui long dang nhap',
        description: 'Ban can co tai khoan truoc khi dat hang.',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    const activeAddress = addresses.find((addr) => addr.id === selectedAddress)

    if (!activeAddress || !activeAddress.address || !activeAddress.city) {
      toast({
        title: 'Thieu dia chi',
        description: 'Vui long them dia chi giao hang day du truoc khi dat hang.',
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

      const orderResult = (await response.json()) as OrderResponse

      if (orderResult.loyalty) {
        updateUser({
          points: orderResult.loyalty.totalPoints,
          tier: orderResult.loyalty.tier,
        })
      }

      await trackMultiplePurchases(
        user.id,
        items.map((item) => {
          const product = products.find((p) => p.id === item.productId)
          return {
            productId: item.productId,
            categoryId: product?.category || '',
          }
        }),
      )

      clearCart()

      toast({
        title: 'Dat hang thanh cong',
        description: orderResult.loyalty
          ? `Ban nhan ${orderResult.loyalty.earnedPoints} diem. Hang hien tai: ${orderResult.loyalty.tier}.`
          : 'Cam on ban da mua hang. Don hang cua ban dang duoc xu ly.',
      })

      router.push('/account')
    } catch (error) {
      console.error('Checkout failed:', error)
      toast({
        title: 'Loi dat hang',
        description: 'Khong the xu ly don hang luc nay. Vui long thu lai.',
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
        <h1 className="mb-8 text-4xl font-bold">Thanh Toan</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-2">
            <div className="rounded-lg border border-border bg-muted p-6">
              <h2 className="mb-6 text-2xl font-bold">Dia chi giao hang</h2>
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
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
                          {addr.address && `${addr.address}, `}
                          {addr.ward && `${addr.ward}, `}
                          {addr.district && `${addr.district}, `}
                          {addr.city}
                        </p>
                        {addr.isDefault && (
                          <span className="mt-2 inline-block rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                            Dia chi mac dinh
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
                className="mt-4 w-full rounded-full"
                onClick={() => setIsAddressModalOpen(true)}
              >
                + THEM DIA CHI
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-muted p-6">
              <h2 className="mb-6 text-2xl font-bold">Thong tin lien he</h2>
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
                  <Label htmlFor="name">Ho va ten</Label>
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
                  <Label htmlFor="phone">So dien thoai</Label>
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

            <div className="rounded-lg border border-border bg-muted p-6">
              <h2 className="mb-6 text-2xl font-bold">Phuong thuc thanh toan</h2>
              <div className="space-y-3">
                <div
                  onClick={() => setSelectedPayment('cod')}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
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
                      <p className="font-medium">Thanh toan khi nhan hang</p>
                      <p className="text-sm text-muted-foreground">Thanh toan tien khi nhan san pham</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedPayment('card')}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
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
                      <p className="font-medium">The tin dung / ghi no</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedPayment('bank')}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
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
                      <p className="font-medium">Chuyen khoan ngan hang</p>
                      <p className="text-sm text-muted-foreground">Chuyen tien truoc khi giao hang</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedPayment === 'card' && (
              <div className="rounded-lg border border-border bg-muted p-6">
                <h2 className="mb-6 text-xl font-bold">Thong tin the</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">So the</Label>
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
                      <Label htmlFor="expiryDate">Han su dung</Label>
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
              {isProcessing ? 'Dang xu ly...' : 'XAC NHAN DAT HANG'}
            </Button>
          </form>

          <div>
            <div className="sticky top-24 rounded-lg border border-border bg-muted p-6">
              <h2 className="mb-6 text-2xl font-bold">Chi tiet gio hang</h2>

              <div className="mb-6 max-h-96 space-y-4 overflow-y-auto">
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
                        {(product.price * item.quantity).toLocaleString('vi-VN')}d
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tong tien hang</span>
                  <span className="font-medium">{total.toLocaleString('vi-VN')}d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phi van chuyen</span>
                  <span className="font-medium">Mien phi</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thue VAT (10%)</span>
                  <span className="font-medium">{(total * 0.1).toLocaleString('vi-VN')}d</span>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Tong cong</span>
                  <span className="text-3xl font-bold text-primary">
                    {(total * 1.1).toLocaleString('vi-VN')}d
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
