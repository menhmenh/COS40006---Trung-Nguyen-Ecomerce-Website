'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SubscriptionPlansGrid } from '@/components/subscriptions/subscription-plans-grid';
import { Coffee, Zap, Heart } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';

// Animation variants - moved outside component to prevent hydration mismatch
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

const badgeVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.3,
      duration: 0.5,
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.5,
    },
  },
};

export default function SubscriptionPlansPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 bg-linear-to-br from-slate-50 via-white to-slate-50"
      >
      {/* Header section with background decoration */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute w-96 h-96 bg-linear-to-br from-amber-200/20 to-orange-200/20 rounded-full -top-32 -left-32 blur-3xl"
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-linear-to-br from-green-200/20 to-emerald-200/20 rounded-full -bottom-32 -right-32 blur-3xl"
          animate={{
            x: [0, -20, 10, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: 0.5,
          }}
        />

        {/* Header content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
          <motion.div variants={headerVariants} initial="hidden" animate="visible" className="text-center space-y-8">
            {/* Title with icon */}
            <div className="space-y-4">
              <motion.div variants={badgeVariants} initial="hidden" animate="visible" className="flex justify-center">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-amber-100 to-orange-100 border border-amber-200"
                  whileHover={{ scale: 1.05 }}
                >
                  <Coffee className="text-amber-700 size-5" />
                  <span className="font-semibold text-amber-900">Premium Coffee Subscriptions</span>
                  <Zap className="text-amber-700 size-5" />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-bold bg-linear-to-r from-slate-900 via-amber-900 to-slate-900 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                }}
              >
                Discover Your Perfect Coffee Match
              </motion.h1>

              <motion.p
                variants={descriptionVariants}
                className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
              >
                Get freshly roasted, single-origin coffee delivered to your door every month. Choose your roast, customize your preferences, and enjoy world-class coffee with exclusive member benefits.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
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
                { number: '10K+', label: 'Happy Members' },
                { number: '50+', label: 'Coffee Origins' },
                { number: '30%', label: 'Save vs Retail' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="p-4 rounded-lg bg-white/50 backdrop-blur border border-slate-200/50"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-amber-900">{stat.number}</div>
                  <div className="text-xs md:text-sm text-slate-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Plans section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Plans grid */}
        <SubscriptionPlansGrid plans={SUBSCRIPTION_PLANS} />

        {/* Guarantee section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 p-8 rounded-2xl bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-center space-y-4"
        >
          <div className="flex justify-center gap-2">
            <Heart className="text-red-500 fill-red-500" size={24} />
            <Heart className="text-red-500 fill-red-500" size={24} />
            <Heart className="text-red-500 fill-red-500" size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-green-900 mb-2">100% Satisfaction Guaranteed</h4>
            <p className="text-green-800">
              If you're not completely satisfied with your first box, we'll give you a full refund.
              No questions asked. That's our promise to you.
            </p>
          </div>
        </motion.div>
      </div>
      </motion.div>
      <Footer />
    </div>
  );
}
