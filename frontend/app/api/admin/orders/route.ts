import { NextResponse } from 'next/server'

import { getAllOrders, updateOrderStatus } from '@/lib/server-data'
import type { OrderStatus } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Admin get orders API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    const updatedOrder = await updateOrderStatus(orderId, status as OrderStatus)

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Admin update order API error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
