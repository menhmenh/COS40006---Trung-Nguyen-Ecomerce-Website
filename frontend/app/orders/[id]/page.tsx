'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
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

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = useMemo(() => String(params.id), [params.id])

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)

        if (response.ok) {
          const data = await response.json()
          if (data) {
            setOrder(data)
          }
        }
      } catch (error) {
        console.error('Failed to load order detail:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Loading order...</div>
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="mb-4 text-muted-foreground">Order not found.</p>
        <Button onClick={() => router.push('/account')}>Back to account</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Button variant="outline" className="mb-6" onClick={() => router.push('/account')}>
        Back to account
      </Button>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border p-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.orderCode}</h1>
          <p className="mt-2 text-muted-foreground">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="mb-2 text-sm text-muted-foreground">Status</p>
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses(order.status)}`}
          >
            {formatStatus(order.status)}
          </span>
          <p className="mt-4 text-sm text-muted-foreground">Order Total</p>
          <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border p-6">
        <h2 className="mb-4 text-xl font-bold">Shipping Information</h2>
        {order.shippingAddress ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.addressLine}</p>
            <p>{order.shippingAddress.city}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">No shipping information available.</p>
        )}
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="mb-4 text-xl font-bold">Items</h2>

        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={`${item.productId}-${index}`} className="flex items-center gap-4 rounded-xl border p-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.productName || 'Product image'}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} x ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}