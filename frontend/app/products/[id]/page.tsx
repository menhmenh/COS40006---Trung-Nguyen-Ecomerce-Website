'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Star, Minus, Plus, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/lib/types'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const productId = String(params.id)

    const loadProduct = async () => {
      try {
        const [productRes, productsRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch('/api/products'),
        ])

        if (!productRes.ok) {
          setProduct(null)
          return
        }

        const [productData, productsData] = await Promise.all([
          productRes.json(),
          productsRes.json(),
        ])

        setProduct(productData)

        if (Array.isArray(productsData)) {
          setRelatedProducts(
            productsData
              .filter(
                (item: Product) =>
                  item.category === productData.category && item.id !== productData.id,
              )
              .slice(0, 3),
          )
        }
      } catch (error) {
        console.error('Failed to load product detail:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading product...
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity,
    )

    toast({
      title: 'Added to cart',
      description: `${quantity} x ${product.name} added to your cart`,
    })
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Link href="/products">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-muted rounded-2xl p-12 relative aspect-square">
            <Image
              src={product.image || '/placeholder.svg'}
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

          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

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

            <div className="text-5xl font-bold mb-6">${product.price.toFixed(2)}</div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

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

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 rounded-full py-6 text-lg"
                disabled={product.stock <= 0}
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
                disabled={product.stock <= 0}
              >
                BUY NOW
              </Button>
            </div>

            <div className="mt-8 space-y-3 border-t border-border pt-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{product.categoryName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Availability</span>
                <span
                  className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
