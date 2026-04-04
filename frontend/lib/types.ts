export type Product = {
  id: string
  categoryId: string
  category: string
  categoryName: string
  name: string
  price: number
  stock: number
  description: string
  image: string
  badge?: string
  rating: number
  reviews: number
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
}

export type CartItem = {
  productId: string
  productName: string
  quantity: number
  price: number
  image?: string
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type OrderItem = {
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string
}

export type ShippingAddress = {
  fullName: string
  phone: string
  addressLine: string
  city: string
}

export type Order = {
  id: string
  orderCode: string
  userId: string
  createdAt: string
  total: number
  status: OrderStatus
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}

export type SessionUser = {
  id: string
  email: string
  name: string
  username?: string
}
