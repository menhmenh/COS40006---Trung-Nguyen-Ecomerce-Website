import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/store'
import { Star, Utensils, Coffee, IceCream, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const bestSellers = products.filter((p) => p.badge).slice(0, 3)

  return (
    <div className="min-h-screen">
   

    {/* Hero Section */}
      <section className="bg-muted py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#3E2723] leading-tight">
                TRUNG NGUYÊN <br />
                <span className="text-[#C5A059]">LEGEND</span> 
              </h1>
              <p className="text-[#5D4037] mb-8 leading-relaxed text-lg italic">
                "The coffee of great persons, inspiring creativity and energy on the journey of awakening."
              </p>
              
              {/* Rating Section - Giữ lại nhưng làm nhẹ nhàng hơn */}
              <div className="flex items-center gap-3 mb-10">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />
                  ))}
                </div>
                <span className="text-xs uppercase tracking-widest text-[#8D6E63] font-semibold">
                  World's Best Coffee Experience
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#3E2723] hover:bg-[#2A1B18] text-white rounded-full px-10 py-6 text-xs font-bold tracking-[0.2em] uppercase transition-all">
                  EXPLORE NOW
                </Button>
                <Link href="/products">
                  <Button variant="outline" className="border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white rounded-full px-10 py-6 text-xs font-bold tracking-[0.2em] uppercase transition-all bg-transparent">
                    SHOP COFFEE
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Section với hiệu ứng đổ bóng nhẹ */}
            <div className="relative h-[450px] md:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-[#C5A059]/5 rounded-full blur-3xl" /> {/* Ánh sáng vàng nhẹ phía sau ảnh */}
              <Image
                src="/ca-phe-phin-loc-giay-trung-nguyen.png" 
                alt="Trung Nguyen Coffee"
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </div>
      </section>

{/* Signature Collections Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#3E2723] uppercase tracking-tight">
              Our Signature Collections
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg italic">
              "Discover the essence of energy coffee, crafted for those who pursue greatness."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Packaged Coffee */}
            <div className="text-center p-10 bg-muted rounded-full border-b-4 border-transparent hover:border-[#C5A059] transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="flex justify-center mb-8">
                <Coffee className="h-20 w-20 text-[#3E2723] group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#3E2723] uppercase tracking-wide">Packaged Coffee</h3>
              <p className="text-[#5D4037] mb-8 leading-relaxed">
                Legendary G7, Sang Tao, and premium roasted beans that power your creative mind.
              </p>
              <Link href="/products?cat=packaged">
                <Button className="bg-[#3E2723] hover:bg-[#2A1B18] text-white rounded-full px-8 py-6 text-xs font-bold tracking-widest uppercase">
                  SHOP NOW
                </Button>
              </Link>
            </div>

            {/* Brewing Equipment */}
            <div className="text-center p-10 bg-muted rounded-full border-b-4 border-transparent hover:border-[#C5A059] transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="flex justify-center mb-8">
                <Utensils className="h-20 w-20 text-[#3E2723] group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#3E2723] uppercase tracking-wide">Coffee Tools</h3>
              <p className="text-[#5D4037] mb-8 leading-relaxed">
                Traditional Phin filters and modern brewing tools to master the art of coffee.
              </p>
              <Link href="/products?cat=tools">
                <Button className="bg-[#3E2723] hover:bg-[#2A1B18] text-white rounded-full px-8 py-6 text-xs font-bold tracking-widest uppercase">
                  DISCOVER TOOLS
                </Button>
              </Link>
            </div>

            {/* Life-changing Books */}
            <div className="text-center p-10 bg-muted rounded-full border-b-4 border-transparent hover:border-[#C5A059] transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="flex justify-center mb-8">
                <Star className="h-20 w-20 text-[#3E2723] group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#3E2723] uppercase tracking-wide">Gifts & Books</h3>
              <p className="text-[#5D4037] mb-8 leading-relaxed">
                Premium gift sets and the "Life-changing Bookcase" from Founder Dang Le Nguyen Vu.
              </p>
              <Link href="/products?cat=gifts">
                <Button className="bg-[#3E2723] hover:bg-[#2A1B18] text-white rounded-full px-8 py-6 text-xs font-bold tracking-widest uppercase">
                  VIEW COLLECTIONS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

{/* Order Favorite Coffee - The Energy Coffee Section */}
      <section className="py-16 bg-muted"> {/* Sử dụng màu kem nền của Trung Nguyên */}
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hình ảnh sản phẩm đặc trưng */}
            <div className="relative h-[450px] group">
              <div className="absolute inset-0 bg-[#C5A059]/10 rounded-full blur-3xl group-hover:bg-[#C5A059]/20 transition-colors duration-500" />
              <Image
                src="/trung-nguyen-store.png"  
                alt="Trung Nguyen Energy Coffee"
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Nội dung mời gọi */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#3E2723] uppercase tracking-tight leading-tight">
                Experience Your <br />
                <span className="text-[#C5A059]">Energy Coffee</span>
              </h2>
              <p className="text-[#5D4037] mb-8 leading-relaxed text-lg">
                More than just a delicious beverage, Trung Nguyen Legend coffee is a source of energy that triggers creativity, providing the clarity you need to conquer new heights of success.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button className="bg-[#3E2723] hover:bg-[#2A1B18] text-white rounded-full px-10 py-7 text-xs font-bold tracking-[0.2em] uppercase w-full sm:w-auto">
                    ORDER NOW
                  </Button>
                </Link>
                <Link href="/products?category=best-seller">
                  <Button variant="outline" className="border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white rounded-full px-10 py-7 text-xs font-bold tracking-[0.2em] uppercase w-full sm:w-auto bg-transparent">
                    BEST SELLERS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Best Selling Coffee - Top Energy Choices */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#3E2723] uppercase tracking-tight">
              Best Selling Coffee
            </h2>
            <p className="text-[#5D4037] max-w-2xl mx-auto leading-relaxed text-lg">
              Explore our most loved energy coffees, trusted by millions of coffee enthusiasts worldwide for their awakening power.
            </p>
          </div>

          {/* Grid hiển thị sản phẩm */}
          <div className="grid md:grid-cols-3 gap-8">
            {bestSellers.map((product) => (
              <div key={product.id} className="group">
                <ProductCard product={product} />
                {/* Lưu ý: Nếu bạn muốn ProductCard cũng có phong cách Trung Nguyên, 
                   chúng ta sẽ cần vào file ProductCard để sửa nút "Add to cart" thành màu Nâu/Vàng.
                */}
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/products">
              <Button 
                variant="outline" 
                className="border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white rounded-full px-10 py-6 text-xs font-bold tracking-[0.2em] uppercase transition-all bg-transparent"
              >
                VIEW ALL PRODUCTS
              </Button>
            </Link>
          </div>
        </div>
      </section>

{/* Instant Coffee - G7 & Legend Special Edition */}
      <section className="py-16 bg-white"> {/* Đổi bg-muted sang trắng để làm nổi bật hình ảnh sản phẩm */}
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#3E2723] uppercase tracking-tight leading-tight">
                G7 Instant Coffee <br />
                <span className="text-[#C5A059]">Anytime, Anywhere</span>
              </h2>
              <p className="text-[#5D4037] mb-8 leading-relaxed text-lg">
                The world-famous G7 instant coffee brings you the bold, authentic flavor of Vietnamese coffee in just seconds. Perfect for your busy lifestyle without compromising on the legendary taste.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#3E2723] hover:bg-[#2A1B18] text-white rounded-full px-8 py-6 text-xs font-bold tracking-widest uppercase">
                  SHOP G7 COLLECTIONS
                </Button>
                {/* Giữ lại ý tưởng App nếu bạn muốn, nhưng chuyển sang phong cách Trung Nguyên */}
                <Button variant="outline" className="border-[#3E2723] text-[#3E2723] rounded-full px-8 py-6 text-xs font-bold tracking-widest uppercase bg-transparent">
                  DOWNLOAD MEMBERSHIP APP
                </Button>
              </div>
            </div>

            <div className="relative h-[450px] order-1 md:order-2">
              {/* Hiệu ứng trang trí phía sau sản phẩm */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#C5A059]/5 rounded-full blur-3xl" />
              <Image
                src="/g7-coffee-display.png" 
                alt="G7 Instant Coffee"
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </div>
      </section>

{/* Testimonials - Inspiring Experiences */}
      <section className="py-16 md:py-24 bg-white"> {/* Sử dụng nền kem đồng bộ */}
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-[#3E2723] rounded-none overflow-hidden relative shadow-2xl">
                <Image
                  src="/images/testimonial-1.jpg" // Thay bằng ảnh không gian quán hoặc khách hàng sang trọng
                  alt="Legendary Experience"
                  fill
                  className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="aspect-square bg-[#C5A059] rounded-none overflow-hidden relative shadow-2xl mt-8">
                <Image
                  src="/images/testimonial-2.png" 
                  alt="Coffee Moments"
                  fill
                  className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#3E2723] uppercase tracking-tight">
                What Our <br />
                <span className="text-[#C5A059]">Community Says</span>
              </h2>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-6xl font-bold text-[#3E2723]">4.9</span>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-[#C5A059] text-[#C5A059]" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-[#8D6E63] uppercase tracking-widest">Global Energy Community</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white transition-all">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white transition-all">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-10 rounded-none border-l-4 border-[#C5A059] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />
                ))}
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#3E2723] uppercase tracking-wide">Alexander Nguyen</h3>
              <p className="text-[#5D4037] italic leading-relaxed">
                "Trung Nguyen Legend is not just coffee; it's a source of inspiration. Every morning with a cup of Legend coffee helps me stay focused and creative for a long working day."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-10 rounded-none border-l-4 border-[#C5A059] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />
                ))}
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#3E2723] uppercase tracking-wide">Elena Smith</h3>
              <p className="text-[#5D4037] italic leading-relaxed">
                "I was completely impressed by the rich flavor of G7. It's amazing that I can enjoy a true Vietnamese coffee taste so conveniently at home in London."
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
