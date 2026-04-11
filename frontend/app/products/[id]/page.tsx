'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Star, Minus, Plus, ArrowLeft, Coffee } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/lib/types'
import { trackProductView, trackAddToCart } from '@/lib/recommendations'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // --- BỘ HOOKS PHẢI LUÔN NẰM TRÊN CÙNG ---

  // 1. Hook tải dữ liệu sản phẩm
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
              .filter((item: Product) => 
                item.category === productData.category && item.id !== productData.id
              )
              .slice(0, 3)
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

  // 2. Hook theo dõi lượt xem (Tracking) - Đã sửa lỗi vi phạm Hook Rules
  useEffect(() => {
    if (user?.id && product?.id) {
      trackProductView(user.id, product.id, product.category)
    }
  }, [user?.id, product?.id, product?.category])

  // --- CÁC ĐIỀU KIỆN RENDER SỚM (PHẢI NẰM SAU HOOKS) ---

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Coffee className="h-10 w-10 animate-spin text-[#C5A059] mb-4" />
        <p className="font-medium tracking-wider uppercase text-[#3E2723]">Đang pha cà phê...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-[#3E2723]">Không tìm thấy sản phẩm</h1>
          <Link href="/products">
            <Button className="rounded-full bg-[#3E2723]">Quay lại Cửa hàng</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }, quantity)

    if (user?.id) {
      trackAddToCart(user.id, product.id, product.category)
    }
    
    toast({
      title: 'Đã thêm vào giỏ hàng',
      description: `Đã thêm ${quantity} x ${product.name} vào giỏ hàng thành công`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12">
        <Link href="/products">
          <Button variant="ghost" className="mb-8 hover:bg-muted rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại Cửa hàng
          </Button>
        </Link>

        {/* Thông tin chính sản phẩm */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Ảnh sản phẩm */}
          <div className="md:col-span-1">
            <div className="bg-muted rounded-2xl p-8 relative aspect-square border border-border overflow-hidden">
              <Image 
                src={product.image || "/placeholder.svg"} 
                alt={product.name || "Product image"} 
                fill 
                className="object-contain p-8 hover:scale-110 transition-transform duration-500" 
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-[#C5A059] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Nội dung chi tiết */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#3E2723]">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                {product.sku && `Mã: ${product.sku} | `}
                Danh mục: {product.categoryName || product.category}
              </span>
            </div>

            <div className="text-4xl font-bold mb-6 text-[#C5A059]">
              {product.price.toLocaleString('vi-VN')} đ
            </div>

            {/* Đánh giá sao */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(product.rating)
                        ? 'fill-[#C5A059] text-[#C5A059]'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} lượt đánh giá)
              </span>
            </div>

            {/* Trạng thái kho hàng */}
            <div className="mb-8">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `Còn hàng: ${product.stock}` : 'Hết hàng'}
              </span>
            </div>

            <p className="text-[#5D4037] mb-8 leading-relaxed text-lg italic">
              "{product.description}"
            </p>

            {/* Chọn số lượng */}
            <div className="mb-8">
              <label className="text-sm font-bold mb-3 block uppercase tracking-wider text-[#3E2723]">Số lượng</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-full p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-full h-10 w-10"
                    disabled={product.stock <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-bold w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-full h-10 w-10"
                    disabled={product.stock <= quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 rounded-full py-7 text-sm font-bold uppercase tracking-widest bg-[#3E2723] hover:bg-[#2A1B18]"
                disabled={product.stock <= 0}
              >
                THÊM VÀO GIỎ HÀNG
              </Button>
              <Button
                onClick={() => {
                  handleAddToCart();
                  router.push('/cart');
                }}
                variant="outline"
                className="flex-1 rounded-full py-7 text-sm font-bold uppercase tracking-widest border-[#3E2723] text-[#3E2723]"
                disabled={product.stock <= 0}
              >
                MUA NGAY
              </Button>
            </div>
          </div>
        </div>

        {/* Bảng chi tiết kỹ thuật */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tighter text-[#3E2723] border-b-2 border-[#C5A059] inline-block">Thông số chi tiết</h2>
          <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <tbody>
                {[
                  { label: 'Mã sản phẩm', value: product.sku },
                  { label: 'Thương hiệu', value: product.brand },
                  { label: 'Đơn vị tính', value: product.unit },
                  { label: 'Quy cách', value: product.packaging },
                  { label: 'Hạn sử dụng', value: product.expiry },
                  { label: 'Xuất xứ', value: product.origin },
                  { label: 'Chỉ tiêu chất lượng', value: product.specifications },
                  { label: 'Hướng dẫn sử dụng', value: product.usage }
                ].map((row, idx) => row.value && (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-muted/30' : 'bg-white'}>
                    <td className="px-6 py-4 font-bold text-sm text-[#3E2723] w-1/3 border-r border-border uppercase tracking-tight">{row.label}</td>
                    <td className="px-6 py-4 text-sm text-[#5D4037]">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-10 text-center text-[#3E2723] uppercase tracking-tighter">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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