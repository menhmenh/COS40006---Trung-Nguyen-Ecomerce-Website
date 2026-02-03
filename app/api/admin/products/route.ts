import { NextResponse } from 'next/server'
import { products, addProduct, updateProduct, deleteProduct } from '@/lib/store'

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newProduct = addProduct(body)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const updatedProduct = updateProduct(id, updates)
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(updatedProduct)
  } catch (error) {
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
    const deleted = deleteProduct(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
