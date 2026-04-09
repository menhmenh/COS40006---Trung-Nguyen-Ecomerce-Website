import { NextResponse } from 'next/server'

import { listProducts } from '@/lib/server-data'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const products = await listProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Get products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    )
  }
}
