import { NextResponse } from 'next/server'
import { createOrder, getUserOrders } from '@/lib/store'

export async function POST(request: Request) {
  try {
    const { userId, items } = await request.json()

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    const order = createOrder(userId, items)
    return NextResponse.json(order)
  } catch (error) {
    console.error('[v0] Create order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const orders = getUserOrders(userId)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('[v0] Get orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
