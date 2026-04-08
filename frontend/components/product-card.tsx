import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Product } from '@/lib/store'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-muted hover:shadow-xl transition-smooth hover-scale animate-fade-in-up">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-muted relative overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-8 transition-transform duration-500 hover:scale-110"
          />
          {product.badge && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full animate-bounce-slight">
              {product.badge}
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-xl mb-2 hover:text-muted-foreground transition-smooth">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
          <Link href={`/products/${product.id}`}>
            <Button className="rounded-full px-6 hover:shadow-lg transition-smooth hover:scale-105">ORDER NOW</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
