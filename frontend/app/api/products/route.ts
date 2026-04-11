import { NextResponse } from 'next/server'
import { listProducts } from '@/lib/server-data'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const products = await listProducts()
    
    // Vá dữ liệu: Đảm bảo mọi đường dẫn ảnh đều có dấu / ở đầu
    const formattedProducts = products.map((product: any) => ({
      ...product,
      image: product.image 
        ? (product.image.startsWith('/') ? product.image : `/${product.image}`)
        : '/placeholder.svg'
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Get products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    )
  }
}