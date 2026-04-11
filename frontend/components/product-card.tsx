import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Logic xử lý đường dẫn ảnh an toàn
  const imageSrc = product.image 
    ? (product.image.startsWith('/') || product.image.startsWith('http') 
        ? product.image 
        : `/${product.image}`)
    : '/placeholder.svg'

  return (
    <Card className="overflow-hidden border-0 bg-muted hover:shadow-lg transition-all duration-300 group">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-muted relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
            priority={true}
          />
          {product.badge && (
            <div className="absolute top-4 left-4 bg-[#C5A059] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
              {product.badge}
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 text-[#3E2723] hover:text-[#C5A059] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed min-h-[40px]">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#C5A059]">
            {product.price.toLocaleString('vi-VN')} đ
          </span>
          <Button variant="ghost" size="sm" className="rounded-full hover:bg-[#3E2723] hover:text-white border border-[#3E2723] text-[#3E2723] h-8 text-xs font-bold">
            CHI TIẾT
          </Button>
        </div>
      </div>
    </Card>
  )
}