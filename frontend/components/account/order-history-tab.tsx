'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Order, OrderStatus } from '@/lib/types'

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-700'
    case 'shipped':
      return 'bg-blue-100 text-blue-700'
    case 'paid':
      return 'bg-purple-100 text-purple-700'
    case 'packed':
      return 'bg-yellow-100 text-yellow-700'
    case 'completed':
      return 'bg-emerald-100 text-emerald-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    case 'refunded':
      return 'bg-orange-100 text-orange-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function formatStatus(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function OrderHistoryTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${userId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        setOrders(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  if (loading) {
    return <div className="py-10 text-center text-muted-foreground">Loading orders...</div>
  }

  if (orders.length === 0) {
    return <div className="py-10 text-center text-muted-foreground">No orders yet</div>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => router.push(`/orders/${order.id}`)}
          className="cursor-pointer rounded-2xl border p-5 transition hover:bg-muted/70"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold">Order #{order.orderCode}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {order.items.length} item{order.items.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(order.status)}`}
              >
                {formatStatus(order.status)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
