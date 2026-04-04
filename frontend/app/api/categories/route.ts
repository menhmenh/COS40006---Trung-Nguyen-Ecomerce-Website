import { NextResponse } from 'next/server'

import { listCategories } from '@/lib/server-data'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const categories = await listCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Get categories API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    )
  }
}
