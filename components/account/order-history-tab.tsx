'use client'

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type OrderItem = {
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string
}

type Order = {
  id: string
  userId: string
  createdAt: string
  total: number
  status: "Created" | "Paid" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Refunded"
  items: OrderItem[]
  shippingAddress?: {
    fullName: string
    phone: string
    addressLine: string
    city: string
  }
}

const mockOrders: Order[] = [
  {
    id: "ORD-2026-0001",
    userId: "demo-user",
    createdAt: "2026-03-01T09:30:00.000Z",
    total: 24.5,
    status: "Delivered",
    shippingAddress: {
      fullName: "Demo User",
      phone: "0901234567",
      addressLine: "123 Nguyen Hue",
      city: "Ho Chi Minh City",
    },
    items: [
      {
        productId: "coffee-1",
        productName: "Trung Nguyen Creative 1",
        price: 8.5,
        quantity: 1,
        image: "/placeholder.svg",
      },
      {
        productId: "coffee-2",
        productName: "G7 3-in-1 Coffee",
        price: 8,
        quantity: 2,
        image: "/placeholder.svg",
      },
    ],
  },
  {
    id: "ORD-2026-0002",
    userId: "demo-user",
    createdAt: "2026-03-05T14:15:00.000Z",
    total: 18,
    status: "Shipped",
    shippingAddress: {
      fullName: "Demo User",
      phone: "0901234567",
      addressLine: "45 Le Loi",
      city: "Da Nang",
    },
    items: [
      {
        productId: "coffee-3",
        productName: "Legend Classic",
        price: 9,
        quantity: 2,
        image: "/placeholder.svg",
      },
    ],
  },
  {
    id: "ORD-2026-0003",
    userId: "demo-user",
    createdAt: "2026-03-07T08:00:00.000Z",
    total: 31.75,
    status: "Paid",
    shippingAddress: {
      fullName: "Demo User",
      phone: "0901234567",
      addressLine: "78 Tran Hung Dao",
      city: "Ha Noi",
    },
    items: [
      {
        productId: "coffee-4",
        productName: "Passiona",
        price: 10.25,
        quantity: 1,
        image: "/placeholder.svg",
      },
      {
        productId: "coffee-5",
        productName: "Gourmet Blend",
        price: 7.5,
        quantity: 2,
        image: "/placeholder.svg",
      },
      {
        productId: "coffee-6",
        productName: "Espresso Ground",
        price: 6.5,
        quantity: 1,
        image: "/placeholder.svg",
      },
    ],
  },
]

function getStatusClasses(status: Order["status"]) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700"
    case "Shipped":
      return "bg-blue-100 text-blue-700"
    case "Paid":
      return "bg-purple-100 text-purple-700"
    case "Packed":
      return "bg-yellow-100 text-yellow-700"
    case "Cancelled":
      return "bg-red-100 text-red-700"
    case "Refunded":
      return "bg-orange-100 text-orange-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export default function OrderHistoryTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const storageKey = useMemo(() => `mock-orders-${userId}`, [userId])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${userId}`)

        if (!response.ok) {
          throw new Error("API not ready")
        }

        const data = await response.json()

        if (Array.isArray(data) && data.length > 0) {
          setOrders(data)
          localStorage.setItem(storageKey, JSON.stringify(data))
        } else {
          const savedOrders = localStorage.getItem(storageKey)
          if (savedOrders) {
            setOrders(JSON.parse(savedOrders))
          } else {
            setOrders(mockOrders)
            localStorage.setItem(storageKey, JSON.stringify(mockOrders))
          }
        }
      } catch (error) {
        const savedOrders = localStorage.getItem(storageKey)
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders))
        } else {
          setOrders(mockOrders)
          localStorage.setItem(storageKey, JSON.stringify(mockOrders))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [storageKey, userId])

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
              <p className="font-bold">Order #{order.id}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(order.status)}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}