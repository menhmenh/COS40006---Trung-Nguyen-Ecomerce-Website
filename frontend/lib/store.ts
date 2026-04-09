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
  sku?: string
  brand?: string
  unit?: string
  packaging?: string
  expiry?: string
  origin?: string
  specifications?: string
  usage?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  children?: Category[]
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
  {
    id: '1',
    name: 'Coffee',
    slug: 'coffee',
    children: [
      { id: '1-1', name: 'Specialty Coffee', slug: 'specialty-coffee', parentId: '1' },
      { id: '1-2', name: 'Roasted Ground Coffee', slug: 'ground-coffee', parentId: '1' },
      { id: '1-3', name: 'Instant Coffee', slug: 'instant-coffee', parentId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Trung Nguyên G7',
    slug: 'trung-nguyen-g7',
    children: [
      { id: '2-1', name: 'G7 Gold', slug: 'g7-gold', parentId: '2' },
      { id: '2-2', name: 'G7 Legend', slug: 'g7-legend', parentId: '2' },
    ],
  },
  {
    id: '3',
    name: 'Coffee Beans',
    slug: 'bean-coffee',
  },
  {
    id: '4',
    name: 'Coffee Equipment',
    slug: 'coffee-tools',
  },
  {
    id: '5',
    name: 'Coffee Machines',
    slug: 'coffee-machines',
  },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'G7 Gold Piccaso Latte Coffee Box (8 packets)',
    category: 'g7-gold',
    price: 53620,
    description: 'Premium instant coffee with the perfect blend of Piccaso Latte. Experience the world of Trung Nguyên Legend with rich, smooth taste combined with subtle vanilla aroma and creamy foam.',
    image: '/products/double-espresso.png',
    badge: '-10%',
    rating: 4.9,
    reviews: 2424,
    sku: '5001123',
    brand: 'Trung Nguyên Legend',
    unit: 'Box',
    packaging: '8 sticks x 18g',
    expiry: '2 years from manufacturing date',
    origin: 'Vietnam',
    specifications: 'Intensity 5.5%. Ingredients: Cream powder (contains milk), sugar, aldextrin, instant coffee (5%), roasted ground coffee (5%), salt, pepper, food-grade coffee flavoring.',
    usage: 'Dissolve one G7 instant coffee packet in 80ml hot water (80°C-100°C), stir well and enjoy.',
  },
  {
    id: '2',
    name: 'G7 Gold Rumi Coffee Box (8 packets)',
    category: 'g7-gold',
    price: 53620,
    description: 'Specialty instant coffee with unique Rumi flavor, delivering a premium coffee tasting experience.',
    image: '/products/caramel-frappe.png',
    badge: '-10%',
    rating: 4.8,
    reviews: 1856,
    sku: '5001124',
    brand: 'Trung Nguyên Legend',
    unit: 'Box',
    packaging: '8 sticks x 18g',
    expiry: '2 years from manufacturing date',
    origin: 'Vietnam',
    specifications: 'Intensity 5.5%. Ingredients: Cream powder, sugar, aldextrin, instant coffee, roasted ground coffee, flavoring.',
    usage: 'Dissolve in 80ml hot water, stir well and enjoy.',
  },
  {
    id: '3',
    name: 'G7 Gold Motherland Coffee Box (8 packets)',
    category: 'g7-gold',
    price: 53620,
    description: 'Premium G7 Gold coffee line with unique motherland flavor and natural aroma.',
    image: '/products/iced-coffee.png',
    badge: '-10%',
    rating: 4.7,
    reviews: 1645,
    sku: '5001125',
    brand: 'Trung Nguyên Legend',
    unit: 'Box',
    packaging: '8 sticks x 18g',
    expiry: '2 years from manufacturing date',
    origin: 'Vietnam',
    specifications: 'Intensity 5.5%. Ingredients: Cream powder, sugar, aldextrin, instant coffee, roasted ground coffee.',
    usage: 'Dissolve in 80ml hot water and stir well.',
  },
  {
    id: '4',
    name: 'Trung Nguyên Instant Cold-Brewed Coffee',
    category: 'instant-coffee',
    price: 202954,
    description: 'Cold-brewed instant coffee with fresh preservation technology.',
    image: '/products/latte.png',
    badge: '-14%',
    rating: 4.6,
    reviews: 1234,
    sku: '5001126',
    brand: 'Trung Nguyên',
    unit: 'Bottle',
    packaging: '250ml',
    expiry: '1 year',
    origin: 'Vietnam',
    specifications: 'Intensity 6%. Ingredients: Coffee, sugared water.',
    usage: 'Drink directly or add ice.',
  },
  {
    id: '5',
    name: 'Trung Nguyên Legend Americano Coffee Box (15 packets)',
    category: 'g7-legend',
    price: 108335,
    description: 'Premium Legend coffee line with unique Americano flavor, delivering a sophisticated coffee tasting experience.',
    image: '/products/mocha-frappe.png',
    badge: '-10%',
    rating: 4.8,
    reviews: 1567,
    sku: '5001201',
    brand: 'Trung Nguyên Legend',
    unit: 'Box',
    packaging: '15 sticks x 20g',
    expiry: '2 years',
    origin: 'Vietnam',
    specifications: 'Intensity 6%. Composition: Instant coffee, milk, sugar.',
    usage: 'Dissolve in 150ml hot or cold water and stir well.',
  },
  {
    id: '6',
    name: 'Trung Nguyên Classic Roasted Ground Coffee',
    category: 'ground-coffee',
    price: 98000,
    description: 'Characterful roasted ground coffee that preserves the original flavor of coffee beans.',
    image: '/products/cold-brew.png',
    rating: 4.9,
    reviews: 1987,
    sku: '5001202',
    brand: 'Trung Nguyên',
    unit: 'Package',
    packaging: '340g',
    expiry: '2 years',
    origin: 'Vietnam',
    specifications: 'Intensity 6.5%. 100% pure roasted and ground coffee.',
    usage: 'Use in coffee maker or traditional Vietnamese phin.',
  },
  {
    id: '7',
    name: 'Specialty Arabica Coffee from Dak Lak',
    category: 'specialty-coffee',
    price: 185000,
    description: 'Premium Arabica coffee from the fertile region of Dak Lak with unique natural aroma.',
    image: '/products/vanilla-gelato.png',
    badge: '-15%',
    rating: 4.7,
    reviews: 987,
    sku: '5001203',
    brand: 'Specialty Coffee Vietnam',
    unit: 'Package',
    packaging: '250g',
    expiry: '1 year',
    origin: 'Vietnam - Dak Lak',
    specifications: 'Intensity 7%. Pure Arabica, light roast to preserve the full aroma.',
    usage: 'Use Vietnamese phin or coffee maker, drink hot to experience full flavor.',
  },
  {
    id: '8',
    name: 'Conti 1G Professional Coffee Machine Combo',
    category: 'coffee-machines',
    price: 4331000,
    description: 'Professional coffee maker for coffee shops - high capacity, durable construction.',
    image: '/products/americano.png',
    badge: '-12%',
    rating: 4.8,
    reviews: 1234,
    sku: '6001001',
    brand: 'Conti',
    unit: 'Piece',
    packaging: '1 machine',
    expiry: '5 years warranty',
    origin: 'Italy',
    specifications: 'Automatic coffee maker, capacity 15L/hour, 2 brewing heads',
    usage: 'Suitable for coffee shops, hotels, restaurants.',
  },
  {
    id: '9',
    name: 'Appia Life 1F Professional Coffee Machine Combo',
    category: 'coffee-machines',
    price: 7902000,
    description: 'Professional coffee maker with advanced technology from Italy.',
    image: '/products/cappuccino.png',
    rating: 4.6,
    reviews: 876,
    sku: '6001002',
    brand: 'Appia',
    unit: 'Piece',
    packaging: '1 machine',
    expiry: '5 years warranty',
    origin: 'Italy',
    specifications: 'Semi-automatic coffee maker, capacity 20L/hour, 1 brewing head',
    usage: 'For coffee shops and retail stores.',
  },
  {
    id: '10',
    name: 'Traditional Vietnamese Phin Coffee Maker Set',
    category: 'coffee-tools',
    price: 150000,
    description: 'Traditional Vietnamese phin coffee maker set made entirely of premium aluminum.',
    image: '/products/strawberry-frappe.png',
    badge: '-8%',
    rating: 4.9,
    reviews: 1456,
    sku: '7001001',
    brand: 'Traditional',
    unit: 'Set',
    packaging: '1 phin, 1 cup',
    expiry: 'No expiration',
    origin: 'Vietnam',
    specifications: 'Premium aluminum phin, glossy ceramic cup',
    usage: 'Brew coffee using traditional Vietnamese phin method.',
  },
  {
    id: '11',
    name: 'Premium Robusta Coffee from Dak Nong',
    category: 'specialty-coffee',
    price: 165000,
    description: '100% Robusta coffee from Dak Nong with light bitter taste and rich aroma.',
    image: '/products/latte.png',
    rating: 4.8,
    reviews: 1123,
    sku: '5001204',
    brand: 'Dak Nong Coffee',
    unit: 'Package',
    packaging: '250g',
    expiry: '1.5 years',
    origin: 'Vietnam - Dak Nong',
    specifications: 'Intensity 7.5%. Pure Robusta, medium roast.',
    usage: 'Use Vietnamese phin or coffee maker, perfect for strong Vietnamese coffee.',
  },
  {
    id: '12',
    name: 'Trung Nguyên G7 Black Coffee Box (15 packets)',
    category: 'g7-gold',
    price: 75500,
    description: 'G7 Black instant coffee - pure bitter black coffee flavor, no cream or sugar added.',
    image: '/products/double-espresso.png',
    badge: '-12%',
    rating: 4.7,
    reviews: 876,
    sku: '5001205',
    brand: 'Trung Nguyên G7',
    unit: 'Box',
    packaging: '15 sticks x 2g',
    expiry: '2 years',
    origin: 'Vietnam',
    specifications: 'Intensity 8.5%. 100% pure instant coffee.',
    usage: 'Dissolve in 100ml hot water, drink straight or add ice.',
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
