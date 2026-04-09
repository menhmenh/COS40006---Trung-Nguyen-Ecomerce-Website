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

        {/* Product Details (Merged Layout) */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Image */}
          <div className="md:col-span-1">
            <div className="bg-muted rounded-lg p-8 relative aspect-square mb-6">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-muted-foreground">
                {product.sku && `SKU: ${product.sku} | `}
                Category: {product.categoryName || product.category}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
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
            <div className="text-4xl font-bold mb-6 text-primary">
              ${product.price.toFixed(2)}
            </div>

            {/* Stock Status (From backend logic) */}
            <div className="mb-6">
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-sm font-medium mb-3 block">Select Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart (With Stock verification) */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 rounded-full py-6 text-base font-medium bg-primary text-primary-foreground"
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
                className="rounded-full px-8 font-medium"
                disabled={product.stock <= 0}
              >
                BUY NOW
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Table (From Chị Anh's UI layout) */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 uppercase">Details</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.sku && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted w-1/3">SKU</td>
                    <td className="px-6 py-4 text-sm">{product.sku}</td>
                  </tr>
                )}
                {product.brand && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Brand</td>
                    <td className="px-6 py-4 text-sm">{product.brand}</td>
                  </tr>
                )}
                {product.unit && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Unit</td>
                    <td className="px-6 py-4 text-sm">{product.unit}</td>
                  </tr>
                )}
                {product.packaging && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Packaging</td>
                    <td className="px-6 py-4 text-sm">{product.packaging}</td>
                  </tr>
                )}
                {product.expiry && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Expiry Date</td>
                    <td className="px-6 py-4 text-sm">{product.expiry}</td>
                  </tr>
                )}
                {product.origin && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Origin</td>
                    <td className="px-6 py-4 text-sm">{product.origin}</td>
                  </tr>
                )}
                {product.specifications && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Quality Specifications</td>
                    <td className="px-6 py-4 text-sm">{product.specifications}</td>
                  </tr>
                )}
                {product.usage && (
                  <tr>
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Usage Instructions</td>
                    <td className="px-6 py-4 text-sm">{product.usage}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products (From Chị Nhi's logic) */}
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