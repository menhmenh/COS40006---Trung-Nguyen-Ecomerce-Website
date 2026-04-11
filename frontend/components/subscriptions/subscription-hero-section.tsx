'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coffee, Zap, Heart, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

export function SubscriptionHeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.4 + i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-amber-50 py-20 md:py-32"
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-amber-200/30 to-orange-200/30 rounded-full blur-3xl -mr-48 -mt-48"
        animate={{
          y: [0, 30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-green-200/30 to-emerald-200/30 rounded-full blur-3xl -ml-48 -mb-48"
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-amber-100 to-orange-100 border border-amber-300">
                <Star className="text-amber-600 size-5 fill-amber-600" />
                <span className="font-semibold text-amber-900">New: Coffee Monthly Box</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-slate-900 via-amber-900 to-slate-900 bg-clip-text text-transparent leading-tight">
                Fresh Coffee
                <br />
                Delivered Monthly
              </h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                Get hand-picked, freshly roasted coffee delivered to your door every month. Choose your roast, customize your preferences, and enjoy exclusive member benefits.
              </p>
            </motion.div>

            {/* Features list */}
            <motion.div
              className="space-y-4 py-4"
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
                { icon: Coffee, text: 'Premium coffee from around the world' },
                { icon: Zap, text: 'Fresh roasted within 72 hours' },
                { icon: Heart, text: '100% Satisfaction guaranteed' },
                { icon: TrendingUp, text: 'Save 20-30% vs retail prices' },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    variants={featureVariants}
                    custom={i}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors"
                    whileHover={{ x: 8 }}
                  >
                    <motion.div
                      className="p-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-white shrink-0"
                      whileHover={{ rotate: 12, scale: 1.1 }}
                    >
                      <Icon size={24} />
                    </motion.div>
                    <span className="font-medium text-slate-700">{feature.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                <Link href="/subscriptions/plans">
                  <Button className="w-full sm:w-auto px-8 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-xl transition-all">
                    <motion.span className="flex items-center gap-2" whileHover={{ x: 4 }}>
                      <Coffee size={20} />
                      Subscribe Now
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                <Link href="/subscriptions">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    View Plans
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-slate-900">5.0 out of 5</p>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-bold text-slate-900">2,847 reviews</p>
                <p>from happy subscribers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right image/graphic */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex items-center justify-center"
          >
            <motion.div
              className="relative w-full max-w-md"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Coffee cup graphic */}
              <div className="relative">
                <motion.div
                  className="w-full aspect-square rounded-3xl bg-linear-to-br from-amber-100 via-orange-100 to-red-100 shadow-2xl flex items-center justify-center overflow-hidden border-4 border-amber-200"
                  animate={{
                    boxShadow: [
                      '0 20px 60px rgba(217, 119, 6, 0.3)',
                      '0 20px 80px rgba(217, 119, 6, 0.5)',
                      '0 20px 60px rgba(217, 119, 6, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  {/* Coffee cup emoji/illustration */}
                  <motion.div
                    className="text-9xl"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    ☕
                  </motion.div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-white shadow-lg border-2 border-emerald-500 font-bold text-emerald-700"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    delay: 0.5,
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  Fresh ✓
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 px-4 py-2 rounded-full bg-white shadow-lg border-2 border-blue-500 font-bold text-blue-700"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -10, 0],
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  Premium ⭐
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -right-8 w-16 h-16 rounded-full bg-linear-to-br from-green-500 to-emerald-500 shadow-lg flex items-center justify-center text-white font-bold text-xl"
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    delay: 0.8,
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  30% OFF
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { number: '10K+', label: 'Happy Subscribers' },
            { number: '50+', label: 'Coffee Origins' },
            { number: '4.9★', label: 'Average Rating' },
            { number: '100%', label: 'Satisfaction Guarantee' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-xl bg-white/50 backdrop-blur border border-slate-200 text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="text-3xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-slate-600 font-medium mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
