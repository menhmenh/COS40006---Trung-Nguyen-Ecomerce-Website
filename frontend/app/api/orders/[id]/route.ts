import { NextResponse } from 'next/server'

import { getOrderById } from '@/lib/server-data'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const order = await getOrderById(id)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Get order detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 },
    )
  }
}
