import { NextResponse } from 'next/server'

import { createOrder, getOrdersByUserId } from '@/lib/server-data'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { userId, items, shippingAddress, paymentMethod } = await request.json()

    if (
      !userId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !shippingAddress?.fullName ||
      !shippingAddress?.addressLine ||
      !shippingAddress?.city
    ) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const order = await createOrder({
      userId,
      items,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone || '',
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city,
      },
      paymentMethod,
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Create order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const orders = await getOrdersByUserId(userId)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Get orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
