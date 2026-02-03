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
      <Header />

      {/* Hero Section */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
                Alowishus Delicious Coffee
              </h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                A drink from the "My Alowishus" bottled brews range OR grab one of our delicious coffee's.
              </p>
              <div className="flex items-center gap-2 mb-8">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-foreground text-foreground" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  4.9 out of 5 Overall Star Rating for All Local Business.
                </span>
              </div>
              <div className="flex gap-4">
                <Button className="rounded-full px-8">DOWNLOAD APP</Button>
                <Link href="/products">
                  <Button variant="outline" className="rounded-full px-8 bg-transparent">
                    SHOP COFFEE
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src="/hero-coffee.png"
                alt="Alowishus Coffee"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Explore Our Alowishus
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A drink from the "My Alowishus" bottled brews range OR grab one of our delicious coffee's.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Catering */}
            <div className="text-center p-8 bg-muted rounded-2xl">
              <div className="flex justify-center mb-6">
                <Utensils className="h-20 w-20 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Our Catering</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Alowishus Catering, delicious drop off Catering
              </p>
              <Button className="rounded-full px-6">ORDER CATERING</Button>
            </div>

            {/* Food Menu */}
            <div className="text-center p-8 bg-muted rounded-2xl">
              <div className="flex justify-center mb-6">
                <Coffee className="h-20 w-20 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">The Food</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our entire menu is available as dine in or takeaway.
              </p>
              <Button className="rounded-full px-6">FOOD MENU</Button>
            </div>

            {/* Gelato */}
            <div className="text-center p-8 bg-muted rounded-2xl">
              <div className="flex justify-center mb-6">
                <IceCream className="h-20 w-20 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">The Gelato</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Life is like GELATO, enjoy it before it melts.
              </p>
              <Button className="rounded-full px-6">DISCOVER MORE</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Order Favorite Coffee */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <Image
                src="/images/image.png"
                alt="Coffee Cups"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Order Your Favourite Coffee
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
              </p>
              <Link href="/products">
                <Button className="rounded-full px-8">ORDER NOW</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Coffee */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Best Selling Coffee
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A drink from the "My Alowishus" bottled brews range OR grab one of our delicious coffee's.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="rounded-full px-8 bg-transparent">
                VIEW ALL PRODUCTS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Instant Coffee */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Instant Coffee At Your Home
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
              </p>
              <Button className="rounded-full px-8">DOWNLOAD OUR APP</Button>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/images/image.png"
                alt="Mobile App"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/image.png"
                  alt="Customer 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/image.png"
                  alt="Customer 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                What Our Customers Say
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-bold">4.9</span>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-foreground text-foreground" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">based on 2424+ reviews</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted p-8 rounded-2xl">
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-foreground text-foreground" />
                ))}
              </div>
              <h3 className="font-bold mb-2">Imam White</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet do amet sint. Velit officia"
              </p>
            </div>
            <div className="bg-muted p-8 rounded-2xl">
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-foreground text-foreground" />
                ))}
              </div>
              <h3 className="font-bold mb-2">Sarah Johnson</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Ill non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Aurel deserunt ullamco est sit aliqua dolor do amet"
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
