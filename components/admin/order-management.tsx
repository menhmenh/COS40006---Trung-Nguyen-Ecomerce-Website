'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import type { Order } from '@/lib/store'
import { products } from '@/lib/store'

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      if (res.ok) {
        toast({ description: 'Order status updated successfully' })
        fetchOrders()
      }
    } catch (error) {
      toast({ description: 'Failed to update order status', variant: 'destructive' })
    }
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || 'Unknown Product'
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1B1B1D]">{'Orders'}</h2>
        <p className="text-[#64646A] mt-1">{'Manage and update order statuses'}</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-[#64646A]">
            {'No orders found'}
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-[#EEEFF1] rounded-2xl p-6 hover:border-[#64646A] transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-[#1B1B1D]">{'Order #'}{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#64646A]">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-[#64646A]">{'Total'}</div>
                    <div className="text-xl font-bold text-[#1B1B1D]">${order.total.toFixed(2)}</div>
                  </div>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusUpdate(order.id, value as Order['status'])}
                  >
                    <SelectTrigger className="w-[160px] rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{'Pending'}</SelectItem>
                      <SelectItem value="completed">{'Completed'}</SelectItem>
                      <SelectItem value="cancelled">{'Cancelled'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t border-[#EEEFF1] pt-4">
                <h4 className="font-semibold text-[#1B1B1D] mb-3">{'Order Items'}</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#1B1B1D] rounded-full" />
                        <span className="text-[#1B1B1D]">{getProductName(item.productId)}</span>
                        <span className="text-[#64646A]">{'x'}{item.quantity}</span>
                      </div>
                      <span className="font-medium text-[#1B1B1D]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
