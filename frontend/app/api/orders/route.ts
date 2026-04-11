import { NextResponse } from 'next/server'
import { createOrder, getOrdersByUserId } from '@/lib/server-data'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, items, shippingAddress, paymentMethod } = body

    if (
      !userId ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const order = await createOrder({
      userId,
      items,
      shippingAddress: {
        fullName: shippingAddress?.fullName || 'Khách hàng',
        phone: shippingAddress?.phone || '',
        addressLine: shippingAddress?.addressLine || 'Địa chỉ mặc định',
        city: shippingAddress?.city || 'TP.HCM',
      },
      paymentMethod: paymentMethod || 'cod',
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

// ĐÂY CHÍNH LÀ HÀM BỊ MẤT TÍCH GÂY RA LỖI 405
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