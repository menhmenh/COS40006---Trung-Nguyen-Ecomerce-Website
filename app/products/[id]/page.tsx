'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
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
      <div className="min-h-screen">
        <Header />
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
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        {/* Product Details */}
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

            {/* SKU */}
            <p className="text-sm text-muted-foreground mb-4">
              {product.sku && `Mã sản phẩm: ${product.sku}`}
            </p>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Price */}
            <div className="text-4xl font-bold mb-6 text-primary">
              {product.price.toLocaleString('vi-VN')} đ
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-8">
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
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-sm font-medium mb-3 block">Chọn số lượng</label>
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

            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 rounded-full py-6 text-base font-medium bg-primary text-primary-foreground"
              >
                THÊM VÀO GIỎ HÀNG
              </Button>
              <Button
                onClick={() => {
                  handleAddToCart()
                  router.push('/cart')
                }}
                variant="outline"
                className="rounded-full px-8 font-medium"
              >
                MUA NGAY
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 uppercase">Chi tiết</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.sku && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Mã sản phẩm</td>
                    <td className="px-6 py-4 text-sm">{product.sku}</td>
                  </tr>
                )}
                {product.brand && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Thương hiệu</td>
                    <td className="px-6 py-4 text-sm">{product.brand}</td>
                  </tr>
                )}
                {product.unit && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Đơn vị tính</td>
                    <td className="px-6 py-4 text-sm">{product.unit}</td>
                  </tr>
                )}
                {product.packaging && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Quy cách đóng thúng</td>
                    <td className="px-6 py-4 text-sm">{product.packaging}</td>
                  </tr>
                )}
                {product.expiry && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Hạn sử dụng</td>
                    <td className="px-6 py-4 text-sm">{product.expiry}</td>
                  </tr>
                )}
                {product.origin && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Xuất xứ</td>
                    <td className="px-6 py-4 text-sm">{product.origin}</td>
                  </tr>
                )}
                {product.specifications && (
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Chỉ tiêu chất lượng</td>
                    <td className="px-6 py-4 text-sm">{product.specifications}</td>
                  </tr>
                )}
                {product.usage && (
                  <tr>
                    <td className="px-6 py-4 font-medium text-sm bg-muted">Hướng dẫn sử dụng</td>
                    <td className="px-6 py-4 text-sm">{product.usage}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
