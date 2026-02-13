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
    name: 'Cà phê',
    slug: 'coffee',
    children: [
      { id: '1-1', name: 'Cà phê chuyên biệt', slug: 'specialty-coffee', parentId: '1' },
      { id: '1-2', name: 'Cà phê Rắng xay', slug: 'ground-coffee', parentId: '1' },
      { id: '1-3', name: 'Cà phê Hòa tan', slug: 'instant-coffee', parentId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Trung Nguyên G7',
    slug: 'trung-nguyen-g7',
    children: [
      { id: '2-1', name: 'Trung Nguyên G7 Gold', slug: 'g7-gold', parentId: '2' },
      { id: '2-2', name: 'Trung Nguyên G7 Legend', slug: 'g7-legend', parentId: '2' },
    ],
  },
  {
    id: '3',
    name: 'Cà phê Hạt',
    slug: 'bean-coffee',
  },
  {
    id: '4',
    name: 'Công cụ dùng cà phê',
    slug: 'coffee-tools',
  },
  {
    id: '5',
    name: 'Máy cà phê',
    slug: 'coffee-machines',
  },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Cà phê G7 Gold Piccaso Latte hộp 8 gói',
    category: 'g7-gold',
    price: 53620,
    description: 'Mang phong vị cà la cà phê Piccaso Latte tật không giản. Thế giới Cà phê Trung Nguyên Legend với vị béo, chất đắng nhẹ hòa lẫn hương vanilla ngọt dịu và lộp foam gây.',
    image: '/products/double-espresso.png',
    badge: '-10%',
    rating: 4.9,
    reviews: 2424,
    sku: '5001123',
    brand: 'Trung Nguyên Legend',
    unit: 'Hộp',
    packaging: '8 sticks x 18gr',
    expiry: '2 năm kể từ ngày sản xuất',
    origin: 'Việt Nam',
    specifications: 'Độ đậm 5.5%. Thành phần: Bột kem (có chứa sữa), đường, aldextrin, cà phê hòa tan (5%), cà phê rang xay nhuyễn (5%), muối ớt, bột dâu nành, hương liệu Cà Phê công ngoài dùng trong thực phẩm.',
    usage: 'Hòa một gói cà phê hòa tan G7 vào 80ml nước nóng (80°C-100°C), khuấy đều và thưởng thức.',
  },
  {
    id: '2',
    name: 'Cà phê G7 Gold Rumi hộp 8 gói',
    category: 'g7-gold',
    price: 53620,
    description: 'Cà phê hòa tan chuyên biệt với vị Rumi độc đáo, mang lại trải nghiệm thưởng thức cà phê chuẩn mực.',
    image: '/products/caramel-frappe.png',
    badge: '-10%',
    rating: 4.8,
    reviews: 1856,
    sku: '5001124',
    brand: 'Trung Nguyên Legend',
    unit: 'Hộp',
    packaging: '8 sticks x 18gr',
    expiry: '2 năm kể từ ngày sản xuất',
    origin: 'Việt Nam',
    specifications: 'Độ đậm 5.5%. Thành phần: Bột kem, đường, aldextrin, cà phê hòa tan, cà phê rang xay nhuyễn, hương liệu.',
    usage: 'Hòa vào 80ml nước nóng, khuấy đều và thưởng thức.',
  },
  {
    id: '3',
    name: 'Cà phê G7 Gold Motherland hộp 8 gói',
    category: 'g7-gold',
    price: 53620,
    description: 'Dòng cà phê cao cấp G7 Gold với vị đất mẹ hương thơm tự nhiên.',
    image: '/products/iced-coffee.png',
    badge: '-10%',
    rating: 4.7,
    reviews: 1645,
    sku: '5001125',
    brand: 'Trung Nguyên Legend',
    unit: 'Hộp',
    packaging: '8 sticks x 18gr',
    expiry: '2 năm kể từ ngày sản xuất',
    origin: 'Việt Nam',
    specifications: 'Độ đậm 5.5%. Thành phần: Bột kem, đường, aldextrin, cà phê hòa tan, cà phê rang xay.',
    usage: 'Hòa vào 80ml nước nóng, khuấy đều.',
  },
  {
    id: '4',
    name: 'Cà Phê Hòa Tan Sáy Lạnh Trung Nguyên',
    category: 'instant-coffee',
    price: 202954,
    description: 'Cà phê hòa tan sáy lạnh với công nghệ bảo quản tươi mới.',
    image: '/products/latte.png',
    badge: '-14%',
    rating: 4.6,
    reviews: 1234,
    sku: '5001126',
    brand: 'Trung Nguyên',
    unit: 'Chai',
    packaging: '250ml',
    expiry: '1 năm',
    origin: 'Việt Nam',
    specifications: 'Độ đậm 6%. Thành phần: Cà phê, nước đường.',
    usage: 'Uống trực tiếp hoặc thêm nước đá.',
  },
  {
    id: '5',
    name: 'Trung Nguyên Legend Americano hộp 15 gói',
    category: 'g7-legend',
    price: 108335,
    description: 'Dòng cà phê cao cấp Legend với vị Americano đỏc đáo, mang lại trải nghiệm thưởng thức đầy tinh tế.',
    image: '/products/mocha-frappe.png',
    badge: '-10%',
    rating: 4.8,
    reviews: 1567,
    sku: '5001201',
    brand: 'Trung Nguyên Legend',
    unit: 'Hộp',
    packaging: '15 sticks x 20gr',
    expiry: '2 năm',
    origin: 'Việt Nam',
    specifications: 'Độ đậm 6%. Thành phần hợp thành từ cà phê hòa tan, sữa, đường.',
    usage: 'Hòa vào 150ml nước nóng hoặc nước lạnh, khuấy đều.',
  },
  {
    id: '6',
    name: 'Cà phê Rang xay Trung Nguyên Classic',
    category: 'ground-coffee',
    price: 98000,
    description: 'Cà phê rang xay đặc trưng, bảo toàn hương vị nguyên bản của hạt cà phê.',
    image: '/products/cold-brew.png',
    rating: 4.9,
    reviews: 1987,
    sku: '5001202',
    brand: 'Trung Nguyên',
    unit: 'Gói',
    packaging: '340g',
    expiry: '2 năm',
    origin: 'Việt Nam',
    specifications: 'Độ đậm 6.5%. Cà phê rang xay nguyên chất 100%.',
    usage: 'Dùng vào máy pha cà phê hoặc pha phin truyền thống.',
  },
  {
    id: '7',
    name: 'Cà phê chuyên biệt Arabica Đắk Lắk',
    category: 'specialty-coffee',
    price: 185000,
    description: 'Cà phê Arabica cao cấp từ vùng đất mầu mỡ Đắk Lắk, hương thơm tự nhiên độc đáo.',
    image: '/products/vanilla-gelato.png',
    badge: '-15%',
    rating: 4.7,
    reviews: 987,
    sku: '5001203',
    brand: 'Specialty Coffee Vietnam',
    unit: 'Gói',
    packaging: '250g',
    expiry: '1 năm',
    origin: 'Việt Nam - Đắk Lắk',
    specifications: 'Độ đậm 7%. Arabica nguyên chất, rang nhẹ để giữ nguyên hương thơm.',
    usage: 'Pha phin hoặc máy pha cà phê, uống nóng để cảm nhận full vị.',
  },
  {
    id: '8',
    name: 'Combo máy pha cà phê Conti 1G',
    category: 'coffee-machines',
    price: 4331000,
    description: 'Máy pha cà phê chuyên nghiệp cho quán cà phê, năng suất cao, bền bỉ.',
    image: '/products/americano.png',
    badge: '-12%',
    rating: 4.8,
    reviews: 1234,
    sku: '6001001',
    brand: 'Conti',
    unit: 'Chiếc',
    packaging: '1 máy',
    expiry: '5 năm bảo hành',
    origin: 'Ý',
    specifications: 'Máy pha tự động, công suất 15L/giờ, 2 đầu pha',
    usage: 'Dành cho quán cà phê, khách sạn, nhà hàng.',
  },
  {
    id: '9',
    name: 'Combo máy pha cà phê Appia Life 1F',
    category: 'coffee-machines',
    price: 7902000,
    description: 'Máy pha cà phê chuyên nghiệp với công nghệ tiên tiến từ Ý.',
    image: '/products/cappuccino.png',
    rating: 4.6,
    reviews: 876,
    sku: '6001002',
    brand: 'Appia',
    unit: 'Chiếc',
    packaging: '1 máy',
    expiry: '5 năm bảo hành',
    origin: 'Ý',
    specifications: 'Máy pha bán tự động, công suất 20L/giờ, 1 đầu pha',
    usage: 'Cho quán cà phê, cửa hàng bán lẻ.',
  },
  {
    id: '10',
    name: 'Bộ công cụ pha cà phê Phin truyền thống',
    category: 'coffee-tools',
    price: 150000,
    description: 'Bộ công cụ pha cà phê phin Việt truyền thống, hoàn toàn bằng nhôm cao cấp.',
    image: '/products/strawberry-frappe.png',
    badge: '-8%',
    rating: 4.9,
    reviews: 1456,
    sku: '7001001',
    brand: 'Truyền Thống',
    unit: 'Bộ',
    packaging: '1 phin, 1 cốc',
    expiry: 'Không hạn',
    origin: 'Việt Nam',
    specifications: 'Phin nhôm cao cấp, cốc sứ sáng bóng',
    usage: 'Pha cà phê theo phương pháp truyền thống Việt Nam.',
  },
  {
    id: '11',
    name: 'Cà phê Robusta Đắk Nông cao cấp',
    category: 'specialty-coffee',
    price: 165000,
    description: 'Cà phê Robusta 100% từ Đắk Nông, vị đắng nhẹ, hương thơm đậm đà.',
    image: '/products/latte.png',
    rating: 4.8,
    reviews: 1123,
    sku: '5001204',
    brand: 'Đắk Nông Coffee',
    unit: 'Gói',
    packaging: '250g',
    expiry: '1.5 năm',
    origin: 'Việt Nam - Đắk Nông',
    specifications: 'Độ đậm 7.5%. Robusta nguyên chất, rang trung bình.',
    usage: 'Pha phin hoặc máy pha, thích hợp cho cà phê nâu đặc đao.',
  },
  {
    id: '12',
    name: 'Trung Nguyên G7 Black hộp 15 gói',
    category: 'g7-gold',
    price: 75500,
    description: 'Cà phê hòa tan G7 Black - vị đen đắng đơn thuần, không có kem hay đường.',
    image: '/products/double-espresso.png',
    badge: '-12%',
    rating: 4.7,
    reviews: 876,
    sku: '5001205',
    brand: 'Trung Nguyên G7',
    unit: 'Hộp',
    packaging: '15 sticks x 2gr',
    expiry: '2 năm',
    origin: 'Việt Nam',
    specifications: 'Độ đậm 8.5%. Cà phê hòa tan 100% nguyên chất.',
    usage: 'Hòa vào 100ml nước nóng, uống trực tiếp hoặc thêm đá.',
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
