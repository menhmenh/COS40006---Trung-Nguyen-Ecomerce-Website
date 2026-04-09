'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

import type { CartItem, Product } from '@/lib/types'

type ProductSnapshot = Pick<Product, 'id' | 'name' | 'price' | 'image'>

interface CartContextType {
  items: CartItem[]
  addItem: (product: ProductSnapshot, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      const parsed = JSON.parse(storedCart) as Array<Partial<CartItem>>
      setItems(
        parsed.map((item) => ({
          productId: item.productId || '',
          productName: item.productName || 'Product',
          quantity: Number(item.quantity || 0),
          price: Number(item.price || 0),
          image: item.image || '/placeholder.svg',
        })),
      )
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: ProductSnapshot, quantity = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id)

      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
          image: product.image,
        },
      ]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
