import { NextResponse } from 'next/server'

import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from '@/lib/server-data'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const products = await listProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Get products API error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.categoryId || body.price == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await createProduct({
      name: body.name,
      categoryId: body.categoryId,
      price: Number(body.price),
      stock: Number(body.stock || 0),
      description: body.description || '',
      image: body.image || '',
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create product API error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const product = await updateProduct(id, {
      name: updates.name,
      categoryId: updates.categoryId,
      price: updates.price != null ? Number(updates.price) : undefined,
      stock: updates.stock != null ? Number(updates.stock) : undefined,
      description: updates.description,
      image: updates.image,
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product API error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product API error:', error)
    return NextResponse.json(
      {
        error:
          'Failed to delete product. This product may already be used in orders or reviews.',
      },
      { status: 500 },
    )
  }
}
