import { NextResponse } from 'next/server'

import { getPool, sql } from '@/lib/db'
import { calculatePointsFromOrderTotal, getTierFromPoints } from '@/lib/loyalty'
import { createOrder, getOrdersByUserId } from '@/lib/server-data'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, items, shippingAddress, paymentMethod } = body

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const order = await createOrder({
      userId,
      items,
      shippingAddress: {
        fullName: shippingAddress?.fullName || 'Khach hang',
        phone: shippingAddress?.phone || '',
        addressLine: shippingAddress?.addressLine || 'Dia chi mac dinh',
        city: shippingAddress?.city || 'TP.HCM',
      },
      paymentMethod: paymentMethod || 'cod',
    })

    const earnedPoints = calculatePointsFromOrderTotal(order?.total || 0)
    const pool = await getPool()
    const pointsUpdate = await pool
      .request()
      .input('userId', sql.Char(36), userId)
      .input('earnedPoints', sql.Int, earnedPoints)
      .query(`
        UPDATE users
        SET loyalty_points = COALESCE(loyalty_points, 0) + @earnedPoints
        OUTPUT INSERTED.loyalty_points
        WHERE user_id = @userId
      `)

    const totalPoints = Number(pointsUpdate.recordset[0]?.loyalty_points || 0)
    const tier = getTierFromPoints(totalPoints)

    await pool
      .request()
      .input('userId', sql.Char(36), userId)
      .input('tier', sql.VarChar(20), tier)
      .query(`
        UPDATE users
        SET loyalty_tier = @tier
        WHERE user_id = @userId
      `)

    return NextResponse.json({
      ...order,
      loyalty: {
        earnedPoints,
        totalPoints,
        tier,
      },
    })
  } catch (error) {
    console.error('Create order API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
