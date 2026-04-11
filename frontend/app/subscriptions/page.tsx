'use client';

import { motion } from 'framer-motion';
import { SubscriptionDetailsCard } from '@/components/subscriptions/subscription-details-card';
import { Button } from '@/components/ui/button';
import { Coffee, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const USER_SUBSCRIPTIONS = [
  {
    subscription_id: 'sub-001',
    planName: 'Premium Monthly',
    price: 49.99,
    status: 'active' as const,
    nextBillingDate: 'April 25, 2026',
    createdDate: 'January 15, 2026',
    coffeeQuantity: 4,
    skippedMonths: 1,
    maxSkipPerYear: 3,
  },
  {
    subscription_id: 'sub-002',
    planName: 'Deluxe Monthly',
    price: 79.99,
    status: 'active' as const,
    nextBillingDate: 'May 10, 2026',
    createdDate: 'February 20, 2026',
    coffeeQuantity: 6,
    skippedMonths: 0,
    maxSkipPerYear: 6,
  },
];

export default function SubscriptionsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const noSubscriptionsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Header />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-linear-to-br from-stone-50 via-amber-50/20 to-stone-100"
      >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden bg-linear-to-r from-stone-700 via-amber-800 to-stone-800 text-amber-50"
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Coffee className="size-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Your Subscriptions</h1>
            </motion.div>
            <p className="text-amber-100/90 text-lg max-w-2xl mx-auto">
              Manage all your coffee subscriptions in one place. View upcoming shipments, skip months, and adjust your preferences anytime.
            </p>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            {[
              { number: USER_SUBSCRIPTIONS.length, label: 'Active Plans' },
              {
                number: USER_SUBSCRIPTIONS.reduce((sum, sub) => sum + sub.coffeeQuantity, 0),
                label: 'Bags/Month',
              },
              {
                number: `$${USER_SUBSCRIPTIONS.reduce((sum, sub) => sum + sub.price, 0).toFixed(2)}`,
                label: 'Monthly Cost',
              },
              { number: '📦', label: 'Next Shipment' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-lg bg-white/20 backdrop-blur border border-white/30"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                  },
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-xs text-amber-100/90 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {USER_SUBSCRIPTIONS.length > 0 ? (
          <>
            {/* Active subscriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold flex items-center gap-2 text-slate-900">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="text-emerald-600" />
                    </motion.div>
                    Your Active Subscriptions
                  </h2>
                  <p className="text-slate-600">
                    {USER_SUBSCRIPTIONS.length} subscription{USER_SUBSCRIPTIONS.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/subscriptions/plans">
                    <Button className="bg-linear-to-r from-stone-700 to-amber-700 text-amber-50 px-6 py-3 rounded-lg hover:shadow-lg">
                      <Plus className="mr-2 size-5" />
                      Add New Plan
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Subscriptions grid */}
              <motion.div
                className="grid md:grid-cols-2 gap-8"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: 0.4,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                {USER_SUBSCRIPTIONS.map((subscription) => (
                  <SubscriptionDetailsCard
                    key={subscription.subscription_id}
                    subscription={subscription}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Benefits section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 p-8 bg-linear-to-r from-stone-100 to-amber-100 rounded-2xl border-2 border-amber-200"
            >
              <h3 className="text-2xl font-bold text-stone-900 mb-6">Member Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: '🚚',
                    title: 'Free Priority Shipping',
                    desc: 'On all subscription boxes',
                  },
                  {
                    icon: '💰',
                    title: 'Save 20-30%',
                    desc: 'Compared to retail prices',
                  },
                  {
                    icon: '🎁',
                    title: 'Exclusive Perks',
                    desc: 'Early access to new roasts',
                  },
                  {
                    icon: '⏸️',
                    title: 'Full Control',
                    desc: 'Skip, pause, or change anytime',
                  },
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 rounded-lg bg-white/50 backdrop-blur"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl mb-2">{benefit.icon}</div>
                    <h4 className="font-bold text-stone-900">{benefit.title}</h4>
                    <p className="text-sm text-stone-700">{benefit.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* Empty state */
          <motion.div
            variants={noSubscriptionsVariants}
            initial="hidden"
            animate="visible"
            className="text-center py-20"
          >
            <motion.div
              className="mb-8 flex justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Coffee className="size-24 text-slate-300" />
            </motion.div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">No Active Subscriptions</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Start your coffee journey today. Choose from our amazing subscription plans and get
              fresh, roasted coffee delivered to your door every month.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/subscriptions/plans">
                <Button className="bg-linear-to-r from-stone-700 to-amber-700 text-amber-50 px-8 py-6 text-base font-bold rounded-lg hover:shadow-lg">
                  <Coffee className="mr-2 size-5" />
                  Explore Subscription Plans
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
    <Footer />
  </>
  );
}
