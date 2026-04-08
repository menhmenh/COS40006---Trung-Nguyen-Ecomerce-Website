'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/store'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Star, Minus, Plus, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const handleAddToCart = () => {
    addItem(product.id, quantity)
    toast({
      title: 'Added to cart',
      description: `${quantity} × ${product.name} added to your cart`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Link href="/products">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </Link>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="bg-muted rounded-2xl p-12 relative aspect-square">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-8"
            />
            {product.badge && (
              <div className="absolute top-6 left-6 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-full">
                {product.badge}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(product.rating)
                        ? 'fill-foreground text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-5xl font-bold mb-6">${product.price.toFixed(2)}</div>

            {/* Description */}
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-sm font-medium mb-3 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 rounded-full py-6 text-lg"
              >
                ADD TO CART
              </Button>
              <Button
                onClick={() => {
                  handleAddToCart()
                  router.push('/cart')
                }}
                variant="outline"
                className="rounded-full px-8"
              >
                BUY NOW
              </Button>
            </div>

            {/* Product Info */}
            <div className="mt-8 space-y-3 border-t border-border pt-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium capitalize">{product.category.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-medium text-green-600">In Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
    </div>
  )
}
