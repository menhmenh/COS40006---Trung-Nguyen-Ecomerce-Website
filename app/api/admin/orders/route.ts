import { NextResponse } from 'next/server'
import { getAllOrders, updateOrderStatus } from '@/lib/store'

export async function GET() {
  const orders = getAllOrders()
  return NextResponse.json(orders)
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { orderId, status } = body
    const updatedOrder = updateOrderStatus(orderId, status)
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
