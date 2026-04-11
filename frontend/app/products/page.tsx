'use client'

import { useEffect, useMemo, useState } from 'react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { CategorySidebar } from '@/components/category-sidebar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'

import type { Category, Product } from '@/lib/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ])

        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
        ])

        setProducts(Array.isArray(productsData) ? productsData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (error) {
        console.error('Failed to load products page data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== 'all') {
      result = result.filter((product) => product.category === selectedCategory)
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => {
          if (a.badge && !b.badge) return -1
          if (!a.badge && b.badge) return 1
          return 0
        })
    }

    return result
  }, [products, searchQuery, selectedCategory, sortBy])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <div className="bg-[#3E2723] text-[#C5A059] py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest">Shop Our Coffee</h1>
        </div>
      </div>

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-full border-gray-300 focus:ring-[#C5A059] focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-[#3E2723] text-white px-4 py-3 font-semibold text-sm uppercase tracking-wider">CATEGORIES</div>
                <CategorySidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Top Bar */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground font-medium">
                  Showing <span className="text-[#3E2723] font-bold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 rounded-full border-gray-300 focus:ring-[#C5A059]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                    <SelectItem value="rating">Rating: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                   <Coffee className="h-10 w-10 animate-spin text-[#C5A059] mb-4" />
                   <p className="font-medium tracking-wider uppercase text-[#3E2723]">Brewing products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-gray-300">
                  <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-[#3E2723] font-medium text-lg">
                    No products found.
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6 rounded-full border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}