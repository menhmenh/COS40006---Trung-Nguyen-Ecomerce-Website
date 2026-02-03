// Hardcoded data store for the coffee shop

export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  badge?: string
  rating: number
  reviews: number
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: Date
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export const categories: Category[] = [
  { id: '1', name: 'Espresso', slug: 'espresso' },
  { id: '2', name: 'Frappe', slug: 'frappe' },
  { id: '3', name: 'Iced Coffee', slug: 'iced-coffee' },
  { id: '4', name: 'Catering', slug: 'catering' },
  { id: '5', name: 'Gelato', slug: 'gelato' },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Double Espresso',
    category: 'espresso',
    price: 59.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/double-espresso.png',
    badge: '#1 Selling',
    rating: 4.9,
    reviews: 2424,
  },
  {
    id: '2',
    name: 'Caramel Frappe',
    category: 'frappe',
    price: 59.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/caramel-frappe.png',
    badge: '#2 Selling',
    rating: 4.8,
    reviews: 1856,
  },
  {
    id: '3',
    name: 'Iced Coffee',
    category: 'iced-coffee',
    price: 59.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/iced-coffee.png',
    badge: '#3 Selling',
    rating: 4.7,
    reviews: 1645,
  },
  {
    id: '4',
    name: 'Latte Macchiato',
    category: 'espresso',
    price: 49.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/latte.png',
    rating: 4.6,
    reviews: 1234,
  },
  {
    id: '5',
    name: 'Mocha Frappe',
    category: 'frappe',
    price: 64.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/mocha-frappe.png',
    rating: 4.8,
    reviews: 1567,
  },
  {
    id: '6',
    name: 'Cold Brew',
    category: 'iced-coffee',
    price: 54.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/cold-brew.png',
    rating: 4.9,
    reviews: 1987,
  },
  {
    id: '7',
    name: 'Vanilla Gelato',
    category: 'gelato',
    price: 39.99,
    description: 'Life is like GELATO, enjoy it before it melts.',
    image: '/products/vanilla-gelato.png',
    rating: 4.7,
    reviews: 987,
  },
  {
    id: '8',
    name: 'Americano',
    category: 'espresso',
    price: 44.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/americano.png',
    rating: 4.5,
    reviews: 876,
  },
  {
    id: '9',
    name: 'Cappuccino',
    category: 'espresso',
    price: 52.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/cappuccino.png',
    rating: 4.8,
    reviews: 1432,
  },
  {
    id: '10',
    name: 'Strawberry Frappe',
    category: 'frappe',
    price: 62.99,
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: '/products/strawberry-frappe.png',
    rating: 4.6,
    reviews: 1123,
  },
]

// In-memory storage
export let users: User[] = [
  {
    id: 'user_1',
    email: 'demo@alowishus.com',
    password: 'demo123',
    name: 'Demo User',
    createdAt: new Date(),
  },
  {
    id: 'user_2',
    email: 'admin@alowishus.com',
    password: 'admin123',
    name: 'Admin User',
    createdAt: new Date(),
  },
]
export let orders: Order[] = []

// Auth helpers
export const findUserByEmail = (email: string) => {
  return users.find((user) => user.email === email)
}

export const createUser = (email: string, password: string, name: string) => {
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    password, // In production, this would be hashed
    name,
    createdAt: new Date(),
  }
  users.push(user)
  return user
}

export const createOrder = (userId: string, items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const order: Order = {
    id: `order_${Date.now()}`,
    userId,
    items,
    total,
    status: 'completed',
    createdAt: new Date(),
  }
  orders.push(order)
  return order
}

export const getUserOrders = (userId: string) => {
  return orders.filter((order) => order.userId === userId)
}

// Admin functions
export const getAllOrders = () => {
  return orders
}

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const order = orders.find((o) => o.id === orderId)
  if (order) {
    order.status = status
  }
  return order
}

export const addProduct = (product: Omit<Product, 'id'>) => {
  const newProduct: Product = {
    ...product,
    id: `product_${Date.now()}`,
  }
  products.push(newProduct)
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
    return products[index]
  }
  return null
}

export const deleteProduct = (id: string) => {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products.splice(index, 1)
    return true
  }
  return false
}
