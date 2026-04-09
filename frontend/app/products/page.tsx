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
import { Search } from 'lucide-react'

import type { Category, Product } from '@/lib/types'

export default function ProductsPage() {
  // States từ nhánh chị Nhi (Dùng dữ liệu thật)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  // Logic gọi API từ nhánh chị Nhi
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

  // Logic lọc và sắp xếp sản phẩm
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
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold uppercase">Shop Our Coffee</h1>
        </div>
      </div>

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar (Từ nhánh chị Anh) */}
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
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 font-medium text-sm">CATEGORIES</div>
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
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
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

              {/* Products Grid với Loading State của chị Nhi */}
              {loading ? (
                <div className="py-16 text-center text-muted-foreground">
                  Loading products...
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    No products found. Try adjusting your filters.
                  </p>
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