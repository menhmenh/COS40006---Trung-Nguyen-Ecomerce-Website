import 'server-only'

import { getPool, sql } from '@/lib/db'
import type {
  Category,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ShippingAddress,
} from '@/lib/types'

// --- TYPES ---

type ProductRow = {
  id: string
  categoryId: string | null
  categoryName: string | null
  name: string
  price: number | string
  stock: number | string | null
  description: string | null
  image: string | null 
  rating: number | string | null
  reviews: number | string | null
}

type CategoryRow = {
  id: string
  name: string
}

type OrderHeaderRow = {
  id: string
  orderCode: string
  userId: string
  createdAt: Date | string
  status: string | null
  total: number | string | null
  shippingFullName: string | null
  shippingPhone: string | null
  shippingAddressLine: string | null
  shippingCity: string | null
}

type OrderItemRow = {
  productId: string
  productName: string | null
  price: number | string
  quantity: number | string
  image: string | null
}

type CreateOrderInput = {
  userId: string
  items: Array<{ productId: string; quantity: number }>
  shippingAddress: ShippingAddress
  paymentMethod?: string
}

type ProductInput = {
  categoryId: string
  name: string
  price: number
  stock: number
  description: string
  image?: string
}

const STORAGE_ENDPOINT = (process.env.NEXT_PUBLIC_STORAGE_ENDPOINT || '').trim().replace(/\/$/, '')
const STORAGE_BUCKET = (process.env.NEXT_PUBLIC_STORAGE || 'product').trim()

function getStoragePublicBase(endpoint: string) {
  if (!endpoint) return ''
  if (endpoint.endsWith('/storage/v1/s3')) {
    return endpoint.replace(/\/storage\/v1\/s3$/, '/storage/v1/object/public')
  }
  if (endpoint.endsWith('/storage/v1/object/public')) {
    return endpoint
  }
  return `${endpoint}/storage/v1/object/public`
}

const STORAGE_PUBLIC_BASE = getStoragePublicBase(STORAGE_ENDPOINT)

// --- HELPERS ---

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeOrderStatus(status?: string | null): OrderStatus {
  const normalized = String(status || 'pending').toLowerCase()
  const validStatuses: OrderStatus[] = ['paid', 'packed', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded']
  return validStatuses.includes(normalized as OrderStatus) ? (normalized as OrderStatus) : 'pending'
}

function mapImageUrl(image?: string | null) {
  const value = image?.trim()
  if (!value) return '/placeholder.svg'
  if (value === '/placeholder.svg') {
    return value
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  const normalizedPath = value.replace(/^\/+/, '')

  if (!STORAGE_PUBLIC_BASE || !STORAGE_BUCKET) {
    return `/${normalizedPath}`
  }

  const safePath = normalizedPath
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${STORAGE_PUBLIC_BASE}/${encodeURIComponent(STORAGE_BUCKET)}/${safePath}`
}

// --- MAPPING LOGIC ---

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: slugify(row.name),
  }
}

function mapProduct(row: ProductRow): Product {
  const categoryName = row.categoryName || 'Uncategorized'
  const stock = Number(row.stock || 0)

  return {
    id: row.id,
    categoryId: row.categoryId || '',
    category: slugify(categoryName),
    categoryName,
    name: row.name,
    price: Number(row.price || 0),
    stock,
    description: row.description || '',
    image: mapImageUrl(row.image),
    badge: stock > 0 ? undefined : 'Sold Out',
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews || 0),
  }
}

function mapOrderHeader(row: OrderHeaderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    orderCode: row.orderCode,
    userId: row.userId,
    createdAt: new Date(row.createdAt).toISOString(),
    total: Number(row.total || 0),
    status: normalizeOrderStatus(row.status),
    items,
    shippingAddress:
      row.shippingFullName || row.shippingAddressLine || row.shippingCity
        ? {
            fullName: row.shippingFullName || '',
            phone: row.shippingPhone || '',
            addressLine: row.shippingAddressLine || '',
            city: row.shippingCity || '',
          }
        : undefined,
  }
}

// --- DATABASE ACTIONS ---

async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('orderId', orderId)
    .query(`
      SELECT
        od.product_id AS productId,
        p.name AS productName,
        od.price,
        od.quantity,
        COALESCE(pi.image_url, '/placeholder.svg') AS image
      FROM order_details od
      LEFT JOIN products p ON p.product_id = od.product_id
      OUTER APPLY (
        SELECT TOP 1 image_url
        FROM product_images
        WHERE product_id = od.product_id
        ORDER BY product_image_id
      ) pi
      WHERE od.order_id = @orderId
      ORDER BY p.name
    `)

  return result.recordset.map((row: OrderItemRow) => ({
    productId: row.productId,
    productName: row.productName || 'Unknown Product',
    price: Number(row.price || 0),
    quantity: Number(row.quantity || 0),
    image: mapImageUrl(row.image),
  }))
}

async function getOrderHeaders(whereClause = '', inputs?: (request: any) => any) {
  const pool = await getPool()
  let request = pool.request()
  if (inputs) request = inputs(request)

  const result = await request.query(`
    SELECT
      o.order_id AS id, o.order_code AS orderCode, o.user_id AS userId, o.created_at AS createdAt,
      o.status, COALESCE(payments.total, totals.total, 0) AS total,
      a.recipient_name AS shippingFullName, a.phone_number AS shippingPhone,
      a.address_line AS shippingAddressLine, a.city AS shippingCity
    FROM orders o
    LEFT JOIN addresses a ON a.address_id = o.address_id
    OUTER APPLY (SELECT TOP 1 total FROM payments WHERE order_id = o.order_id ORDER BY created_at DESC) payments
    OUTER APPLY (SELECT SUM(od.price * od.quantity) AS total FROM order_details od WHERE od.order_id = o.order_id) totals
    ${whereClause}
    ORDER BY o.created_at DESC
  `)
  return result.recordset as OrderHeaderRow[]
}

async function hydrateOrders(rows: OrderHeaderRow[]) {
  return await Promise.all(
    rows.map(async (row) => {
      const items = await getOrderItems(row.id)
      return mapOrderHeader(row, items)
    }),
  )
}

export async function listCategories() {
  const pool = await getPool()
  const result = await pool.request().query(`SELECT category_id AS id, name FROM categories ORDER BY name`)
  return result.recordset.map((row: CategoryRow) => mapCategory(row))
}

export async function listProducts() {
  const pool = await getPool()
  const result = await pool.request().query(`
    SELECT
      p.product_id AS id,
      p.category_id AS categoryId,
      c.name AS categoryName,
      p.name,
      p.price,
      p.stock,
      p.description,
      COALESCE(pi.image_url, '/placeholder.svg') AS image,
      CAST(COALESCE(review_stats.rating, 0) AS DECIMAL(10, 2)) AS rating,
      COALESCE(review_stats.reviews, 0) AS reviews
    FROM products p
    LEFT JOIN categories c ON c.category_id = p.category_id
    OUTER APPLY (
      SELECT TOP 1 image_url
      FROM product_images
      WHERE product_id = p.product_id
      ORDER BY product_image_id
    ) pi
    OUTER APPLY (
      SELECT
        AVG(CAST(rating AS DECIMAL(10, 2))) AS rating,
        COUNT(*) AS reviews
      FROM reviews
      WHERE product_id = p.product_id
    ) review_stats
    ORDER BY p.created_at DESC, p.name
  `)

  return result.recordset.map((row: ProductRow) => mapProduct(row))
}

export async function getProductById(id: string) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', id)
    .query(`
      SELECT
        p.product_id AS id,
        p.category_id AS categoryId,
        c.name AS categoryName,
        p.name,
        p.price,
        p.stock,
        p.description,
        COALESCE(pi.image_url, '/placeholder.svg') AS image,
        CAST(COALESCE(review_stats.rating, 0) AS DECIMAL(10, 2)) AS rating,
        COALESCE(review_stats.reviews, 0) AS reviews
      FROM products p
      LEFT JOIN categories c ON c.category_id = p.category_id
      OUTER APPLY (
        SELECT TOP 1 image_url
        FROM product_images
        WHERE product_id = p.product_id
        ORDER BY product_image_id
      ) pi
      OUTER APPLY (
        SELECT
          AVG(CAST(rating AS DECIMAL(10, 2))) AS rating,
          COUNT(*) AS reviews
        FROM reviews
        WHERE product_id = p.product_id
      ) review_stats
      WHERE p.product_id = @id
    `)

  if (result.recordset.length === 0) return null
  return mapProduct(result.recordset[0] as ProductRow)
}

export async function createProduct(input: ProductInput) {
  const pool = await getPool()
  const transaction = new sql.Transaction(pool)
  await transaction.begin()
  try {
    const productInsert = await new sql.Request(transaction)
      .input('categoryId', input.categoryId)
      .input('name', input.name)
      .input('price', input.price)
      .input('stock', input.stock)
      .input('description', input.description)
      .query(`
        INSERT INTO products (product_id, category_id, name, price, stock, description, created_at)
        OUTPUT INSERTED.product_id AS id
        VALUES (CONVERT(CHAR(36), NEWID()), @categoryId, @name, @price, @stock, @description, GETDATE())
      `)
    
    const productId = productInsert.recordset[0]?.id

    // Trả lại logic insert ảnh vào bảng product_images
    if (input.image) {
      await new sql.Request(transaction)
        .input('productId', productId)
        .input('imageUrl', input.image)
        .query(`
          INSERT INTO product_images (product_image_id, product_id, image_url)
          VALUES (CONVERT(CHAR(36), NEWID()), @productId, @imageUrl)
        `)
    }

    await transaction.commit()
    return getProductById(productId)
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const pool = await getPool()
  const transaction = new sql.Transaction(pool)
  await transaction.begin()
  try {
    await new sql.Request(transaction)
      .input('id', id)
      .input('categoryId', input.categoryId ?? null)
      .input('name', input.name ?? null)
      .input('price', input.price ?? null)
      .input('stock', input.stock ?? null)
      .input('description', input.description ?? null)
      .query(`
        UPDATE products
        SET
          category_id = COALESCE(@categoryId, category_id),
          name = COALESCE(@name, name),
          price = COALESCE(@price, price),
          stock = COALESCE(@stock, stock),
          description = COALESCE(@description, description)
        WHERE product_id = @id
      `)

    // Logic update bảng product_images
    if (typeof input.image === 'string') {
      await new sql.Request(transaction)
        .input('id', id)
        .input('image', input.image)
        .query(`
          IF EXISTS (SELECT 1 FROM product_images WHERE product_id = @id)
          BEGIN
            UPDATE product_images SET image_url = @image
            WHERE product_image_id = (SELECT TOP 1 product_image_id FROM product_images WHERE product_id = @id ORDER BY product_image_id)
          END
          ELSE
          BEGIN
            INSERT INTO product_images (product_image_id, product_id, image_url)
            VALUES (CONVERT(CHAR(36), NEWID()), @id, @image)
          END
        `)
    }

    await transaction.commit()
    return getProductById(id)
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export async function deleteProduct(id: string) {
  const pool = await getPool()
  const transaction = new sql.Transaction(pool)
  await transaction.begin()
  try {
    await new sql.Request(transaction).input('id', id).query(`DELETE FROM product_images WHERE product_id = @id;`)
    await new sql.Request(transaction).input('id', id).query(`DELETE FROM products WHERE product_id = @id;`)
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export async function createOrder(input: CreateOrderInput) {
  const pool = await getPool()
  const transaction = new sql.Transaction(pool)
  const orderCode = `ORD-${Date.now()}`
  await transaction.begin()
  try {
    const addressInsert = await new sql.Request(transaction)
      .input('userId', input.userId)
      .input('recipientName', input.shippingAddress.fullName)
      .input('phone', input.shippingAddress.phone)
      .input('address', input.shippingAddress.addressLine)
      .input('city', input.shippingAddress.city)
      .query(`
        INSERT INTO addresses (address_id, user_id, recipient_name, phone_number, address_line, city, is_default)
        OUTPUT INSERTED.address_id AS id
        VALUES (CONVERT(CHAR(36), NEWID()), @userId, @recipientName, @phone, @address, @city, 0)
      `)
    const addressId = addressInsert.recordset[0].id
    const orderInsert = await new sql.Request(transaction)
      .input('userId', input.userId)
      .input('addressId', addressId)
      .input('orderCode', orderCode)
      .query(`
        INSERT INTO orders (order_id, user_id, address_id, order_code, status, created_at)
        OUTPUT INSERTED.order_id AS id
        VALUES (CONVERT(CHAR(36), NEWID()), @userId, @addressId, @orderCode, 'pending', GETDATE())
      `)
    const orderId = orderInsert.recordset[0].id
    let total = 0
    for (const item of input.items) {
      const p = await new sql.Request(transaction).input('pid', item.productId).query(`SELECT price FROM products WHERE product_id=@pid`)
      const price = Number(p.recordset[0].price)
      total += price * item.quantity
      await new sql.Request(transaction).input('oid', orderId).input('pid', item.productId).input('qty', item.quantity).input('prc', price)
        .query(`INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, price) VALUES (CONVERT(CHAR(36), NEWID()), @oid, @pid, @qty, @prc)`)
    }
    await new sql.Request(transaction).input('oid', orderId).input('total', total).input('method', input.paymentMethod || 'Card')
      .query(`INSERT INTO payments (payment_id, order_id, total, payment_method, status, created_at) VALUES (CONVERT(CHAR(36), NEWID()), @oid, @total, @method, 'Pending', GETDATE())`)
    
    await transaction.commit()
    return getOrderById(orderId)
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export async function getOrdersByUserId(userId: string) {
  const rows = await getOrderHeaders('WHERE o.user_id = @userId', (r) => r.input('userId', userId))
  return hydrateOrders(rows)
}

export async function getOrderById(orderId: string) {
  const rows = await getOrderHeaders('WHERE o.order_id = @orderId', (r) => r.input('orderId', orderId))
  if (rows.length === 0) return null
  const items = await getOrderItems(orderId)
  return mapOrderHeader(rows[0], items)
}

export async function getAllOrders() {
  const rows = await getOrderHeaders()
  return hydrateOrders(rows)
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const pool = await getPool()
  await pool.request().input('oid', orderId).input('st', status).query(`UPDATE orders SET status = @st WHERE order_id = @oid`)
  return getOrderById(orderId)
}