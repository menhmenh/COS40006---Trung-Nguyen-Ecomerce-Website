'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductManagement from '@/components/admin/product-management'
import OrderManagement from '@/components/admin/order-management'
import { Shield } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F5]">
    
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#1B1B1D] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#1B1B1D]">{'Admin Dashboard'}</h1>
          </div>
          <p className="text-[#64646A] text-lg">{'Manage your coffee products and orders'}</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-white">
            <TabsTrigger value="products" className="data-[state=active]:bg-[#1B1B1D] data-[state=active]:text-white">
              {'Products'}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#1B1B1D] data-[state=active]:text-white">
              {'Orders'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
