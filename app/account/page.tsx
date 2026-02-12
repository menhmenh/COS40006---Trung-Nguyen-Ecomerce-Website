'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/lib/auth-context'
import { products, type Order } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, ShoppingBag, Package } from 'lucide-react'
import Image from 'next/image'

export default function AccountPage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  // --- LOGIC LOGOUT ĐÃ SỬA ---
  const handleLogout = async () => {
    // 1. Điều hướng về trang chủ NGAY LẬP TỨC (để tạo cảm giác mượt)
    router.push('/')

    // 2. Chờ 100ms rồi mới thực sự xóa session user
    // (Mẹo này giúp tránh việc trang Account bị render lại rồi mới chuyển trang, gây giật)
    setTimeout(() => {
      logout()
    }, 100)
  }
  // --------------------------

  useEffect(() => {
    // Bảo vệ trang: Nếu không có user thì đá về Login
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/orders?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching orders:', error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  // Màn hình loading khi đang check user
  if (isLoading || !user) {
    return (
      <div className="min-h-screen">
      
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">


      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and orders</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="max-w-2xl">
              <div className="bg-muted rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Full Name</span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Member Since</span>
                        <span className="font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="rounded-full px-6 bg-transparent">
                      EDIT PROFILE
                    </Button>
                    
                    {/* Button Logout đã gắn hàm mới */}
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="rounded-full px-6 bg-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      LOG OUT
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <ShoppingBag className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Order History</h2>
              </div>

              {isLoadingOrders ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-2xl">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start shopping to see your orders here!
                  </p>
                  <Button
                    onClick={() => router.push('/products')}
                    className="rounded-full px-8"
                  >
                    SHOP COFFEE
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-muted rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">Order #{order.id.slice(-8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${order.total.toFixed(2)}</div>
                          <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, index) => {
                          const product = products.find((p) => p.id === item.productId)
                          if (!product) return null

                          return (
                            <div key={index} className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-background rounded-lg relative flex-shrink-0">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
