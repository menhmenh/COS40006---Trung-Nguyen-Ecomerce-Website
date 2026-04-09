'use client'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Category, Product } from '@/lib/types'

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
  }

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(Array.isArray(data) ? data : [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock || '0', 10),
      description: formData.description,
      image: formData.image,
    }

    try {
      if (editingProduct) {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProduct.id, ...productData }),
        })

        if (res.ok) {
          toast({ description: 'Product updated successfully' })
        }
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        })

        if (res.ok) {
          toast({ description: 'Product created successfully' })
        }
      }

      fetchProducts()
      resetForm()
      setIsOpen(false)
    } catch (error) {
      toast({ description: 'Failed to save product', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast({ description: 'Product deleted successfully' })
        fetchProducts()
      }
    } catch (error) {
      toast({ description: 'Failed to delete product', variant: 'destructive' })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: product.image,
    })
    setIsOpen(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      description: '',
      image: '',
    })
  }

  return (
    <div className="bg-white rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1B1B1D]">{'Products'}</h2>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#1B1B1D] text-white hover:bg-[#1B1B1D]/90 rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" />
              {'Add Product'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{'Product Name'}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{'Category'}</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{'Price'}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">{'Stock'}</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{'Description'}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">{'Image URL'}</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/products/product-name.png"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false)
                    resetForm()
                  }}
                  className="rounded-full"
                >
                  {'Cancel'}
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1B1B1D] text-white hover:bg-[#1B1B1D]/90 rounded-full px-6"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EEEFF1]">
              <th className="text-left py-4 px-4 font-semibold text-[#1B1B1D]">{'Product'}</th>
              <th className="text-left py-4 px-4 font-semibold text-[#1B1B1D]">{'Category'}</th>
              <th className="text-left py-4 px-4 font-semibold text-[#1B1B1D]">{'Price'}</th>
              <th className="text-left py-4 px-4 font-semibold text-[#1B1B1D]">{'Stock'}</th>
              <th className="text-right py-4 px-4 font-semibold text-[#1B1B1D]">{'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[#EEEFF1] hover:bg-[#F3F4F5]">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <div className="font-medium text-[#1B1B1D]">{product.name}</div>
                      <div className="text-xs text-[#64646A]">{product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#64646A]">{product.categoryName}</td>
                <td className="py-4 px-4 text-[#1B1B1D] font-medium">${product.price}</td>
                <td className="py-4 px-4 text-[#64646A]">{product.stock}</td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="rounded-full"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="rounded-full text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
