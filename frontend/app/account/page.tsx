'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"

import ProfileTab from "@/components/account/profile-tab"
import OrderHistoryTab from "@/components/account/order-history-tab"
import SubscriptionManagementTab from "@/components/account/subscription-management-tab"
import InvoiceHistory from "@/components/account/invoice-history"
import PaymentMethodsTab from "@/components/account/payment-methods-tab"

export default function AccountPage() {

  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">

        <h1 className="text-4xl font-bold mb-8">
          My Account
        </h1>

      <Tabs defaultValue="profile">

        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab user={user}/>
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionManagementTab userId={user.id}/>
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistoryTab userId={user.id}/>
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceHistory userId={user.id}/>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentMethodsTab userId={user.id}/>
        </TabsContent>

        </Tabs>

      </div>
      <Footer />
    </>
  )
}